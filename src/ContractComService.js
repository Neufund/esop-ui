import {web3} from './web3';
import contractBuilder from "truffle-contract"

//TODO: actually we need just ABI contracts here - find way to provide those during build process
import RoTDef from '/home/banciur/projects/neufund/ESOP/build/contracts/RoT.json'
import ESOPDef from '/home/banciur/projects/neufund/ESOP/build/contracts/ESOP.json'
import EmployeesListDef from '/home/banciur/projects/neufund/ESOP/build/contracts/EmployeesList.json'

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
        this.store.dispatch({
            type: "SET_CONTRACT_ADDRESS",
            address: {EmployeesListAddress}
        });
        this.EmployeesListContract = this.EmployeesListContractAbstr.deployed();
        //this.EmployeesListContract = this.EmployeesListContractAbstr.at(EmployeesListAddress);

        await this.ESOPContract.then(contract => contract.optionsConverter())
            .then(result => this.store.dispatch({
                type: "SET_CONTRACT_ADDRESS",
                address: {OptionsCalculatorAddress: result}
            }));
    };

    getCompanyAddress = rotContract => rotContract.then(contract => contract.owner());

    getESOPData = ESOPContract => ESOPContract.then(contract => {
        let dataPromises = [
            //CONFIG
            contract.cliffPeriod(), // cliff duration in seconds
            contract.vestingPeriod(), // vesting duration in seconds
            contract.maxFadeoutPromille(), // maximum promille that can fade out
            contract.bonusOptionsPromille(), // exit bonus promille
            contract.newEmployeePoolPromille(), // per mille of unassigned poolOptions that new employee gets
            contract.totalPoolOptions(), // total poolOptions in The Pool
            contract.ESOPLegalWrapperIPFSHash(), // ipfs hash of document establishing this ESOP
            contract.strikePrice(), // options strike price
            contract.waitForSignPeriod(), // default period for employee signature

            // STATE
            contract.remainingPoolOptions(), // poolOptions that remain to be assigned
            contract.esopState(), // state of ESOP (0)New, (1)Open, (2)Conversion
            contract.totalExtraOptions(), // how many extra options inserted
            contract.conversionOfferedAt(), // when conversion event happened
            contract.exerciseOptionsDeadline(), // employee conversion deadline
            contract.optionsConverter() // option conversion proxy
        ];
        return Promise.all(dataPromises);
    });

    parseESOPData = data => {
        return {
            cliffPeriod: data[0].toString(),
            vestingPeriod: data[1].toString(),
            maxFadeoutPromille: data[2].toString(),
            bonusOptionsPromille: data[3].toString(),
            newEmployeePoolPromille: data[4].toString(),
            totalPoolOptions: data[5].toString(),
            ESOPLegalWrapperIPFSHash: data[6].toString(),
            strikePrice: data[7].toString(),
            waitForSignPeriod: data[8].toString(),
            remainingPoolOptions: data[9].toString(),
            esopState: data[10].toString(),
            totalExtraOptions: data[11].toString(),
            conversionOfferedAt: data[12].toString(),
            exerciseOptionsDeadline: data[13].toString(),
            optionsConverter: data[14].toString(),
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
                extraOptions: employee.data[5].toString(), // time at which employee got suspended, 0 - not suspended
                suspendedAt: employee.data[6].toString(),
                state: employee.data[7].toString(), // (0)NotSet, (1)WaitingForSignature, (2)Employed, (3)Terminated, (4)OptionsExercised
            }
        });
    };

    async obtainESOPData() {
        let companyAddress = this.getCompanyAddress(this.RoTContract);

        let ESOPData = this.getESOPData(this.ESOPContract).then(result => this.parseESOPData(result));

        let employees = this.getEmployeesList(this.EmployeesListContract).then(result => this.parseEmployeesList(result));

        return {
            companyAddress: await companyAddress,
            ESOPData: await ESOPData,
            employees: await employees
        }
    }

    getESOPDataFromContract() {
        this.obtainESOPData().then(({companyAddress, ESOPData, employees}) => {
            this.store.dispatch({
                type: "SET_ESOP_DATA",
                companyAddress: companyAddress,
                ...ESOPData,
                employees: employees
            });

            this.store.dispatch({
                type: "SET_USER_TYPE",
                companyAddress: companyAddress,
                employees: employees
            });
        });
    }

    openESOP(totalPoolOptions, ESOPLegalWrapperIPFSHash) {

        console.log("openESOP method commented out as have problems running it");
        console.log("totalPoolOptions: " + totalPoolOptions);
        console.log("ESOPLegalWrapperIPFSHash: " + ESOPLegalWrapperIPFSHash);
        console.log("ESOPstate.OptionsCalculatorAddress: " + ESOPstate.OptionsCalculatorAddress);
        console.log("ESOPstate.EmployeesList: " + ESOPstate.EmployeesList);
        console.log("ESOPstate.EmployeesList: " + ESOPstate.EmployeesList);

        let ESOPstate = this.store.getState().ESOP;

        let ipfsHash = new Buffer(ESOPLegalWrapperIPFSHash, 'ascii');
        let encoedESOPLegalWrapperIPFSHash = web3.toBigNumber('0x' + ipfsHash.toString('hex'));


/*        this.ESOPContract
            .then(contract => contract.openESOP(
                ESOPstate.OptionsCalculatorAddress,
                ESOPstate.EmployeesList,
                totalPoolOptions,
                encoedESOPLegalWrapperIPFSHash))
            .then(
                result => {
                    console.log("success");
                    console.log(result);
                }, error => {
                    console.log("error");
                    console.log(error);
                }
            );*/
    }
}
