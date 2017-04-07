import React from 'react';
import './ContractParameters.scss';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton'

export default ({contractParameters, onClickTap}) => {
    return (
        <div className="col-xs-12 contract_parameters">
            <TextField floatingLabelText="cliff duration" className="contract_parameter"  value={contractParameters.cliffDuration} disabled={true}/>
            <TextField floatingLabelText="vesting duration" className="contract_parameter"  value={contractParameters.vestingDuration} disabled={true}/>
            <TextField floatingLabelText="max fadeout promille" className="contract_parameter" value={contractParameters.maxFadeoutPromille} disabled={true}/>
            <TextField floatingLabelText="exit bonus promille" className="contract_parameter"  value={contractParameters.exitBonusPromille} disabled={true}/>
            <TextField floatingLabelText="new employee pool promille" className="contract_parameter"  value={contractParameters.totalOptions} disabled={true}/>
            <TextField floatingLabelText="total options" className="contract_parameter"  value={contractParameters.percentForNew} disabled={true}/>
            <RaisedButton label="Show Paper Contract" className="contract_parameter" onTouchTap={onClickTap}/>
        </div>
    )
};