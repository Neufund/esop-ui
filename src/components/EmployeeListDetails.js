import React from 'react';
import moment from 'moment';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

import IPFSDialog from './IPFSDialog';
import TwoColumnParametersList from './TwoColumnParametersList';
import ContractUtils from '../ContractUtils';
import {validateDoc, epochAsYears} from '../utils';
import Config from '../config';
import Texting from '../texting';

import './EmployeeListDetails.scss';

export default class EmployeeListDetails extends React.Component {
  constructor(props) {
    super(props);
    this.store = props.store;
    this.services = props.services;

    this.state = {
      terminateDate: new Date(),
      showDocumentDialog: false,
      LegalDocument: '',
      IPFSHash: '',
      openSuspendDialog: false,
      openDeleteDialog: false,
    };
  }

  componentDidMount() {
    this.unsubscribe = this.store.subscribe(() => this.forceUpdate());
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  showPaperCopyHandler = () => {
    const ESOPState = this.store.getState().ESOP;
    const UIState = this.store.getState().UI;
    const employee = ESOPState.employees.find(e => e.address === UIState.selectedUser);

    const dic = this.prepareEmployeeDataObject(ESOPState, employee);

    const ipfsHash = window.web3.toAscii(window.web3.toHex(window.web3.toBigNumber(ESOPState.ESOPLegalWrapperIPFSHash.replace(new RegExp('"', 'g'), ''))));
    this.setState({
      ipfsHash,
    });
    validateDoc(ipfsHash, (data) => {
      Object.keys(dic).map((key, index) => {
        data = data.replace(new RegExp(`{${key}}`, 'g'), dic[key]);
      });

      this.setState({
        showDocumentDialog: true,
        LegalDocument: data,
      });
    });
  };

  handleDialogRequestClose = () => {
    this.setState({
      showDocumentDialog: false,
    });
  };

  handleOpenSupend = () => {
    this.setState({ openSuspendDialog: true });
  };

  handleCloseSupend = () => {
    this.setState({ openSuspendDialog: false });
  };

  handleToggleSuspendButton = () => {
    const ESOPState = this.store.getState().ESOP;
    const UIState = this.store.getState().UI;
    const employee = ESOPState.employees.find(e => e.address === UIState.selectedUser);
    const employeePublicKey = employee.address;
    const toggledAt = new Date() / 1000;

    this.setState({ openSuspendDialog: false });

    this.store.dispatch({
      type: 'SHOW_CONFIRM_TRANSACTION_DIALOG',
      confirmTransactionDialog: true,
    });

    this.services.ESOPService.toggleEmployeeSuspension(employeePublicKey, toggledAt).then(
      (success) => {
        this.services.ESOPService.getESOPDataFromContract();
        this.store.dispatch({
          type: 'SHOW_CONFIRM_TRANSACTION_DIALOG',
          confirmTransactionDialog: false,
        });
        this.store.dispatch({
          type: 'SHOW_TX_SUCCESS_DIALOG',
          txHash: success,
        });
      },
      (error) => {
        this.store.dispatch({
          type: 'SHOW_CONFIRM_TRANSACTION_DIALOG',
          confirmTransactionDialog: false,
        });

        this.store.dispatch({
          type: 'SET_ERROR_DIALOG_MSG',
          errorDialogMsg: error.toString(),
        });

        this.store.dispatch({
          type: 'SHOW_ERROR_DIALOG',
          errorDialog: true,
        });
        console.log(error);
      }
    );
  };

  /**
   *
   * @param terminationType 0 - Regular, 1 - BadLeaver
   * @returns {function()}
   */
  handleTerminateUserButton = (terminationType) => {
    const ESOPState = this.store.getState().ESOP;
    const UIState = this.store.getState().UI;
    const employee = ESOPState.employees.find(e => e.address === UIState.selectedUser);

    let tType;
    if (terminationType === 'Regular') {
      tType = 0;
    } else if (terminationType === 'BadLeaver') {
      tType = 1;
    }

    const terminatedAt = Math.floor(this.state.terminateDate / 1000);

    return () => {
      this.store.dispatch({
        type: 'SHOW_CONFIRM_TRANSACTION_DIALOG',
        confirmTransactionDialog: true,
      });

      this.services.ESOPService.terminateEmployee(employee.address, terminatedAt, tType).then(
        (success) => {
          this.services.ESOPService.getESOPDataFromContract();
          this.store.dispatch({
            type: 'SHOW_CONFIRM_TRANSACTION_DIALOG',
            confirmTransactionDialog: false,
          });

          this.store.dispatch({
            type: 'SHOW_TX_SUCCESS_DIALOG',
            txHash: success,
          });

          this.setState({ terminateDate: undefined });

          this.store.dispatch({
            type: 'SET_SELECTED_USER',
            selectedUser: undefined,
          });
        },
        (error) => {
          this.store.dispatch({
            type: 'SHOW_CONFIRM_TRANSACTION_DIALOG',
            confirmTransactionDialog: false,
          });

          this.store.dispatch({
            type: 'SET_ERROR_DIALOG_MSG',
            errorDialogMsg: error.toString(),
          });

          this.store.dispatch({
            type: 'SHOW_ERROR_DIALOG',
            errorDialog: true,
          });
          console.log(error);
        }
      );
    };
  };

  render() {
    const numberFormatter = new Intl.NumberFormat();
    const userState = this.store.getState().user;
    const ESOPState = this.store.getState().ESOP;
    const UIState = this.store.getState().UI;
    const employee = ESOPState.employees.find(e => e.address === UIState.selectedUser);

    const toggleSuspendButtonLabel = employee.suspendedAt === 0 ? 'Suspend' : 'Continue Employment';
    const suspendDialogText = employee.suspendedAt === 0 ?
      'Do you want to suspend employee?'
      :
      'Do you want to continue employment of employee?';

    const showSuspendButton = employee.state === 2; // Only for Employed
    const showTerminateButtons = employee.state === 1 || employee.state === 2; // Only for WaitingForSignature or Employed

    const timeToSignExpired = employee.timeToSign <= ESOPState.currentBlockTimestamp;
    const showTimeToSign = employee.state === 1 && !timeToSignExpired;
    const timeToSignValue = moment.unix(employee.timeToSign).format(Config.dateFormat);

    const actionsSuspend = [
      <FlatButton
        label="Cancel"
        primary
        onTouchTap={this.handleCloseSupend}
      />,
      <FlatButton
        label={toggleSuspendButtonLabel}
        primary
        onTouchTap={this.handleToggleSuspendButton}
      />,
    ];

    const dialogTitleStyle = {
      textAlign: 'center',
    };

    const parameters = [];
    parameters.push({
      label: 'Issue date',
      value: moment.unix(employee.issueDate).format(Config.dateFormat),
      desc: Texting.definitions.issueDate,
    });
    if (showTimeToSign) {
      parameters.push({
        label: 'Time to sign',
        value: timeToSignValue,
      });
    }
    if (employee.terminatedAt !== 0) {
      parameters.push({
        label: 'Terminated at',
        value: moment.unix(employee.terminatedAt).format(Config.dateFormat),
      });
    }
    parameters.push({
      label: 'Pool options',
      value: numberFormatter.format(employee.poolOptions),
      desc: Texting.definitions.poolOptions,
    });
    parameters.push({
      label: 'Extra options',
      value: numberFormatter.format(employee.extraOptions),
      desc: Texting.definitions.extraOptions,
    });
    parameters.push({
      label: 'Vested options',
      value: numberFormatter.format(employee.vestedOptions),
    });
    if (employee.suspendedAt !== 0) {
      parameters.push({
        label: 'Suspened at',
        value: moment.unix(employee.suspendedAt).format(Config.dateFormat),
      });
    }
    parameters.push({
      label: 'State',
      value: ContractUtils.getEmployeeStateName(employee.state, employee.suspendedAt, timeToSignExpired),
    });

    return (
      <div className="employee_details">
        <IPFSDialog
          ipfsHash={this.state.ipfsHash}
          showDocumentDialog={this.state.showDocumentDialog}
          handleDialogRequestClose={this.handleDialogRequestClose}
          documentHtml={this.state.LegalDocument}
          employeeData={this.prepareEmployeeDataObject(ESOPState, employee)}
        />
        <h3>Employee details:</h3>
        <p>Employee address: {employee.address}</p>
        <div>
          <RaisedButton label="Show agreement" onTouchTap={this.showPaperCopyHandler} />
        </div>
        <TwoColumnParametersList parameters={parameters} />
        <br />
        {userState.userType === 'ceo' &&
        <div>
          {showSuspendButton &&
          <RaisedButton
            className="suspendButton"
            label={toggleSuspendButtonLabel}
            onTouchTap={this.handleOpenSupend}
          />
          }
          {showTerminateButtons &&
          <div>
            <DatePicker
              hintText="Terminate date"
              mode="landscape"
              className="date_picker"
              value={this.state.terminateDate}
              onChange={(event, newValue) => this.setState({ terminateDate: newValue })}
            />
            <RaisedButton label="Bad Leaver" onTouchTap={this.handleTerminateUserButton('BadLeaver')} />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <RaisedButton label="Terminate" onTouchTap={this.handleTerminateUserButton('Regular')} />
          </div>
          }
        </div>
        }
        <Dialog
          title={suspendDialogText}
          titleStyle={dialogTitleStyle}
          actions={actionsSuspend}
          modal
          open={this.state.openSuspendDialog}
        />
      </div>
    );
  }

  prepareEmployeeDataObject = (ESOPState, employee) => {
    const numberFormatter = new Intl.NumberFormat();
    return {
      'company-address': ESOPState.companyAddress,
      'esop-sc-address': ESOPState.ESOPAddress,
      'options-per-share': numberFormatter.format(ESOPState.optionsPerShare),
      'strike-price': ESOPState.STRIKE_PRICE.toString(),
      'pool-options': numberFormatter.format(ESOPState.totalPoolOptions),
      'new-employee-pool-share': `${ESOPState.newEmployeePoolPromille / 100}%`,
      'employee-address': employee.address,
      'issued-options': numberFormatter.format(employee.extraOptions + employee.poolOptions),
      'employee-pool-options': numberFormatter.format(employee.poolOptions),
      'employee-extra-options': numberFormatter.format(employee.extraOptions),
      'issue-date': moment.unix(employee.issueDate).format(Config.dateFormat),
      'vesting-period': epochAsYears(ESOPState.vestingPeriod),
      'cliff-period': epochAsYears(ESOPState.cliffPeriod),
      'bonus-options': `${ESOPState.bonusOptionsPromille / 100}%`,
      'time-to-sign': moment.unix(employee.timeToSign).format(Config.dateFormat),
      'curr-block-hash': ESOPState.currentBlockHash,
      'residual-amount': `${ESOPState.residualAmountPromille / 100}%`,
    };
  };
}
