import {web3} from './web3';
import {toPromise} from './utils'
import Config from './config'
import contractBuilder from "truffle-contract"
import ContractUtils from './ContractUtils'

//TODO: actually we need just ABI contracts here - find way to provide those during build process
import RoTDef from 'truffle-artifacts/RoT.json'
import ESOPDef from 'truffle-artifacts/ESOP.json'
import EmployeesListDef from 'truffle-artifacts/EmployeesList.json'
import OptionsCalculatorDef from 'truffle-artifacts/OptionsCalculator.json'

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

    obtainContractAddresses = async() => {

        let ESOPAddress = await this.RoTContract.then(contract => {
            this.store.dispatch({
                type: "SET_CONTRACT_ADDRESS",
                address: { RoTAddress: contract.address }
            });
            return contract.ESOPAddress()
        });
        this.store.dispatch({
            type: "SET_CONTRACT_ADDRESS",
            address: { ESOPAddress }
        });

        this.ESOPContract = this.ESOPContractAbstr.deployed();
        //this.ESOPContract = this.ESOPContractAbstr.at(ESOPAddress);

        let EmployeesListAddress = await this.ESOPContract.then(contract => contract.employees());
        let OptionsCalculatorAddress = await this.ESOPContract.then(contract => contract.optionsCalculator());

        this.store.dispatch({
            type: "SET_CONTRACT_ADDRESS",
            address: { EmployeesListAddress }
        });
        this.EmployeesListContract = this.EmployeesListContractAbstr.deployed();
        //this.EmployeesListContract = this.EmployeesListContractAbstr.at(EmployeesListAddress);

        this.store.dispatch({
            type: "SET_CONTRACT_ADDRESS",
            address: { OptionsCalculatorAddress }
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
            contract.MINIMUM_MANUAL_SIGN_PERIOD(), // default period for employee signature

            //STATE
            contract.remainingPoolOptions(), // poolOptions that remain to be assigned
            contract.esopState(), // state of ESOP (0)New, (1)Open, (2)Conversion
            contract.totalExtraOptions(), // how many extra options inserted
            contract.conversionOfferedAt(), // when conversion event happened
            contract.exerciseOptionsDeadline(), // employee conversion deadline
            contract.currentTime() // point of time from which we have contract state
        ];
        return Promise.all(dataPromises);
    });

    parseESOPData = data => {
        return {
            totalPoolOptions: data[0].toNumber(),
            ESOPLegalWrapperIPFSHash: data[1].toString(),
            MINIMUM_MANUAL_SIGN_PERIOD: data[2].toNumber(),
            remainingPoolOptions: data[3].toNumber(),
            esopState: data[4].toNumber(),
            totalExtraOptions: data[5].toNumber(),
            conversionOfferedAt: data[6].toNumber(),
            exerciseOptionsDeadline: data[7].toNumber(),
            currentBlockTimestamp: data[8].toNumber()
        };
    };

    getOptionsData = () => this.OptionsCalculatorContract.then(contract => {
        let dataPromises = [
            contract.cliffPeriod(), // cliff duration in seconds
            contract.vestingPeriod(), // vesting duration in seconds
            contract.maxFadeoutPromille(), // maximum promille that can fade out
            contract.residualAmountPromille(), // minimal options after fadeout
            contract.bonusOptionsPromille(), // exit bonus promille
            contract.newEmployeePoolPromille(), // per mille of unassigned poolOptions that new employee gets
            contract.optionsPerShare(), // per mille of unassigned poolOptions that new employee gets
            contract.STRIKE_PRICE() // options strike price
        ];
        return Promise.all(dataPromises);
    });

    perseOptionsData = data => {
        return {
            cliffPeriod: data[0].toNumber(),
            vestingPeriod: data[1].toNumber(),
            maxFadeoutPromille: data[2].toNumber(),
            residualAmountPromille: data[3].toNumber(),
            bonusOptionsPromille: data[4].toNumber(),
            newEmployeePoolPromille: data[5].toNumber(),
            optionsPerShare: data[6].toNumber(),
            STRIKE_PRICE: data[7].toNumber()
        };
    };

    getEmployeesList = async() => {

        let employeeNumber = await this.EmployeesListContract.then(contract => contract.size());

        let employeeAddresses = await this.EmployeesListContract.then(contract => {
            let dataPromises = [];
            for (let i = 0; i < employeeNumber; i++) {
                dataPromises.push(contract.addresses(i));
            }
            return Promise.all(dataPromises);
        });

        return this.EmployeesListContract.then(contract => {
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

    getEmployeesVestedOptions = async employees => {
        let now = new Date() / 1000;
        let dataPromises = employees.map(employee => this.ESOPContract
            .then(contract => contract.calcEffectiveOptionsForEmployee(employee.address, now))
            .then(res => res.toNumber())
        );
        return Promise.all(dataPromises).then(result => {
            return result.map((vestedOptions, index) => ({
                ... employees[index],
                vestedOptions: vestedOptions
            }));
        });
    };

    parseEmployeesList = data => {
        return data.filter(employee => parseInt(employee.address, 16) != 0).map((employee) => {
            return {
                address: employee.address,
                issueDate: employee.data[0].toNumber(), // when vesting starts
                timeToSign: employee.data[1].toNumber(), // wait for employee signature until that time
                terminatedAt: employee.data[2].toNumber(), // date when employee was terminated, 0 for not terminated
                fadeoutStarts: employee.data[3].toNumber(),
                poolOptions: employee.data[4].toNumber(), // poolOptions employee gets (exit bonus not included)
                extraOptions: employee.data[5].toNumber(),
                suspendedAt: employee.data[6].toNumber(), // time at which employee got suspended, 0 - not suspended
                state: employee.data[7].toNumber(), // (0)NotSet, (1)WaitingForSignature, (2)Employed, (3)Terminated, (4)OptionsExercised
            }
        });
    };

    getNewEmployeePoolOptions = remainingPoolOptions => this.OptionsCalculatorContract
        .then(contract => contract.calcNewEmployeePoolOptions(remainingPoolOptions));

    getCurrentBlockNumber = () => new Promise((resolve, reject) => {
        web3.eth.getBlockNumber((error, result) => {
            if (error) {
                reject(error);
            }
            resolve(result);
        })
    });

    getBlockHash = () => new Promise((resolve, reject) => {
        this.getCurrentBlockNumber().then(blockNumber => {
            web3.eth.getBlock(blockNumber, false, (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result.hash);
            })
        })
    });

    getNetworkId = () => new Promise((resolve, reject) => {
        web3.version.getNetwork((error, result) => {
            if (error) {
                reject(error);
            }
            resolve(result);
        })
    });

    async obtainESOPData() {
        let companyAddress = this.getCompanyAddress(this.RoTContract);
        let ESOPData = await this.getESOPData().then(result => this.parseESOPData(result));
        let OptionsData = this.getOptionsData().then(result => this.perseOptionsData(result));
        let employees = this.getEmployeesList()
            .then(result => this.parseEmployeesList(result))
            .then(result => this.getEmployeesVestedOptions(result));

        ESOPData.newEmployeePoolOption = (await this.getNewEmployeePoolOptions(ESOPData.remainingPoolOptions)).toNumber();
        ESOPData.currentBlockHash = await this.getBlockHash();
        ESOPData.networkId = Number(await this.getNetworkId());

        return {
            companyAddress: await companyAddress,
            ESOPData: ESOPData,
            OptionsData: await OptionsData,
            employees: await employees
        }
    }

    getESOPDataFromContract() {
        this.obtainESOPData().then(({ companyAddress, ESOPData, OptionsData, employees }) => {
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

            this.store.dispatch({
                type: "SET_WAITING_FOR_DATA",
                waitingForData: false
            });
        });
    }

    /**
     *
     * @param {int} totalPoolOptions
     * @param {BigNumber} ESOPLegalWrapperIPFSHash
     * @returns {Promise.<void>}
     */
    openESOP(totalPoolOptions, ESOPLegalWrapperIPFSHash) {
        let userState = this.store.getState().user;

        this.ESOPContractAbstr.defaults({
            from: userState.userPK
        });

        return this.ESOPContractAbstr.deployed()
            .then(contract => contract.openESOP(totalPoolOptions, ESOPLegalWrapperIPFSHash))
            .then(
                success => new Promise((resolve, reject) => {
                    if (success.logs[0].event == "ESOPOpened") {
                        resolve(success);
                    } else {
                        reject(ContractUtils.formatErrorFromReturnCode('openESOP', success));
                    }
                }),
                error => ContractComService.processCommonErrors(error))
            .then(
                success => this.transactionConfirmation(success.tx)
                ,
                error => Promise.reject(error)
            );
    }

    setParametersOptional(cliffPeriod, vestingPeriod, residualAmount, bonusOptions, newEmployeePool, optionsPerShare, hasSetParameters) {
        if (hasSetParameters) {
            // return empty promise
            return new Promise((resolve, reject) => {
                resolve('params already set')
            });
        }
        return this.setParameters(cliffPeriod, vestingPeriod, residualAmount, bonusOptions, newEmployeePool, optionsPerShare)
    }

    setParameters(cliffPeriod, vestingPeriod, residualAmount, bonusOptions, newEmployeePool, optionsPerShare) {
        let userState = this.store.getState().user;

        this.OptionsCalculatorAbstr.defaults({
            from: userState.userPK
        });

        return this.OptionsCalculatorAbstr.deployed()
            .then(contract => contract.setParameters(cliffPeriod, vestingPeriod, residualAmount, bonusOptions, newEmployeePool, optionsPerShare))
            .then(
                success => Promise.resolve(success)
                /* TODO: add return value to logs of OptionsCalculator.setParameters
                 return new Promise((resolve, reject) => {
                 if (success.logs[0].event == "xxx") {
                 resolve(success);
                 } else {
                 reject(success);
                 }
                 });*/
                ,
                error => ContractComService.processCommonErrors(error))
            .then(
                success => this.transactionConfirmation(success.tx)
                ,
                error => Promise.reject(error)
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
            })
            .then(
                success => new Promise((resolve, reject) => {
                    if (success.logs[0].event == "ESOPOffered") {
                        resolve(success);
                    } else {
                        reject(ContractUtils.formatErrorFromReturnCode('offerOptionsToEmployee', success));
                    }
                }),
                error => ContractComService.processCommonErrors(error))
            .then(
                success => this.transactionConfirmation(success.tx)
                ,
                error => Promise.reject(error)
            );
    }

    employeeSignsToESOP() {
        let userState = this.store.getState().user;

        this.ESOPContractAbstr.defaults({
            from: userState.userPK
        });

        return this.ESOPContractAbstr.deployed()
            .then(contract => contract.employeeSignsToESOP())
            .then(
                success => new Promise((resolve, reject) => {
                    if (success.logs[0].event == "EmployeeSignedToESOP") {
                        resolve(success);
                    } else {
                        reject(ContractUtils.formatErrorFromReturnCode('employeeSignsToESOP', success));
                    }
                }),
                error => ContractComService.processCommonErrors(error))
            .then(
                success => this.transactionConfirmation(success.tx)
                ,
                error => Promise.reject(error)
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
                success => new Promise((resolve, reject) => {
                    if (success.logs[0].event == "SuspendEmployee"
                        || success.logs[0].event == "ContinueSuspendedEmployee") {
                        resolve(success);
                    } else {
                        reject(ContractUtils.formatErrorFromReturnCode('toggleEmployeeSuspension', success));
                    }
                })
                ,
                error => ContractComService.processCommonErrors(error))
            .then(
                success => this.transactionConfirmation(success.tx)
                ,
                error => Promise.reject(error)
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
                success => new Promise((resolve, reject) => {
                    if (success.logs[0].event == "TerminateEmployee") {
                        resolve(success);
                    } else {
                        reject(ContractUtils.formatErrorFromReturnCode('terminateEmployee', success));
                    }
                }),
                error => ContractComService.processCommonErrors(error))
            .then(
                success => this.transactionConfirmation(success.tx)
                ,
                error => Promise.reject(error)
            );
    }

    offerOptionsConversion(optionsConverterAddress) {
        let userState = this.store.getState().user;

        this.ESOPContractAbstr.defaults({
            from: userState.userPK
        });

        return this.ESOPContractAbstr.deployed()
            .then(contract => contract.offerOptionsConversion(optionsConverterAddress))
            .then(
                success => new Promise((resolve, reject) => {
                    if (success.logs[0].event == "OptionsConversionOffered") {
                        resolve(success);
                    } else {
                        reject(ContractUtils.formatErrorFromReturnCode('offerOptionsConversion', success));
                    }
                }),
                error => ContractComService.processCommonErrors(error)
            )
    }

    /**
     * Resurns promise that is resolved when transaction with provided hash has at least Config.numberOfConfirmations.
     * @param transactionHash
     * @returns {Promise}
     */
    transactionConfirmation(transactionHash) {
        console.log("waiting for transaction: " + transactionHash);
        return new Promise((resolve, reject) => {
            let prevBlockNo = -1;
            let startingBlock = -1;
            let ESOPState = this.store.getState().ESOP;
            let requiredConfirmations = ContractUtils.isMiningNetwork(ESOPState.networkId) ? Config.numberOfConfirmations : 0;
            let poll = async() => {

                let currentBlockNo;
                try {
                    currentBlockNo = await toPromise(web3.eth.getBlockNumber);
                } catch (e) {
                    console.log('error in web3.eth.getBlockNumber');
                    console.log(e);
                    return reject(e);
                }
                if (startingBlock == -1) {
                    startingBlock = currentBlockNo;
                }
                if (currentBlockNo - startingBlock >= Config.maxNumberOfBlocksToWait) {
                    return reject(`Your transaction has not been mined in last ${Config.maxNumberOfBlocksToWait} blocks`);
                }

                //console.log(`got block number ${currentBlockNo} prev block number ${prevBlockNo}`);
                if (currentBlockNo != prevBlockNo) {
                    prevBlockNo = currentBlockNo;

                    try {
                        let transaction = await toPromise(web3.eth.getTransaction, transactionHash);
                        //console.log(`got transaction with block number: ${transaction.blockNumber}`);
                        if (transaction.blockNumber != null) {
                            if (currentBlockNo - transaction.blockNumber >= requiredConfirmations) {
                                //console.log('we have enough confirmations we can move on');
                                return resolve();
                            }
                        }
                    } catch (e) {
                        console.log('error in web3.eth.getTransaction');
                        console.log(e);
                        return reject(e);
                    }
                }
                window.setTimeout(poll, 1000);
            };
            window.setTimeout(poll, 1000);
        });
    }

    /**
     * Primitive error handler. Now it handle out of gas for nano ledger and transaction rejection in metamask and ledger
     * @param error
     * @returns {Promise.<*>}
     */
    static processCommonErrors(error) {

        // no enough gas when using nano ledger (
        if (error.code != undefined
            && error.message != undefined
            && error.code == -32010
            && error.message.startsWith('Insufficient funds. The account you tried to send transaction')) {
            return Promise.reject('Your account has not enough ETH.');
        }

        // transaction rejected when using nano ledger
        if (error === 'Invalid status 6985')
            return Promise.reject('You rejected transaction on your Nano Ledger.');

        // transaction rejected when using metamask
        if (error.message != undefined
            && error.message.startsWith('Error: MetaMask Tx Signature: User denied'))
            return Promise.reject('You rejected transaction using metamask.');

        if (error.errorCode !== undefined && error.errorCode === 5) {
            return Promise.reject('There is timeout error on your Nano. Please reconnect it and reload ESOP page!');
        }

        return Promise.reject(error)
    }
}
