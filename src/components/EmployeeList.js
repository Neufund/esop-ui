import React from 'react';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

export default ({employeeList}) => {
    return (
        <div>
            <h3>Employee list:</h3>
            <Table selectable={false}>
                <TableHeader
                    displaySelectAll={false}
                    adjustForCheckbox={false}
                >
                    <TableRow>
                        <TableHeaderColumn>Public key</TableHeaderColumn>
                        <TableHeaderColumn>Vesting started</TableHeaderColumn>
                        <TableHeaderColumn>Terminated At</TableHeaderColumn>
                        <TableHeaderColumn>Options number</TableHeaderColumn>
                        <TableHeaderColumn>Extra options</TableHeaderColumn>
                        <TableHeaderColumn>Status</TableHeaderColumn>

                    </TableRow>
                </TableHeader>
                <TableBody
                    displayRowCheckbox={false}
                >
                    {employeeList.map((row, index) => (
                        <TableRow key={index}>
                            <TableRowColumn>{row.address}</TableRowColumn>
                            <TableRowColumn>{row.vestingStarted}</TableRowColumn>
                            <TableRowColumn>{row.terminatedAt}</TableRowColumn>
                            <TableRowColumn>{row.options}</TableRowColumn>
                            <TableRowColumn>{row.extraOptions}</TableRowColumn>
                            <TableRowColumn>{row.state}</TableRowColumn>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
