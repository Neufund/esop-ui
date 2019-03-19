import contractBuilder from 'truffle-contract';

// TODO: actually we need just ABI contracts here - find way to provide those during build process
import RoTDef from 'truffle-artifacts/RoT.json';
import ESOPDef from 'truffle-artifacts/ESOP.json';
import EmployeesListDef from 'truffle-artifacts/EmployeesList.json';
import OptionsCalculatorDef from 'truffle-artifacts/OptionsCalculator.json';

import Config from './config';
import ContractUtils from './ContractUtils';

export default class ContractComService {
  constructor(store) {
    this.store = store;

    this.RoTContractAbstr = contractBuilder(RoTDef);
    this.RoTContractAbstr.setProvider(window.web3.currentProvider);
    this.RoTContractAbstr.defaults({
      gas: Config.gas,
      gasPrice: Config.gasPriceLimit,
    });

    // TODO: it should be not deployed but .at() with address set through configuration created build deployment
    this.RoTContract = this.RoTContractAbstr.deployed();

    this.ESOPContractAbstr = contractBuilder(ESOPDef);
    this.ESOPContractAbstr.setProvider(window.web3.currentProvider);
    this.ESOPContractAbstr.defaults({
      gas: Config.gas,
      gasPrice: Config.gasPriceLimit,
    });

    this.EmployeesListContractAbstr = contractBuilder(EmployeesListDef);
    this.EmployeesListContractAbstr.setProvider(window.web3.currentProvider);
    this.EmployeesListContractAbstr.defaults({
      gas: Config.gas,
      gasPrice: Config.gasPriceLimit,
    });

    this.OptionsCalculatorAbstr = contractBuilder(OptionsCalculatorDef);
    this.OptionsCalculatorAbstr.setProvider(window.web3.currentProvider);
    this.OptionsCalculatorAbstr.defaults({
      gas: Config.gas,
      gasPrice: Config.gasPriceLimit,
    });
  }

  obtainContractAddresses = async () => {
    const ESOPAddress = await this.RoTContract.then((contract) => {
      this.store.dispatch({
        type: 'SET_CONTRACT_ADDRESS',
        address: { RoTAddress: contract.address },
      });
      return contract.ESOPAddress();
    });
    this.store.dispatch({
      type: 'SET_CONTRACT_ADDRESS',
      address: { ESOPAddress },
    });

    this.ESOPContract = this.ESOPContractAbstr.deployed();
    // this.ESOPContract = this.ESOPContractAbstr.at(ESOPAddress);

    const EmployeesListAddress = await this.ESOPContract.then(contract => contract.employees());
    const OptionsCalculatorAddress = await this.ESOPContract.then(contract => contract.optionsCalculator());

    this.store.dispatch({
      type: 'SET_CONTRACT_ADDRESS',
      address: { EmployeesListAddress },
    });
    this.EmployeesListContract = this.EmployeesListContractAbstr.deployed();
    // this.EmployeesListContract = this.EmployeesListContractAbstr.at(EmployeesListAddress);

    this.store.dispatch({
      type: 'SET_CONTRACT_ADDRESS',
      address: { OptionsCalculatorAddress },
    });
    this.OptionsCalculatorContract = this.OptionsCalculatorAbstr.deployed();
    // this.OptionsCalculatorContract = this.OptionsCalculatorAbstr.at(EmployeesListAddress);

    // TODO: also there should be options converter address
  };

  getCompanyAddress = rotContract => rotContract.then(contract => contract.owner());

  getESOPData = () => this.ESOPContract.then((contract) => {
    const dataPromises = [
      // CONFIG
      contract.totalPoolOptions(), // total poolOptions in The Pool
      contract.ESOPLegalWrapperIPFSHash(), // ipfs hash of document establishing this ESOP
      contract.MINIMUM_MANUAL_SIGN_PERIOD(), // default period for employee signature

      // STATE
      contract.remainingPoolOptions(), // poolOptions that remain to be assigned
      contract.esopState(), // state of ESOP (0)New, (1)Open, (2)Conversion
      contract.totalExtraOptions(), // how many extra options inserted
      contract.conversionOfferedAt(), // when conversion event happened
      contract.exerciseOptionsDeadline(), // employee conversion deadline
      contract.currentTime(), // point of time from which we have contract state
    ];
    return Promise.all(dataPromises);
  });

