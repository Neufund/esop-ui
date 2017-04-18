import React from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import muiTheme from '../muiTheme';

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
        let state = this.store.getState().ESOP;

        let componentToRender;
        if (state.waitingForData) {
            componentToRender = <Waiting/>
        } else {
            if (state.esopState == 0) {
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
                </div>
            </MuiThemeProvider>
        )
    }
};
