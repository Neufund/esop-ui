import React from 'react';
import FontIcon from 'material-ui/FontIcon';
import {Table, TableBody, TableRow, TableRowColumn} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton'
import './EmployeeSignESOP.scss'
import ContractUtils from '../ContractUtils'
import {epochAsYears} from '../utils'
import Config from '../config'
import Texting from '../texting'

import moment from 'moment'

export default ({employee, ESOPState, signHandler, showPaperCopyHandler}) => {

    let numberFormatter = new Intl.NumberFormat();

    /* If you want to use HTML elements you need to wrap them in div. Reason is you are writing code in JSX which is
        later transpiled into JS.
        ex. desc: <div>I want to use &lt;br /&gt; <br /> element</div>
     */

    let table = [
        {
            title: "Public Key (Ethereum Address of Employee)",
            value: <div>{employee.address} <a key={1} className="inline_link" target="_blank"
                                              href={ContractUtils.formatEtherscanUrl(employee.address, ESOPState.networkId)}>
                <FontIcon className="material-icons material_icon_table">link</FontIcon></a></div>
        },
        {
            title: "Issued Options",
            desc: Texting.definitions.issuedOptions,
            value: numberFormatter.format(employee.poolOptions + employee.extraOptions)
        },
        {
            title: "Pool Options",
            desc: Texting.definitions.poolOptions,
            value: numberFormatter.format(employee.poolOptions)
        },
        {
            title: "Extra Options",
            desc: Texting.definitions.extraOptions,
            value: numberFormatter.format(employee.extraOptions)
        },
        {
            title: "Strike price",
            desc: Texting.definitions.strikePrice,
            value: `EUR ${ESOPState.STRIKE_PRICE} per share`
        },
        {
            title: "Options per Share",
            desc: Texting.definitions.optionsPerShare,
            value: `${ESOPState.optionsPerShare}`
        },
        {
            title: "Issue Date",
            desc: Texting.definitions.issueDate,
            value: moment.unix(employee.issueDate).format(Config.dateFormat)
        },
        {
            title: "Vesting Period",
            desc: Texting.definitions.vestingPeriod,
            value: epochAsYears(ESOPState.vestingPeriod)
        },
        {
            title: "Cliff Period",
            desc: Texting.definitions.cliffPeriod,
            value: epochAsYears(ESOPState.cliffPeriod)
        },
        {
            title: "Bonus Options",
            desc: Texting.definitions.bonusOptions,
            value: `${ESOPState.bonusOptionsPromille / 100}%`
        },
        {
            title: "Fade Out Period",
            desc: Texting.definitions.fadeOutPeriod,
            value: "Employment period"
        },
        {
            title: "Residual amount",
            desc: Texting.definitions.residualAmount,
            value: `${ESOPState.residualAmountPromille / 100}%`
        },
        {
            title: "Time to accept Option-Offer",
            value: moment.unix(employee.timeToSign).format(Config.dateFormat)
        },
        {
            title: "EMPLOYEE STATUS",
            value: ContractUtils.getEmployeeStateName(employee.state, employee.suspendedAt, employee.timeToSign <= ESOPState.currentBlockTimestamp)
        }
    ];

    let cellClickHandler = (rowNumber, columnId) => {
        let element = document.getElementById(`descSign${rowNumber}`);
        if (element != null) {
            if (element.style.display == "" || element.style.display == "none") {
                element.style.display = "block";
            }
            else {
                element.style.display = "";
            }
        }
    };

    return (
        <div className="employee_sign_esop">
            <div className="row">
                <div className="col-xs-12 col-md-12 col-lg-10">
                    <div className="esop_title">
                        <h3>Fifth force GmBH identifed by address {ESOPState.companyAddress}
                            <a className="inline_link" target="_blank"
                               href={ContractUtils.formatEtherscanUrl(ESOPState.companyAddress, ESOPState.networkId)}>
                                <FontIcon className="material-icons">link</FontIcon></a></h3>
                        <h4>ESOP Subscription Form</h4>
                    </div>
                    <Table selectable={false} onCellClick={cellClickHandler}>
                        <TableBody displayRowCheckbox={false}>
                            {table.map((row, index) =>
                                <TableRow key={index}>
                                    <TableRowColumn>
                                        {row.desc == undefined ?
                                            row.title
                                            :
                                            <div>
                                                <div className="title">
                                                    {row.title}<FontIcon className="material-icons">info_outline</FontIcon>
                                                </div>
                                                <div className="description" id={`descSign${index}`}>{row.desc}</div>
                                            </div>
                                        }
                                    </TableRowColumn>
                                    <TableRowColumn>{row.value}</TableRowColumn>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <div className="row">
                <div className="col-xs-12">
                    <RaisedButton label="Show paper copy" onTouchTap={showPaperCopyHandler}/>
                </div>
            </div>
            <div className="row">
                <p className="col-xs-12">
                    I hereby subscribe for the Issued Options for shares in {Config.ipfs_tags.company} under the terms
                    and conditions as set out in the ESOP Smart Contract at address {ESOPState.RoTAddress} and made
                    available to me in {Texting.termsDocumentTitle}
                </p>
            </div>
            <div className="row">
                <div className="col-xs-12">
                    <RaisedButton label="Sign ESOP" onTouchTap={signHandler}/>
                </div>
            </div>
        </div>
    )
}