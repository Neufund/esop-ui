import React from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import './App.scss';
import Header from '../ui/Header'

export default ({children}) => {
    return (
        <MuiThemeProvider>
            <div>
                <Header/>
                <div className="row">
                    <div className="col-xs-12 col-md-10 col-md-offset-1">
                        {children}
                    </div>
                </div>
            </div>
        </MuiThemeProvider>
    )
};
