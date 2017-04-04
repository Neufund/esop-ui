import React from 'react';
import {Link} from 'react-router'

import FlatButton from 'material-ui/FlatButton';

import './Header.scss';

export default class Header extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-xs-12 col-md-10 col-md-offset-1">
                        <div className="header">
                            ESOP Dapp
                        </div>
                    </div>
                </div>

                <div className="row ">
                    <div className="col-xs-12 col-md-10 col-md-offset-1 devMenu">
                        <div>
                            <Link to="/init">
                                <FlatButton className="button" label="init"/>
                            </Link>
                            <Link to="/esop">
                                <FlatButton label="esop"/>
                            </Link>
                        </div>
                        {/*
                        <div>
                            <FlatButton label="anonymous"/>
                            <FlatButton label="ceo"/>
                            <FlatButton label="employee"/>
                        </div>
                         */}
                    </div>
                </div>
            </div>
        )
    }
}