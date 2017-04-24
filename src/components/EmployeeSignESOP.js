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
    return (
        <div className="employee_sign_esop">
            <div className="row">
                <div className="col-xs-12">
                    <h3>Fifth force GmBH identifed by address {ESOPState.companyAddress}
                    <a className="inline_link" target="_blank" href={`https://etherscan.io/address/${ESOPState.companyAddress}`}>
                        <FontIcon className="material-icons">link</FontIcon></a></h3>
                    <h4>ESOP Subscription Form</h4>
                    <Table selectable={false}>
                        <TableBody displayRowCheckbox={false}>
                            <TableRow>
                                <TableRowColumn>Public Key (Ethereum Address of Employee</TableRowColumn>
                                <TableRowColumn>{employee.address}
                                    <a className="inline_link" target="_blank" href={`https://etherscan.io/address/${employee.address}`}>
                                    <FontIcon className="material-icons material_icon_table">link</FontIcon></a></TableRowColumn>
                            </TableRow>

                            <TableRow>
                                <TableRowColumn>Issued Options</TableRowColumn>
                                <TableRowColumn>{employee.poolOptions + employee.extraOptions}</TableRowColumn>
                            </TableRow>

                            <TableRow>
                                <TableRowColumn>Pool Options</TableRowColumn>
                                <TableRowColumn>{employee.poolOptions}</TableRowColumn>
                            </TableRow>

                            <TableRow>
                                <TableRowColumn>Extra Options</TableRowColumn>
                                <TableRowColumn>{employee.extraOptions}</TableRowColumn>
                            </TableRow>

                            <TableRow>
                                <TableRowColumn>Strike price</TableRowColumn>
                                <TableRowColumn>EUR {ESOPState.strikePrice} per share</TableRowColumn>
                            </TableRow>

                            <TableRow>
                                <TableRowColumn>Issue Date</TableRowColumn>
                                <TableRowColumn>{moment.unix(employee.issueDate).format(dateFormat)}</TableRowColumn>
                            </TableRow>

                            <TableRow>
                                <TableRowColumn>Vesting Period</TableRowColumn>
                                <TableRowColumn>{humanReadableDuration(ESOPState.vestingPeriod)}</TableRowColumn>
                            </TableRow>

                            <TableRow>
                                <TableRowColumn>Cliff period</TableRowColumn>
                                <TableRowColumn>{humanReadableDuration(ESOPState.cliffPeriod)}</TableRowColumn>
                            </TableRow>

                            <TableRow>
                                <TableRowColumn>Bonus Options</TableRowColumn>
                                <TableRowColumn>{ESOPState.bonusOptionsPromille}</TableRowColumn>
                            </TableRow>

                            <TableRow>
                                <TableRowColumn>Fade Out Period</TableRowColumn>
                                <TableRowColumn><b>soon</b></TableRowColumn>
                            </TableRow>

                            <TableRow>
                                <TableRowColumn>Residual amount</TableRowColumn>
                                <TableRowColumn><b>soon</b></TableRowColumn>
                            </TableRow>

                            <TableRow>
                                <TableRowColumn>Time to accept Option-Offer</TableRowColumn>
                                <TableRowColumn>{moment.unix(employee.timeToSign).format(dateFormat)}</TableRowColumn>
                            </TableRow>

                            <TableRow>
                                <TableRowColumn>EMPLOYEE STATUS</TableRowColumn>
                                <TableRowColumn>{ContractUtils.getEmployeeStateName(employee.state)}</TableRowColumn>
                            </TableRow>
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