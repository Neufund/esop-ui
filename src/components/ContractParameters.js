import React from 'react';
import './ContractParameters.scss';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import {epochAsYears} from '../utils'
import Texting from '../texting'

export default ({contractParameters}) => {
    let numberFormatter = new Intl.NumberFormat();

    let tooltipStyles = {
        fontSize: "1rem",
        padding: "0.5rem"
    };

    let paramaters = [
        {
            text: "total pool options",
            value: numberFormatter.format(contractParameters.totalPoolOptions),
            desc: Texting.definitions.totalPoolOptions
        },
        {
            text: "new employee pool",
            value: `${contractParameters.newEmployeePoolPromille / 100}%`,
            desc: Texting.definitions.newEmployeePool
        },
        {
            text: "vesting period",
            value: epochAsYears(contractParameters.vestingPeriod),
            desc: Texting.definitions.vestingPeriod
        },
        {
            text: "cliff period",
            value: epochAsYears(contractParameters.cliffPeriod),
            desc: Texting.definitions.cliffPeriod
        },
        {
            text: "residual amount",
            value: `${contractParameters.residualAmountPromille / 100}%`,
            desc: Texting.definitions.residualAmount
        },
        {
            text: "bonus options",
            value: `${contractParameters.bonusOptionsPromille / 100}%`,
            desc: Texting.definitions.bonusOptions
        },
        {
            text: "strike price",
            value: `${contractParameters.STRIKE_PRICE} EUR`,
            desc: Texting.definitions.strikePrice
        },

    ];

    return (
        <div>
            <div className="row">
                <div className="col-xs-12">
                    <h2>ESOP terms and conditions:</h2>
                </div>
            </div>
            <div className="row">
                <div className="col-xs-12 contract_parameters">
                    {paramaters.map((parameter, index) =>
                        <div className="parameter_wrapper" key={index}>
                            <TextField floatingLabelText={parameter.text} className="contract_parameter" disabled={true}
                                       value={parameter.value}/>
                            <IconButton iconClassName="material-icons" tooltip={parameter.desc}
                                        tooltipStyles={tooltipStyles}>info</IconButton>

                        </div>
                    )}
                </div>
            </div>
        </div>
    )
};