  parseESOPData = data => ({
    totalPoolOptions: data[0].toNumber(),
    ESOPLegalWrapperIPFSHash: data[1].toString(),
    MINIMUM_MANUAL_SIGN_PERIOD: data[2].toNumber(),
    remainingPoolOptions: data[3].toNumber(),
    esopState: data[4].toNumber(),
    totalExtraOptions: data[5].toNumber(),
    conversionOfferedAt: data[6].toNumber(),
    exerciseOptionsDeadline: data[7].toNumber(),
    currentBlockTimestamp: data[8].toNumber(),
  });

  getOptionsData = () => this.OptionsCalculatorContract.then((contract) => {
    const dataPromises = [
      contract.cliffPeriod(), // cliff duration in seconds
      contract.vestingPeriod(), // vesting duration in seconds
      contract.maxFadeoutPromille(), // maximum promille that can fade out
      contract.residualAmountPromille(), // minimal options after fadeout
      contract.bonusOptionsPromille(), // exit bonus promille
      contract.newEmployeePoolPromille(), // per mille of unassigned poolOptions that new employee gets
      contract.optionsPerShare(), // per mille of unassigned poolOptions that new employee gets
      contract.STRIKE_PRICE(), // options strike price
    ];
    return Promise.all(dataPromises);
  });

  parseOptionsData = data => ({
    cliffPeriod: data[0].toNumber(),
    vestingPeriod: data[1].toNumber(),
    maxFadeoutPromille: data[2].toNumber(),
    residualAmountPromille: data[3].toNumber(),
    bonusOptionsPromille: data[4].toNumber(),
    newEmployeePoolPromille: data[5].toNumber(),
    optionsPerShare: data[6].toNumber(),
    STRIKE_PRICE: data[7].toNumber(),
  });

  getEmployeesList = async () => {
    const employeeNumber = await this.EmployeesListContract.then(contract => contract.size());

    let employeeAddresses = await this.EmployeesListContract.then((contract) => {
      const dataPromises = [];
      for (let i = 0; i < employeeNumber; i++) {
        dataPromises.push(contract.addresses(i));
      }
      return Promise.all(dataPromises);
    });

    employeeAddresses = employeeAddresses.filter(address => address !== '0x0000000000000000000000000000000000000000');

    return this.EmployeesListContract.then((contract) => {
      const dataPromises = [];
      for (let i = 0; i < employeeAddresses.length; i++) {
        const employeeAddress = employeeAddresses[i];
        dataPromises.push(contract.getEmployee(employeeAddress).then(employee => ({
          address: employeeAddress,
          data: employee,
        })));
      }
      return Promise.all(dataPromises);
    });
  };

  getEmployeesVestedOptions = async (employees) => {
    const now = new Date() / 1000;
    const dataPromises = employees.map(employee => this.ESOPContract
      .then(contract => contract.calcEffectiveOptionsForEmployee(employee.address, now))
      .then(res => res.toNumber())
    );
    return Promise.all(dataPromises).then(result => result.map((vestedOptions, index) => ({
      ...employees[index],
      vestedOptions,
    })));
  };

  parseEmployeesList = data => data.filter(employee => parseInt(employee.address, 16) !== 0).map(employee => ({
    address: employee.address,
    issueDate: employee.data[0].toNumber(), // when vesting starts
    timeToSign: employee.data[1].toNumber(), // wait for employee signature until that time
    terminatedAt: employee.data[2].toNumber(), // date when employee was terminated, 0 for not terminated
    fadeoutStarts: employee.data[3].toNumber(),
    poolOptions: employee.data[4].toNumber(), // poolOptions employee gets (exit bonus not included)
    extraOptions: employee.data[5].toNumber(),
    suspendedAt: employee.data[6].toNumber(), // time at which employee got suspended, 0 - not suspended
    state: employee.data[7].toNumber(), // (0)NotSet, (1)WaitingForSignature, (2)Employed, (3)Terminated, (4)OptionsExercised
  }));

  getNewEmployeePoolOptions = remainingPoolOptions => this.OptionsCalculatorContract
    .then(contract => contract.calcNewEmployeePoolOptions(remainingPoolOptions));

