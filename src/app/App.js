import React from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import muiTheme from '../muiTheme';

import './App.scss';
import Header from '../ui/Header'
import Esop from './Esop'

export default ({store}) => {


    return (
        <MuiThemeProvider muiTheme={muiTheme}>
            <div>
                <Header store={store}/>
                <div className="row">
                    <div className="col-xs-12 col-md-10 col-md-offset-1">
                        <Esop store={store}/>
                    </div>
                </div>
            </div>
        </MuiThemeProvider>
    )
};
