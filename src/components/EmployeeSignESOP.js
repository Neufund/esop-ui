import React from 'react';
import FontIcon from 'material-ui/FontIcon';
import {Table, TableBody, TableRow, TableRowColumn} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton'
import './EmployeeSignESOP.scss'
import ContractUtils from '../ContractUtils'
import {epochAsYears} from '../utils'
import Config from '../config'

import moment from 'moment'

export default ({employee, ESOPState, signHandler, showPapelCopeyHandler}) => {

    let numberFormatter = new Intl.NumberFormat();

    /* If you want to use HTML elements you need to wrap them in div. Reason is you are writing code in JSX which is
        later transpiled into JS.
        ex. desc: <div>I want to use &lt;br /&gt; <br /> element</div>
     */

    let table = [
        {
            title: "Public Key (Ethereum Address of Employee)",
            desc: <div>I want to use &lt;br /&gt; <br /> element</div>,
            value: <div>{employee.address} <a key={1} className="inline_link" target="_blank"
                                              href={`https://etherscan.io/address/${employee.address}`}>
                <FontIcon className="material-icons material_icon_table">link</FontIcon></a></div>
        },
        {
            title: "Issued Options",
            value: numberFormatter.format(employee.poolOptions + employee.extraOptions)
        },
        {
            title: "Pool Options",
            value: numberFormatter.format(employee.poolOptions)
        },
        {
            title: "Extra Options",
            desc: "Long description - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
            value: numberFormatter.format(employee.extraOptions)
        },
        {
            title: "Strike price",
            value: `EUR ${ESOPState.STRIKE_PRICE} per share`
        },
        {
            title: "Issue Date",
            value: moment.unix(employee.issueDate).format(Config.dateFormat)
        },
        {
            title: "Vesting Period",
            value: epochAsYears(ESOPState.vestingPeriod)
        },
        {
            title: "Cliff period",
            value: epochAsYears(ESOPState.cliffPeriod)
        },
        {
            title: "Bonus Options",
            value: `${ESOPState.bonusOptionsPromille / 100}%`
        },
        {
            title: "Fade Out Period",
            value: "Employment period"
        },
        {
            title: "Residual amount",
            value: `${ESOPState.residualAmountPromille / 100}%`
        },
        {
            title: "Time to accept Option-Offer",
            value: moment.unix(employee.timeToSign).format(Config.dateFormat)
        },
        {
            title: "EMPLOYEE STATUS",
            value: ContractUtils.getEmployeeStateName(employee.state)
        }
    ];

    let cellClickHandler = (rowNumber, columnId) => {
        let element = document.getElementById(`desc${rowNumber}`);
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
                <div className="col-xs-12">
                    <div className="esop_title">
                        <h3>Fifth force GmBH identifed by address {ESOPState.companyAddress}
                            <a className="inline_link" target="_blank"
                               href={`https://etherscan.io/address/${ESOPState.companyAddress}`}>
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
                                                <div className="description" id={`desc${index}`}>{row.desc}</div>
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
                <p className="col-xs-12">
                    I hereby subscribe for the Issued Options for shares in {ESOPState.companyAddress} under the terms and conditions as set out in the ESOP Smart Contract at address {ESOPState.ESOPAddress} and made available to me in [title of legal wrapper].
                </p>
            </div>
            <div className="row">
                <div className="col-xs-12 buttons">
                    <RaisedButton label="Sign ESOP" onTouchTap={signHandler}/>
                    <RaisedButton label="Show paper copy" onTouchTap={showPapelCopeyHandler}/>
                </div>
            </div>
        </div>
    )
}