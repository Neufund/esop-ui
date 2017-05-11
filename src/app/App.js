import React from 'react';
import './App.scss';

import muiTheme from '../muiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';

import Header from '../components/Header'
import Esop from './Esop'
import Waiting from './Waiting'
import OpenESOP from './OpenESOP'
import FailedToLoad from '../components/FailedToLoad'

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
            type: "SHOW_ERROR_DIALOG",
            errorDialog: false
        });

        this.store.dispatch({
            type: "SET_ERROR_DIALOG_MSG",
            errorDialogMsg: ''
        });
    };

    render() {
        let ESOPstate = this.store.getState().ESOP;
        let UIstate = this.store.getState().UI;
        let userState = this.store.getState().user;

        let componentToRender;
        if (UIstate.waitingForData) {
            componentToRender = <Waiting/>
        } else {
            if (ESOPstate.esopState === undefined) {
                componentToRender = <FailedToLoad/>;
            } else {
                if (ESOPstate.esopState == 0) {
                    componentToRender = <OpenESOP store={this.store} services={this.services}/>
                } else {
                    componentToRender = <Esop store={this.store} services={this.services}/>
                }
            }
        }

        let closeActions = [<FlatButton label="I got it" onTouchTap={this.handleCloseErrorDialog}/>];

        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div>
                    <Header userPK={userState.userPK} userType={userState.userType} networkId={ESOPstate.networkId}/>
                    <a name="esop_dapp"/>
                    {componentToRender}

                    <Dialog
                        title="Please confirm access to your account on your Nano Ledger"
                        modal={true}
                        open={UIstate.nanoConfirmAccountDialog}>
                    </Dialog>

                    <Dialog
                        title="Please confirm transaction using your wallet!"
                        modal={true}
                        open={UIstate.confirmTransactionDialog}>
                        <div>
                            Confirm operation and wait for Ethereum network to mine it. It might take a minute or two.
                        </div>
                        <div className="dialog_transaction_progress">
                            <CircularProgress />
                        </div>
                    </Dialog>

                    <Dialog
                        title="Ups, we have a problem"
                        modal={true}
                        open={UIstate.errorDialog}
                        actions={closeActions}>
                        <p>Below you will find more information about what caused problem. If information is not clear contact tech team.</p>
                        <pre>
                            {UIstate.errorDialogMsg}
                        </pre>
                    </Dialog>
                </div>
            </MuiThemeProvider>
        )
    }
};
