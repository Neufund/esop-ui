import React from 'react';
import FontIcon from 'material-ui/FontIcon';
import {Table, TableBody, TableRow, TableRowColumn} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton'
import './EmployeeSignESOP.scss'
import ContractUtils from '../ContractUtils'
import {humanReadableDuration} from '../utils'
import moment from 'moment'

export default ({employee, ESOPState, signHandler}) => {
    let dateFormat = 'YY-MM-DD'; //TODO: this should go to configuration
    let numberFormatter = new Intl.NumberFormat();

    let table = [
        {
            desc: "Public Key (Ethereum Address of Employee)",
            value: <div>{employee.address} <a key={1} className="inline_link" target="_blank"
                                              href={`https://etherscan.io/address/${employee.address}`}>
                <FontIcon className="material-icons material_icon_table">link</FontIcon></a></div>
        },
        {
            desc: "Issued Options",
            value: numberFormatter.format(employee.poolOptions + employee.extraOptions)
        },
        {
            desc: "Pool Options",
            value: numberFormatter.format(employee.poolOptions)
        },
        {
            desc: "Extra Options",
            value: numberFormatter.format(employee.extraOptions)
        },
        {
            desc: "Strike price",
            value: `EUR ${ESOPState.strikePrice} per share`
        },
        {
            desc: "Issue Date",
            value: moment.unix(employee.issueDate).format(dateFormat)
        },
        {
            desc: "Vesting Period",
            value: humanReadableDuration(ESOPState.vestingPeriod)
        },
        {
            desc: "Cliff period",
            value: humanReadableDuration(ESOPState.cliffPeriod)
        },
        {
            desc: "Bonus Options",
            value: ESOPState.bonusOptionsPromille
        },
        {
            desc: "Fade Out Period",
            value: <b>soon</b>
        },
        {
            desc: "Residual amount",
            value: <b>soon</b>
        },
        {
            desc: "Time to accept Option-Offer",
            value: moment.unix(employee.timeToSign).format(dateFormat)
        },
        {
            desc: "EMPLOYEE STATUS",
            value: ContractUtils.getEmployeeStateName(employee.state)
        }
    ];

    return (
        <div className="employee_sign_esop">
            <div className="row">
                <div className="col-xs-12">
                    <h3>Fifth force GmBH identifed by address {ESOPState.companyAddress}
                        <a className="inline_link" target="_blank"
                           href={`https://etherscan.io/address/${ESOPState.companyAddress}`}>
                            <FontIcon className="material-icons">link</FontIcon></a></h3>
                    <h4>ESOP Subscription Form</h4>
                    <Table selectable={false}>
                        <TableBody displayRowCheckbox={false}>
                            {table.map((row, index) =>
                                <TableRow key={index}>
                                    <TableRowColumn>{row.desc}</TableRowColumn>
                                    <TableRowColumn>{row.value}</TableRowColumn>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <div className="row">
                <div className="col-xs-12 buttons">
                    <RaisedButton label="Sign ESOP" onTouchTap={signHandler}/>
                    <RaisedButton label="Show paper copy"/>
                </div>
            </div>
        </div>
    )
}