  getCurrentBlockNumber = () => new Promise((resolve, reject) => {
    window.web3.eth.getBlockNumber((error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });

  getBlockHash = () => new Promise((resolve, reject) => {
    this.getCurrentBlockNumber().then((blockNumber) => {
      window.web3.eth.getBlock(blockNumber, false, (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result.hash);
      });
    });
  });

  getNetworkId = () => new Promise((resolve, reject) => {
    window.web3.version.getNetwork((error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });

  getBalance = address => new Promise((resolve, reject) => {
    window.web3.eth.getBalance(address, (error, result) => {
      if (error) {
        reject(error);
      }
      const eth = window.web3.fromWei(result, 'ether').toNumber();
      resolve(eth);
    });
  });

  async obtainESOPData() {
    const companyAddress = this.getCompanyAddress(this.RoTContract);
    const ESOPData = await this.getESOPData().then(result => this.parseESOPData(result));
    const OptionsData = this.getOptionsData().then(result => this.parseOptionsData(result));
    const employees = this.getEmployeesList()
      .then(result => this.parseEmployeesList(result))
      .then(result => this.getEmployeesVestedOptions(result));

    ESOPData.newEmployeePoolOption = (await this.getNewEmployeePoolOptions(ESOPData.remainingPoolOptions)).toNumber();
    ESOPData.currentBlockHash = await this.getBlockHash();
    ESOPData.networkId = Number(await this.getNetworkId());

    return {
      companyAddress: await companyAddress,
      ESOPData,
      OptionsData: await OptionsData,
      employees: await employees,
    };
  }

  getESOPDataFromContract() {
    this.obtainESOPData().then(({ companyAddress, ESOPData, OptionsData, employees }) => {
      this.store.dispatch({
        type: 'SET_ESOP_DATA',
        companyAddress,
        ...ESOPData,
        ...OptionsData,
        employees,
      });

      this.store.dispatch({
        type: 'SET_USER_TYPE',
        companyAddress,
        employees,
      });

      this.store.dispatch({
        type: 'SET_WAITING_FOR_DATA',
        waitingForData: false,
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
    const userState = this.store.getState().user;

    this.ESOPContractAbstr.defaults({
      from: userState.userPK,
      gas: Config.gas,
      gasPrice: Config.gasPriceLimit,
    });

    return this.ESOPContractAbstr.deployed()
      .then(contract => contract.openESOP(totalPoolOptions, ESOPLegalWrapperIPFSHash))
      .then(
        success => new Promise((resolve, reject) => {
          if (success.logs[0].event === 'ESOPOpened') {
            resolve(success.tx);
          } else {
            reject(ContractUtils.formatErrorFromReturnCode('openESOP', success));
          }
        }),
        error => Promise.reject(ContractComService.processCommonErrors(error)));
  }

  setParametersOptional(cliffPeriod, vestingPeriod, residualAmount, bonusOptions, newEmployeePool, optionsPerShare, hasSetParameters) {
    if (hasSetParameters) {
      // return empty promise
      return new Promise((resolve, reject) => {
        resolve('params already set');
      });
    }
    return this.setParameters(cliffPeriod, vestingPeriod, residualAmount, bonusOptions, newEmployeePool, optionsPerShare);
  }

  setParameters(cliffPeriod, vestingPeriod, residualAmount, bonusOptions, newEmployeePool, optionsPerShare) {
    const userState = this.store.getState().user;

    this.OptionsCalculatorAbstr.defaults({
      from: userState.userPK,
      gas: Config.gas,
      gasPrice: Config.gasPriceLimit,
    });

    return this.OptionsCalculatorAbstr.deployed()
      .then(contract => contract.setParameters(cliffPeriod, vestingPeriod, residualAmount, bonusOptions, newEmployeePool, optionsPerShare))
      .then(
        success => Promise.resolve(success.tx)
        ,
        error => Promise.reject(ContractComService.processCommonErrors(error)));
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
    const userState = this.store.getState().user;

    this.ESOPContractAbstr.defaults({
      from: userState.userPK,
      gas: Config.gas,
      gasPrice: Config.gasPriceLimit,
    });

    return this.ESOPContractAbstr.deployed()
      .then((contract) => {
        if (extraOptions === 0) {
          return contract.offerOptionsToEmployee(
            employeePublicKey,
            issueDate,
            timeToSign,
            0,
            true);
        }
        return contract.offerOptionsToEmployeeOnlyExtra(
          employeePublicKey,
          issueDate,
          timeToSign,
          extraOptions);
      })
      .then(
        success => new Promise((resolve, reject) => {
          if (success.logs[0].event === 'ESOPOffered') {
            resolve(success.tx);
          } else {
            reject(ContractUtils.formatErrorFromReturnCode('offerOptionsToEmployee', success));
          }
        }),
        error => Promise.reject(ContractComService.processCommonErrors(error)));
  }

  employeeSignsToESOP() {
    const userState = this.store.getState().user;

    this.ESOPContractAbstr.defaults({
      from: userState.userPK,
      gas: Config.gas,
      gasPrice: Config.gasPriceLimit,
    });

    return this.ESOPContractAbstr.deployed()
      .then(contract => contract.employeeSignsToESOP())
      .then(
        success => new Promise((resolve, reject) => {
          if (success.logs[0].event === 'EmployeeSignedToESOP') {
            resolve(success.tx);
          } else {
            reject(ContractUtils.formatErrorFromReturnCode('employeeSignsToESOP', success));
          }
        }),
        error => Promise.reject(ContractComService.processCommonErrors(error)));
  }

  /**
   *
   * @param {String} employeePublicKey
   * @param {int} toggledAt - Unix time
   * @returns {Promise.<TResult>}
   */
  toggleEmployeeSuspension(employeePublicKey, toggledAt) {
    const userState = this.store.getState().user;

    this.ESOPContractAbstr.defaults({
      from: userState.userPK,
      gas: Config.gas,
      gasPrice: Config.gasPriceLimit,
    });

    return this.ESOPContractAbstr.deployed()
      .then(contract => contract.toggleEmployeeSuspension(employeePublicKey, toggledAt))
      .then(
        success => new Promise((resolve, reject) => {
          if (success.logs[0].event === 'SuspendEmployee'
            || success.logs[0].event === 'ContinueSuspendedEmployee') {
            resolve(success.tx);
          } else {
            reject(ContractUtils.formatErrorFromReturnCode('toggleEmployeeSuspension', success));
          }
        })
        ,
        error => Promise.reject(ContractComService.processCommonErrors(error)));
  }

  /**
   *
   * @param {String} employeePublicKey
   * @param {int} terminatedAt - Unix time
   * @param {int} terminationType 0 - Regular, 1 - BadLeave
   */
  terminateEmployee(employeePublicKey, terminatedAt, terminationType) {
    const userState = this.store.getState().user;

    this.ESOPContractAbstr.defaults({
      from: userState.userPK,
      gas: Config.gas,
      gasPrice: Config.gasPriceLimit,
    });

    return this.ESOPContractAbstr.deployed()
      .then(contract => contract.terminateEmployee(employeePublicKey, terminatedAt, terminationType))
      .then(
        success => new Promise((resolve, reject) => {
          if (success.logs[0].event === 'TerminateEmployee') {
            resolve(success.tx);
          } else {
            reject(ContractUtils.formatErrorFromReturnCode('terminateEmployee', success));
          }
        }),
        error => Promise.reject(ContractComService.processCommonErrors(error)));
  }

  offerOptionsConversion(optionsConverterAddress) {
    const userState = this.store.getState().user;

    this.ESOPContractAbstr.defaults({
      from: userState.userPK,
      gas: Config.gas,
      gasPrice: Config.gasPriceLimit,
    });

    return this.ESOPContractAbstr.deployed()
      .then(contract => contract.offerOptionsConversion(optionsConverterAddress))
      .then(
        success => new Promise((resolve, reject) => {
          if (success.logs[0].event === 'OptionsConversionOffered') {
            resolve(success.tx);
          } else {
            reject(ContractUtils.formatErrorFromReturnCode('offerOptionsConversion', success));
          }
        }),
        error => Promise.reject(ContractComService.processCommonErrors(error)));
  }


  /**
   * Primitive error handler. Now it handle out of gas for nano ledger and transaction rejection in ledger
   * @param error
   * @returns string
   */
  static processCommonErrors(error) {
    // no enough gas when using nano ledger (
    if (error.code !== undefined
      && error.message !== undefined
      && error.code === -32010
      && error.message.startsWith('Insufficient funds. The account you tried to send transaction')) {
      return 'Your account has not enough ETH.';
    }

    // transaction rejected
    if (error.statusCode && error.statusCode === 27013) {
      return 'You rejected transaction on your Nano Ledger.';
    }

    // contracts disabled
    if (error.statusCode && error.statusCode === 27264) {
      return 'Please enable contract data on your Nano Ledger.';
    }

    if (error.message && error.message === 'Failed to sign with Ledger device: U2F TIMEOUT') {
      return 'There is timeout error on your Nano. Please reconnect it and reload ESOP page!';
    }

    return error;
  }
}
