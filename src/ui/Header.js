import React from 'react';
import {Link} from 'react-router'

import FlatButton from 'material-ui/FlatButton';

import './Header.scss';

export default class Header extends React.Component {

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
        let userState = this.store.getState().user;
        return (
            <div>
                <div className="row">
                    <div className="col-xs-12 col-md-10 col-md-offset-1">
                        <div className="header">
                            ESOP Dapp
                        </div>
                    </div>
                </div>
                {userState.userPK != undefined &&
                <div className="row">
                    <div className="col-xs-12 col-md-10 col-md-offset-1">
                        Hello user: {userState.userPK}
                    </div>
                </div>
                }

                {userState.userType != "anonymous" &&
                <div className="row">
                    <div className="col-xs-12 col-md-10 col-md-offset-1">
                        We identified you as: {userState.userType}
                    </div>
                </div>
                }
            </div>
        )
    }
}