import {web3} from './web3';
import contractBuilder from "truffle-contract"

import RoTDef from '/home/banciur/projects/neufund/ESOP/build/contracts/RoT.json'
import ESOPDef from '/home/banciur/projects/neufund/ESOP/build/contracts/ESOP.json'
import EmployeesListDef from '/home/banciur/projects/neufund/ESOP/build/contracts/EmployeesList.json'


export default class ContractComService {
    constructor(store) {
        this.store = store;

        this.RoTContract = contractBuilder(RoTDef);
        this.RoTContract.setProvider(web3.currentProvider);

        this.ESOPContract = contractBuilder(ESOPDef);
        this.ESOPContract.setProvider(web3.currentProvider);

        this.EmployeesListContract = contractBuilder(EmployeesListDef);
        this.EmployeesListContract.setProvider(web3.currentProvider);
    }

    getESOPAddress = rotContract => rotContract.deployed().then(contract => contract.ESOPAddress());

    getCompanyAddress = rotContract => rotContract.deployed().then(contract => contract.owner());

    getEmployeesListAddress = (esopContract, address) => esopContract.at(address).then(contract => contract.employees());

    getESOPData = (ESOPContract, address) => ESOPContract.at(address).then(contract => {
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

    getEmployeesList = async(EmployeesListContract, address) => {

        let contractPromise = EmployeesListContract.at(address);
        let employeeNumber = await contractPromise.then(contract => contract.size());

        let employeeAddresses = await contractPromise.then(contract => {
            let dataPromises = [];
            for (let i = 0; i < employeeNumber; i++) {
                dataPromises.push(contract.addresses(i));
            }
            return Promise.all(dataPromises);
        });

        return contractPromise.then(contract => {
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
        let ESOPAddress = await this.getESOPAddress(this.RoTContract);
        let companyAddress = this.getCompanyAddress(this.RoTContract);
        //console.log(ESOPAddress);

        let ESOPData = this.getESOPData(this.ESOPContract, ESOPAddress).then(result => this.parseESOPData(result));
        let employeesAddress = await this.getEmployeesListAddress(this.ESOPContract, ESOPAddress);
        //console.log(employeesAddress);

        let employees = this.getEmployeesList(this.EmployeesListContract, employeesAddress).then(result => this.parseEmployeesList(result));
        return {
            companyAddress: await companyAddress,
            ESOPAddress: ESOPAddress,
            ESOPData: await ESOPData,
            employees: await employees
        }
    }

    getESOPDataFromContract() {

        window.setTimeout(() => {

            let employees = [
                {
                    address: "0x2671859bdd553677190be73c9146c8dc22932022",
                    extraOptions: "0",
                    fadeoutStarts: "0",
                    issueDate: "1583435129",
                    poolOptions: "100000",
                    state: "1",
                    suspendedAt: "0",
                    terminatedAt: "0",
                    timeToSign: "1586459129"
                },
                {
                    address: "0x00b8d1e19ac30308bb5186125785901c158bf07f",
                    extraOptions: "0",
                    fadeoutStarts: "0",
                    issueDate: "1583435129",
                    poolOptions: "90000",
                    state: "1",
                    suspendedAt: "0",
                    terminatedAt: "0",
                    timeToSign: "1586459129"
                },
                {
                    address: "0x00a329c0648769a73afac7f9381e08fb43dbea72",
                    extraOptions: "0",
                    fadeoutStarts: "0",
                    issueDate: "1583435129",
                    poolOptions: "81000",
                    state: "1",
                    suspendedAt: "0",
                    terminatedAt: "0",
                    timeToSign: "1586459129"
                },
                {
                    address: "0x0001071c75285b9886a8d30fb0670659ce94eaaf",
                    extraOptions: "0",
                    fadeoutStarts: "0",
                    issueDate: "1583435129",
                    poolOptions: "72900",
                    state: "1",
                    suspendedAt: "0",
                    terminatedAt: "0",
                    timeToSign: "1586459129"
                }];

            let companyAddress = "0x6C1086C292a7E1FdF66C68776eA972038467A370";

            this.store.dispatch({
                type: "SET_ESOP_DATA",
                companyAddress: companyAddress,
                ESOPAddress: "0x8803f89f5ef2243989bd1c19bcc917070deb3aeb",
                cliffPeriod: "31536000",
                vestingPeriod: "126144000",
                maxFadeoutPromille: "2000",
                bonusOptionsPromille: "2000",
                newEmployeePoolPromille: "1000",
                totalPoolOptions: "1000000",
                ESOPLegalWrapperIPFSHash: "0x516d52736a6e4e6b45706e44646d59423…",
                strikePrice: "1",
                waitForSignPeriod: "1209600",
                remainingPoolOptions: "656100",
                totalExtraOptions: "0",
                employees: employees

            });

            this.store.dispatch({
                type: "SET_USER_TYPE",
                companyAddress: companyAddress,
                employees: employees
            });
        }, 1000);

        /*
        this.obtainESOPData().then(({companyAddress, ESOPAddress, ESOPData, employees}) => {
            this.store.dispatch({
                type: "SET_ESOP_DATA",
                companyAddress: companyAddress,
                ESOPAddress: ESOPAddress,
                ...ESOPData,
                employees: employees
            });

            this.store.dispatch({
                type: "SET_USER_TYPE",
                companyAddress: companyAddress,
                employees: employees
            });
        });
        */
    }
}
