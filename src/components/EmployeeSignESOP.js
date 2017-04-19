import React from 'react';

import RaisedButton from 'material-ui/RaisedButton'

export default ({employee, ESOPState, signHandler}) => {
    return (
        <div>
            <div className="row">
                <div className="col-xs-12">
                    <h3>Fifth force GmBH identifed by public key {ESOPState.companyAddress}</h3>
                    <h4>Copy of your ESOP-SubscriptionForm</h4>
                    <div>Public Key (Ethereum Address of Employee: {employee.address}</div>
                    <div>Issued Options: {employee.poolOptions + employee.extraOptions}</div>
                </div>
            </div>
            <div className="row">
                <div className="col-xs-11 col-xs-offset-1">
                    <div>Pool Options: {employee.poolOptions}</div>
                    <div>Extra Options: {employee.extraOptions}</div>
                </div>
            </div>
            <div className="row">
                <div className="col-xs-12">
                    <div>Strike price: EUR {ESOPState.strikePrice} per share</div>
                    <div>Issue Date: {employee.issueDate}</div>
                    <div>Vesting Period: {ESOPState.vestingPeriod}</div>
                    <div>Cliff period: {ESOPState.cliffPeriod}</div>
                    <div>Bonus Options: {ESOPState.bonusOptionsPromille}</div>
                    <div>Fade Out Period: <b>implement this</b></div>
                    <div>Residual amount: <b>implement this</b></div>
                    <div>Time to accept Option-Offer: {employee.timeToSign}</div>
                    <div>EMPLOYEE STATUS: {employee.state}</div>

                    <RaisedButton label="Sign ESOP" onTouchTap={signHandler}/>
                </div>
            </div>
        </div>
    )
}