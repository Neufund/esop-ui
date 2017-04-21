import React from 'react';
import './Header.scss';

export default ({userPK, userType}) => {
    return (
        <div>
            <div className="row">
                <div className="col-xs-12 col-md-10 col-md-offset-1">
                    <div className="header">
                        ESOP Dapp
                    </div>
                </div>
            </div>
            {userPK != undefined &&
            <div className="row">
                <div className="col-xs-12 col-md-10 col-md-offset-1">
                    Hello user: {userPK}
                </div>
            </div>
            }

            {userType != "anonymous" ?
                <div className="row">
                    <div className="col-xs-12 col-md-10 col-md-offset-1">
                        Your position: {userType}
                    </div>
                </div>
                :
                <div className="row">
                    <div className="col-xs-12 col-md-10 col-md-offset-1">
                        <p>Please enable your metamask or plug nano ledger so we can identify you!</p>
                    </div>
                </div>
            }
        </div>
    )
}