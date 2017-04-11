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
                        <TableHeaderColumn>Issue date</TableHeaderColumn>
                        <TableHeaderColumn>Terminated at</TableHeaderColumn>
                        <TableHeaderColumn>Fadeout starts</TableHeaderColumn>
                        <TableHeaderColumn>Pool options</TableHeaderColumn>
                        <TableHeaderColumn>Suspended at</TableHeaderColumn>
                        <TableHeaderColumn>State</TableHeaderColumn>

                    </TableRow>
                </TableHeader>
                <TableBody
                    displayRowCheckbox={false}
                >
                    {employeeList.map((row, index) => (
                        <TableRow key={index}>
                            <TableRowColumn>{row.address}</TableRowColumn>
                            <TableRowColumn>{row.issueDate}</TableRowColumn>
                            <TableRowColumn>{row.terminatedAt}</TableRowColumn>
                            <TableRowColumn>{row.fadeoutStarts}</TableRowColumn>
                            <TableRowColumn>{row.poolOptions}</TableRowColumn>
                            <TableRowColumn>{row.suspendedAt}</TableRowColumn>
                            <TableRowColumn>{row.state}</TableRowColumn>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
