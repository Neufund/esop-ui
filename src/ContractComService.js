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

    getEmployeesListAddress = (esopContract, address) => esopContract.at(address).then(contract => contract.employees());

    getESOPData = (ESOPContract, address) => ESOPContract.at(address).then(contract => {
        let dataPromises = [];
        dataPromises.push(contract.cliffDuration());
        dataPromises.push(contract.vestingDuration());
        dataPromises.push(contract.maxFadeoutPromille());
        dataPromises.push(contract.exitBonusPromille());
        dataPromises.push(contract.totalOptions());
        dataPromises.push(contract.remainingOptions());
        dataPromises.push(contract.esopState());
        dataPromises.push(contract.totalExtraOptions());
        dataPromises.push(contract.conversionEventTime());
        dataPromises.push(contract.employeeConversionDeadline());
        dataPromises.push(contract.optionsConverter());
        dataPromises.push(contract.poolEstablishmentDocIPFSHash());
        return Promise.all(dataPromises);
    });

    parseESOPData = data => {
        let ret = {};
        ret.cliffDuration = data[0].c[0];
        ret.vestingDuration = data[1].c[0];
        ret.maxFadeoutPromille = data[2].c[0];
        ret.exitBonusPromille = data[3].c[0];
        ret.totalOptions = data[4].c[0];
        ret.remainingOptions = data[5].c[0];
        ret.ESOPState = data[6].c[0];
        ret.totalExtraOptions = data[7].c[0];
        ret.conversionEventTime = data[8].c[0];
        ret.employeeConversionDeadline = data[9].c[0];
        ret.optionsConverter = data[10];
        ret.poolEstablishmentDocIPFSHash = data[11];
        return ret;
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
                vestingStarted: employee.data[0].c[0],
                timeToSign: employee.data[1].c[0],
                terminatedAt: employee.data[2].c[0],
                fadeoutStarts: employee.data[3].c[0],
                options: employee.data[4].c[0],
                extraOptions: employee.data[5].c[0],
                state: employee.data[6].c[0]
            }
        });
    };

    async obtainESOPData() {
        let ESOPAddress = await this.getESOPAddress(this.RoTContract);
        //console.log(esopAddress);

        let ESOPData = this.getESOPData(this.ESOPContract, ESOPAddress).then(result => this.parseESOPData(result));
        let employeesAddress = await this.getEmployeesListAddress(this.ESOPContract, ESOPAddress);
        //console.log(employeesAddress);

        let employees = this.getEmployeesList(this.EmployeesListContract, employeesAddress).then(result => this.parseEmployeesList(result));
        return {ESOPAddress: ESOPAddress, ESOPData: await ESOPData, employees: await employees}
    }

    getESOPDataFromContract() {
        this.obtainESOPData().then(({ESOPAddress, ESOPData, employees}) => {
            this.store.dispatch({
                type: "SET_ESOP_DATA",
                ESOPAddress: ESOPAddress,
                ...ESOPData,
                employees: employees
            });
        });
    }
}
