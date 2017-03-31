import React from 'react';
import './EmployeeList.scss';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

export default (props) => {

    let users = [
        {
            publicKey: "0x0046adE103035E8d9B1E8143Ec077F7cfcB47c2f",
            vestingStart: "2014-12-30",
            optionsNumber: 1245
        },
        {
            publicKey: "0x0046adE103035E8d9B1E8143Ec0as37cfcB47c2f",
            vestingStart: "2014-12-30",
            optionsNumber: 31245054
        }
    ];

    return (
        <div>
            <Table selectable={false}>
                <TableHeader
                    displaySelectAll={false}
                    adjustForCheckbox={false}
                >
                    <TableRow>
                        <TableHeaderColumn>Public key</TableHeaderColumn>
                        <TableHeaderColumn>Vesting starts</TableHeaderColumn>
                        <TableHeaderColumn>Options number</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody
                    displayRowCheckbox={false}
                >
                    {users.map((row, index) => (
                        <TableRow key={index}>
                            <TableRowColumn>{row.publicKey}</TableRowColumn>
                            <TableRowColumn>{row.vestingStart}</TableRowColumn>
                            <TableRowColumn>{row.optionsNumber}</TableRowColumn>
                        </TableRow>
                    ))}
                </ TableBody >
            </ Table >
        </ div >
    )
}
