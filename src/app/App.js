import React from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import muiTheme from '../muiTheme';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import Header from '../ui/Header'
import Esop from './Esop'
import Waiting from './Waiting'
import Init from './Init'

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
    };

    render() {
        let ESOPstate = this.store.getState().ESOP;
        let UIstate = this.store.getState().UI;
        let userState = this.store.getState().user;

        let componentToRender;
        if (ESOPstate.waitingForData) {
            componentToRender = <Waiting/>
        } else {
            if (ESOPstate.esopState == 0) {
                componentToRender = <Init store={this.store} services={this.services}/>
            } else {
                componentToRender = <Esop store={this.store} services={this.services}/>
            }
        }

        let closeActions = [<FlatButton label="I got it" onTouchTap={this.handleCloseErrorDialog}/>];

        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div>
                    <Header userPK={userState.userPK} userType={userState.userType}/>
                    {componentToRender}

                    <Dialog
                        title="Please confirm account on your nano"
                        modal={true}
                        open={UIstate.nanoConfirmAccountDialog}>
                        Handle timeout - timer and then instruction to disconnect and F5
                    </Dialog>

                    <Dialog
                        title="Please confirm transaction using your signer"
                        modal={true}
                        open={UIstate.confirmTransactionDialog}>
                        Confirm transaction and wait for network to mine it it might take a while.
                    </Dialog>

                    <Dialog
                        title="Ups we have a problem"
                        modal={true}
                        open={UIstate.errorDialog}
                        actions={closeActions}>
                        You can see error in console but you should contact someone from tech team.
                    </Dialog>
                </div>
            </MuiThemeProvider>
        )
    }
};
