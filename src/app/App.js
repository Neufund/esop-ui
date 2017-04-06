import React from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import muiTheme from '../muiTheme';

import './App.scss';
import Header from '../ui/Header'
import Esop from './Esop'
import Waiting from './Waiting'

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.store = props.store;
    }

    componentDidMount() {
        this.unsubscribe = this.store.subscribe(() => this.forceUpdate());
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        let state = this.store.getState().ESOP;
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div>
                    <Header store={this.store}/>
                    {
                        state.waitingForData ?
                            <Waiting/>
                            :
                            <Esop store={this.store}/>
                    }
                </div>
            </MuiThemeProvider>
        )
    }
};
