import React from 'react';
import './Header.scss';

export default ({userPK, userType}) => {
    return (
        <div className="row">
            <div className="col-xs-12 col-md-10 col-md-offset-1">
                <div className="header">
                    ESOP Dapp
                </div>
                {userPK !== undefined ?
                    <p>Hello unknown address: <b>{userPK}</b></p>
                    :
                    <p>Please enable your metamask or plug nano ledger so we can identify you!</p>
                }
                {userType === "anonymous" ?
                    <p>If you are Neufund employee, please pass address above to us to be included in ESOP.</p>
                        :
                    <p>Your position: {userType}</p>
                }
            </div>
        </div>
    )
}