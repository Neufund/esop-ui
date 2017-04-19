import React from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import muiTheme from '../muiTheme';
import Dialog from 'material-ui/Dialog';

import './App.scss';
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

    render() {
        let ESOPstate = this.store.getState().ESOP;
        let UIstate = this.store.getState().UI;

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

        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div>
                    <Header store={this.store}/>
                    {componentToRender}
                    <Dialog
                        title="Please confirm account on your nano"
                        modal={true}
                        open={UIstate.nanoConfirmAccountDialog}>
                        Handle timeout - timer and then instruction to disconnect and F5
                    </Dialog>
                </div>
            </MuiThemeProvider>
        )
    }
};
