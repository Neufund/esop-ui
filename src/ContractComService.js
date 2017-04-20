import {web3} from './web3';
import contractBuilder from "truffle-contract"

//TODO: actually we need just ABI contracts here - find way to provide those during build process
import RoTDef from '/home/banciur/projects/neufund/ESOP/build/contracts/RoT.json'
import ESOPDef from '/home/banciur/projects/neufund/ESOP/build/contracts/ESOP.json'
import EmployeesListDef from '/home/banciur/projects/neufund/ESOP/build/contracts/EmployeesList.json'
import OptionsCalculatorDef from '/home/banciur/projects/neufund/ESOP/build/contracts/OptionsCalculator.json'

export default class ContractComService {
    constructor(store) {
        this.store = store;

        this.RoTContractAbstr = contractBuilder(RoTDef);
        this.RoTContractAbstr.setProvider(web3.currentProvider);
        //TODO: it should be not deployed but .at() with address set through configuration created build deployment
        this.RoTContract = this.RoTContractAbstr.deployed();

        this.ESOPContractAbstr = contractBuilder(ESOPDef);
        this.ESOPContractAbstr.setProvider(web3.currentProvider);

        this.EmployeesListContractAbstr = contractBuilder(EmployeesListDef);
        this.EmployeesListContractAbstr.setProvider(web3.currentProvider);

        this.OptionsCalculatorAbstr = contractBuilder(OptionsCalculatorDef);
        this.OptionsCalculatorAbstr.setProvider(web3.currentProvider);
    }

    obtainContractAddreses = async() => {

        let ESOPAddress = await this.RoTContract.then(contract => {
            this.store.dispatch({
                type: "SET_CONTRACT_ADDRESS",
                address: {RoTAddress: contract.address}
            });
            return contract.ESOPAddress()
        });
        this.store.dispatch({
            type: "SET_CONTRACT_ADDRESS",
            address: {ESOPAddress}
        });

        this.ESOPContract = this.ESOPContractAbstr.deployed();
        //this.ESOPContract = this.ESOPContractAbstr.at(ESOPAddress);

        let EmployeesListAddress = await this.ESOPContract.then(contract => contract.employees());
        let OptionsCalculatorAddress = await this.ESOPContract.then(contract => contract.optionsCalculator());

        this.store.dispatch({
            type: "SET_CONTRACT_ADDRESS",
            address: {EmployeesListAddress}
        });
        this.EmployeesListContract = this.EmployeesListContractAbstr.deployed();
        //this.EmployeesListContract = this.EmployeesListContractAbstr.at(EmployeesListAddress);

        this.store.dispatch({
            type: "SET_CONTRACT_ADDRESS",
            address: {OptionsCalculatorAddress}
        });
        this.OptionsCalculatorContract = this.OptionsCalculatorAbstr.deployed();
        //this.OptionsCalculatorContract = this.OptionsCalculatorAbstr.at(EmployeesListAddress);

        //TODO: also there should be options converter address
    };

    getCompanyAddress = rotContract => rotContract.then(contract => contract.owner());

    getESOPData = () => this.ESOPContract.then(contract => {
        let dataPromises = [
            //CONFIG
            contract.totalPoolOptions(), // total poolOptions in The Pool
            contract.ESOPLegalWrapperIPFSHash(), // ipfs hash of document establishing this ESOP
            contract.minimumManualSignPeriod(), // default period for employee signature

            // STATE
            contract.remainingPoolOptions(), // poolOptions that remain to be assigned
            contract.esopState(), // state of ESOP (0)New, (1)Open, (2)Conversion
            contract.totalExtraOptions(), // how many extra options inserted
            contract.conversionOfferedAt(), // when conversion event happened
            contract.exerciseOptionsDeadline(), // employee conversion deadline
        ];
        return Promise.all(dataPromises);
    });

    parseESOPData = data => {
        return {
            totalPoolOptions: data[0].toString(),
            ESOPLegalWrapperIPFSHash: data[1].toString(),
            minimumManualSignPeriod: data[2].toString(),
            remainingPoolOptions: data[3].toString(),
            esopState: data[4].toString(),
            totalExtraOptions: data[5].toString(),
            conversionOfferedAt: data[6].toString(),
            exerciseOptionsDeadline: data[7].toString(),
        };
    };

