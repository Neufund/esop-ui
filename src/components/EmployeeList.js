import React from 'react';
import './EmployeeList.scss';

import FontIcon from 'material-ui/FontIcon';
import moment from 'moment'
import ContractUtils from '../ContractUtils'
import Config from '../config'

export default ({employees, selectedUser, currentBlockTimestamp, rowSelectAction, networkId}) => {

    let handleRowClick = address => {
        return () => {
            if (address == selectedUser) {
                rowSelectAction(undefined);
            } else {
                rowSelectAction(address);
                window.setTimeout(() => {
                    window.scrollTo(0, document.getElementById("user_list_bottom").offsetTop);
                }, 100);
            }
        }
    };

    let numberFormatter = new Intl.NumberFormat();

    return (
        <div className="row employee_list">
            <div className="col-xs-12">
                <h3>Employee list:</h3>
                <table>
                    <thead>
                    <tr>
                        <th className="public_key">Public key</th>
                        <th>Issue date</th>
                        <th>Issued options</th>
                        <th>Vested options</th>
                        <th>State</th>
                    </tr>
                    </thead>
                    <tbody>
                    {employees.map((employee, index) =>
                        <tr key={index} onTouchTap={handleRowClick(employee.address)}
                            className={employee.address == selectedUser ? "selected" : undefined}>
                            <td className="public_key">
                                <a className="inline_link" target="_blank"
                                   href={ContractUtils.formatEtherscanUrl(employee.address, networkId)}>
                                    <FontIcon className="material-icons material_icon_table">link</FontIcon>
                                </a>{employee.address}
                            </td>
                            <td>
                                {moment.unix(employee.issueDate).format(Config.dateFormat)}
                            </td>
                            <td>
                                {numberFormatter.format(employee.poolOptions + employee.extraOptions)}
                            </td>
                            <td>
                                {numberFormatter.format(employee.vestedOptions)}
                            </td>
                            <td>
                                {ContractUtils.getEmployeeStateName(employee.state, employee.suspendedAt, employee.timeToSign <= currentBlockTimestamp)}
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
                <div id="user_list_bottom"></div>
            </div>
        </div>
    )
}
