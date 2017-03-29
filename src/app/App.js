import React from 'react';
import './App.scss';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

export default ({children}) => {
    return (
        <MuiThemeProvider>
            <div>
                <div className="row">
                    <div className="col-xs-12 col-md-10 col-md-offset-1">
                        {children}
                    </div>
                </div>
            </div>
        </MuiThemeProvider>
    )
};
