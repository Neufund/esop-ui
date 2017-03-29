import React from 'react';
import {Link} from 'react-router'

import './Header.scss';

export default () => {
    return (
        <div>
            <div className="row">
                <div className="col-xs-12 col-md-10 col-md-offset-1">
                    <div className="header">
                        ESOP Dapp
                    </div>
                </div>
            </div>

            <div className="row devMenu">
                <div className="col-xs-12 col-md-10 col-md-offset-1">
                    <Link to="/init">init</Link>
                    <Link to="/esop">esop</Link>
                    <Link to="/employee">employee</Link>
                </div>
            </div>
        </div>
    )
}