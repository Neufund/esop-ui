import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';

import muiTheme from '../muiTheme';
import Header from '../components/Header';
import Esop from './Esop';
import Waiting from './Waiting';
import OpenESOP from './OpenESOP';
import FailedToLoad from '../components/FailedToLoad';

import './App.scss';
import ContractUtils from '../ContractUtils';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.store = props.store;
    this.services = props.services;
  }

  componentDidMount() {
    this.unsubscribe = this.store.subscribe(() => this.forceUpdate());
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  handleCloseErrorDialog = () => {
    this.store.dispatch({
      type: 'SHOW_ERROR_DIALOG',
      errorDialog: false,
    });

    this.store.dispatch({
      type: 'SET_ERROR_DIALOG_MSG',
      errorDialogMsg: '',
    });
  };

  handleCloseTxSuccessDialog = () => {
    this.store.dispatch({
      type: 'HIDE_TX_SUCCESS_DIALOG',
      errorDialog: false,
    });

    this.store.dispatch({
      type: 'SET_ERROR_DIALOG_MSG',
      errorDialogMsg: '',
    });
  };

  render() {
    const ESOPstate = this.store.getState().ESOP;
    const UIstate = this.store.getState().UI;
    const userState = this.store.getState().user;

    let componentToRender;
    if (UIstate.waitingForData) {
      componentToRender = <Waiting />;
    } else if (ESOPstate.esopState === undefined) {
      componentToRender = <FailedToLoad />;
    } else if (ESOPstate.esopState === 0) {
      componentToRender = <OpenESOP store={this.store} services={this.services} />;
    } else {
      componentToRender = <Esop store={this.store} services={this.services} />;
    }

    const closeActions = [<FlatButton label="I got it" onTouchTap={this.handleCloseErrorDialog} />];
    const closeTxActions = [<FlatButton label="I got it" onTouchTap={this.handleCloseTxSuccessDialog} />];

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <Header
            userPK={userState.userPK}
            userETH={userState.userETH}
            userType={userState.userType}
            networkId={ESOPstate.networkId}
            failedToGetUser={userState.failedToGetUser}
          />
          <a name="esop_dapp" />
          {componentToRender}

          <Dialog
            title="Please confirm transaction using your wallet!"
            modal
            open={UIstate.confirmTransactionDialog}
          >
            <div>
              Confirm operation and wait for it being send to Ethereum network. It might take a minute or two.
            </div>
            <div className="dialog_transaction_progress">
              <CircularProgress />
            </div>
          </Dialog>

          <Dialog
            title="Ups, we have a problem"
            modal
            open={UIstate.errorDialog}
            actions={closeActions}
          >
            <p>
              Below you will find more information about what caused problem. If information is not clear contact tech team.
            </p>
            <pre>
              {UIstate.errorDialogMsg}
            </pre>
          </Dialog>

          <Dialog
            title="Transaction was send"
            modal
            open={UIstate.txSuccessDialog}
            actions={closeTxActions}
          >
            <p>Your transaction was send and it&apos;s hash is: {UIstate.txHash}</p>
            <p>You can use this <a target="_blank" href={ContractUtils.formatEtherscanTxUrl(UIstate.txHash, ESOPstate.networkId)}>link</a> to etherscan.io to follow it.</p>
          </Dialog>
        </div>
      </MuiThemeProvider>
    );
  }
}
