import React from 'react';
import {epochAsYears} from '../utils'
import Texting from '../texting'

import TwoColumnParametersList from './TwoColumnParametersList'

export default ({contractParameters}) => {
    let numberFormatter = new Intl.NumberFormat();

    let paramaters = [
        {
            label: "total pool options",
            value: numberFormatter.format(contractParameters.totalPoolOptions),
            desc: Texting.definitions.totalPoolOptions
        },
        {
            label: "new employee pool",
            value: `${contractParameters.newEmployeePoolPromille / 100}%`,
            desc: Texting.definitions.newEmployeePool
        },
        {
            label: "vesting period",
            value: epochAsYears(contractParameters.vestingPeriod),
            desc: Texting.definitions.vestingPeriod
        },
        {
            label: "cliff period",
            value: epochAsYears(contractParameters.cliffPeriod),
            desc: Texting.definitions.cliffPeriod
        },
        {
            label: "residual amount",
            value: `${contractParameters.residualAmountPromille / 100}%`,
            desc: Texting.definitions.residualAmount
        },
        {
            label: "bonus options",
            value: `${contractParameters.bonusOptionsPromille / 100}%`,
            desc: Texting.definitions.bonusOptions
        },
        {
            label: "strike price",
            value: `${contractParameters.STRIKE_PRICE} EUR`,
            desc: Texting.definitions.strikePrice
        }
    ];

    return (
        <div>
            <div className="row">
                <div className="col-xs-12">
                    <h2>ESOP terms and conditions:</h2>
                </div>
            </div>
            <TwoColumnParametersList parameters={paramaters}/>
        </div>
    )
};