    getOptionsData = () => this.OptionsCalculatorContract.then(contract => {
        let dataPromises = [
            contract.cliffPeriod(), // cliff duration in seconds
            contract.vestingPeriod(), // vesting duration in seconds
            contract.maxFadeoutPromille(), // maximum promille that can fade out
            contract.bonusOptionsPromille(), // exit bonus promille
            contract.newEmployeePoolPromille(), // per mille of unassigned poolOptions that new employee gets
            contract.optionsPerShare(), // per mille of unassigned poolOptions that new employee gets
            contract.strikePrice(), // options strike price
        ];
        return Promise.all(dataPromises);
    });

    perseOptionsData = data => {
        return {
            cliffPeriod: data[0].toString(),
            vestingPeriod: data[1].toString(),
            maxFadeoutPromille: data[2].toString(),
            bonusOptionsPromille: data[3].toString(),
            newEmployeePoolPromille: data[4].toString(),
            optionsPerShare: data[5].toString(),
            strikePrice: data[6].toString(),
        };
    };

    getEmployeesList = async EmployeesListContract => {

        let employeeNumber = await EmployeesListContract.then(contract => contract.size());

        let employeeAddresses = await EmployeesListContract.then(contract => {
            let dataPromises = [];
            for (let i = 0; i < employeeNumber; i++) {
                dataPromises.push(contract.addresses(i));
            }
            return Promise.all(dataPromises);
        });

        return EmployeesListContract.then(contract => {
            let dataPromises = [];
            for (let i = 0; i < employeeNumber; i++) {
                let employeeAddress = employeeAddresses[i];
                dataPromises.push(contract.getEmployee(employeeAddress).then(employee => ({
                    address: employeeAddress,
                    data: employee
                })));
            }
            return Promise.all(dataPromises);
        });
    };

    parseEmployeesList = data => {
        return data.map((employee) => {
            return {
                address: employee.address,
                issueDate: employee.data[0].toString(), // when vesting starts
                timeToSign: employee.data[1].toString(), // wait for employee signature until that time
                terminatedAt: employee.data[2].toString(), // date when employee was terminated, 0 for not terminated
                fadeoutStarts: employee.data[3].toString(),
                poolOptions: employee.data[4].toString(), // poolOptions employee gets (exit bonus not included)
                extraOptions: employee.data[5].toString(),
                suspendedAt: employee.data[6].toString(), // time at which employee got suspended, 0 - not suspended
                state: employee.data[7].toString(), // (0)NotSet, (1)WaitingForSignature, (2)Employed, (3)Terminated, (4)OptionsExercised
            }
        });
    };

    async obtainESOPData() {
        let companyAddress = this.getCompanyAddress(this.RoTContract);
        let ESOPData = this.getESOPData().then(result => this.parseESOPData(result));
        let OptionsData = this.getOptionsData().then(result => this.perseOptionsData(result));
        let employees = this.getEmployeesList(this.EmployeesListContract).then(result => this.parseEmployeesList(result));

        return {
            companyAddress: await companyAddress,
            ESOPData: await ESOPData,
            OptionsData: await OptionsData,
            employees: await employees
        }
    }

    getESOPDataFromContract() {
        this.obtainESOPData().then(({companyAddress, ESOPData, OptionsData, employees}) => {
            this.store.dispatch({
                type: "SET_ESOP_DATA",
                companyAddress: companyAddress,
                ...ESOPData,
                ...OptionsData,
                employees: employees
            });

            this.store.dispatch({
                type: "SET_USER_TYPE",
                companyAddress: companyAddress,
                employees: employees
            });
        });
    }

