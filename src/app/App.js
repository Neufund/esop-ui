import React from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import muiTheme from '../muiTheme';

import './App.scss';
import Header from '../ui/Header'

export default (props) => {
    let store = props.route.store;

    return (
        <MuiThemeProvider muiTheme={muiTheme}>
            <div>
                <Header store={store}/>
                <div className="row">
                    <div className="col-xs-12 col-md-10 col-md-offset-1">
                        {props.children}
                    </div>
                </div>
            </div>
        </MuiThemeProvider>
    )
};
