import React from 'react';
import './ContractParameters.scss';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton'
import {epochAsYears} from '../utils'

export default ({contractParameters, isCEO, onClickTap}) => {
    let numberFormatter = new Intl.NumberFormat();
    return (
        <div>
            <div className="row">
                <div className="col-xs-12">
                    <h2>Contract parameters:</h2>
                </div>
            </div>
            <div className="row">
                <div className="col-xs-12 contract_parameters">
                    <TextField floatingLabelText="cliff period" className="contract_parameter"
                               value={epochAsYears(contractParameters.cliffPeriod)} disabled={true}/>
                    <TextField floatingLabelText="vesting period" className="contract_parameter"
                               value={epochAsYears(contractParameters.vestingPeriod)} disabled={true}/>
                    <TextField floatingLabelText="max fadeout" className="contract_parameter"
                               value={`${contractParameters.maxFadeoutPromille / 100}%`} disabled={true}/>
                    <TextField floatingLabelText="bonus options" className="contract_parameter"
                               value={`${contractParameters.bonusOptionsPromille / 100}%`} disabled={true}/>
                    <TextField floatingLabelText="new employee pool" className="contract_parameter"
                               value={`${contractParameters.newEmployeePoolPromille / 100}%`} disabled={true}/>
                    <TextField floatingLabelText="total pool options" className="contract_parameter"
                               value={numberFormatter.format(contractParameters.totalPoolOptions)} disabled={true}/>
                    <TextField floatingLabelText="strike price" className="contract_parameter"
                               value={contractParameters.STRIKE_PRICE} disabled={true}/>
                </div>
            </div>
        </div>
    )
};

