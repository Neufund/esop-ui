import React from 'react';
import './ContractParameters.scss';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import {epochAsYears} from '../utils'

export default ({contractParameters}) => {
    let numberFormatter = new Intl.NumberFormat();

    let tooltipStyles = {
        fontSize: "1rem",
        padding: "0.5rem"
    };

    return (
        <div>
            <div className="row">
                <div className="col-xs-12">
                    <h2>ESOP terms and conditions:</h2>
                </div>
            </div>
            <div className="row">
                <div className="col-xs-12 contract_parameters">
                    <IconButton iconClassName="material-icons" tooltip="total amount of shares assigned to employees"
                                tooltipStyles={tooltipStyles}>info</IconButton>
                    <TextField floatingLabelText="total pool options" className="contract_parameter"
                               value={numberFormatter.format(contractParameters.totalPoolOptions)} disabled={true}/>

                    <IconButton iconClassName="material-icons" tooltip="every employee gets a percentage of the remaining pool"
                                tooltipStyles={tooltipStyles}>info</IconButton>
                    <TextField floatingLabelText="new employee pool" className="contract_parameter"
                               value={`${contractParameters.newEmployeePoolPromille / 100}%`} disabled={true}/>

                    <TextField floatingLabelText="vesting period" className="contract_parameter"
                               value={epochAsYears(contractParameters.vestingPeriod)} disabled={true}/>

                    <IconButton iconClassName="material-icons" tooltip="period during which employee does not get any options "
                                tooltipStyles={tooltipStyles}>info</IconButton>
                    <TextField floatingLabelText="cliff period" className="contract_parameter"
                               value={epochAsYears(contractParameters.cliffPeriod)} disabled={true}/>

                    <TextField floatingLabelText="residual amount" className="contract_parameter"
                               value={`${contractParameters.residualAmountPromille / 100}%`} disabled={true}/>

                    <TextField floatingLabelText="bonus options" className="contract_parameter"
                               value={`${contractParameters.bonusOptionsPromille / 100}%`} disabled={true}/>

                    <TextField floatingLabelText="strike price" className="contract_parameter"
                               value={`${contractParameters.STRIKE_PRICE} EUR`} disabled={true}/>
                </div>
            </div>
        </div>
    )
};