    /**
     *
     * @param {String} optionsCalculatorAddress
     * @param {String} employeesListAddress
     * @param {int} totalPoolOptions
     * @param {BigNumber} ESOPLegalWrapperIPFSHash
     * @returns {Promise.<void>}
     */
    openESOP(optionsCalculatorAddress, employeesListAddress, totalPoolOptions, ESOPLegalWrapperIPFSHash) {
        let userState = this.store.getState().user;

        this.ESOPContractAbstr.defaults({
            from: userState.userPK
        });

        return this.ESOPContractAbstr.deployed()
            .then(contract => contract.openESOP(optionsCalculatorAddress, employeesListAddress,
                totalPoolOptions, ESOPLegalWrapperIPFSHash))
            .then(
                success => {
                    return new Promise((resolve, reject) => {
                        if (success.logs[0].event == "ESOPOpened") {
                            resolve(success);
                        } else {
                            reject(success);
                        }
                    });
                },
                error => {
                    return Promise.reject(error);
                }
            );
    }

    /**
     *
     * @param {String} employeePublicKey
     * @param {int} issueDate - Unix time
     * @param {int} timeToSign - Unix time
     * @param {int} extraOptions
     * @returns {Promise.<TResult>}
     */
    addEmployee(employeePublicKey, issueDate, timeToSign, extraOptions) {
        let userState = this.store.getState().user;

        this.ESOPContractAbstr.defaults({
            from: userState.userPK
        });

        return this.ESOPContractAbstr.deployed()
            .then(contract => {
                if (extraOptions == 0) {
                    return contract.offerOptionsToEmployee(
                        employeePublicKey,
                        issueDate,
                        timeToSign,
                        0,
                        true)
                } else {
                    return contract.offerOptionsToEmployeeOnlyExtra(
                        employeePublicKey,
                        issueDate,
                        timeToSign,
                        extraOptions)
                }
            }).then(
                success => {
                    return new Promise((resolve, reject) => {
                        if (success.logs[0].event == "ESOPOffered") {
                            resolve(success);
                        } else {
                            reject(success);
                        }
                    });
                },
                error => {
                    return Promise.reject(error);
                }
            );
    }

    employeeSignsToESOP() {
        let userState = this.store.getState().user;

        this.ESOPContractAbstr.defaults({
            from: userState.userPK
        });

        return this.ESOPContractAbstr.deployed().then(contract => contract.employeeSignsToESOP()).then(
            success => {
                return new Promise((resolve, reject) => {
                    if (success.logs[0].event == "EmployeeSignedToESOP") {
                        resolve(success);
                    } else {
                        reject(success);
                    }
                });
            },
            error => {
                return Promise.reject(error);
            }
        );
    }

    /**
     *
     * @param {String} employeePublicKey
     * @param {int} toggledAt - Unix time
     * @returns {Promise.<TResult>}
     */
    toggleEmployeeSuspension(employeePublicKey, toggledAt) {
        let userState = this.store.getState().user;

        this.ESOPContractAbstr.defaults({
            from: userState.userPK
        });

        return this.ESOPContractAbstr.deployed()
            .then(contract => contract.toggleEmployeeSuspension(employeePublicKey, toggledAt))
            .then(
                success => {
                    return new Promise((resolve, reject) => {
                        if (success.logs[0].event == "SuspendEmployee"
                            || success.logs[0].event == "ContinueSuspendedEmployee") {
                            resolve(success);
                        } else {
                            reject(success);
                        }
                    });
                },
                error => {
                    return Promise.reject(error);
                }
            );
    }

    /**
     *
     * @param {String} employeePublicKey
     * @param {int} terminatedAt - Unix time
     * @param {int} terminationType 0 - Regular, 1 - BadLeave
     */
    terminateEmployee(employeePublicKey, terminatedAt, terminationType) {
        let userState = this.store.getState().user;

        this.ESOPContractAbstr.defaults({
            from: userState.userPK
        });

        return this.ESOPContractAbstr.deployed()
            .then(contract => contract.terminateEmployee(employeePublicKey, terminatedAt, terminationType))
            .then(
                success => {
                    return new Promise((resolve, reject) => {
                        if (success.logs[0].event == "TerminateEmployee") {
                            resolve(success);
                        } else {
                            reject(success);
                        }
                    });
                },
                error => {
                    return Promise.reject(error);
                }
            );
    }
}
