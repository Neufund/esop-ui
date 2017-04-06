import React from 'react';

import {Table, TableBody, TableRow, TableRowColumn} from 'material-ui/Table';

export default ({contractStats}) => {
    return (
        <div className="row">
            <div className="col-xs-12">
                <h2 className="contracts_stats">Contract stats:</h2>
                <Table selectable={false}>
                    <TableBody displayRowCheckbox={false}>
                        <TableRow >
                            <TableRowColumn>ESOP status</TableRowColumn>
                            <TableRowColumn>{contractStats.ESOPState == 1 ? "Active" : "Converted"}</TableRowColumn>
                        </TableRow>
                        <TableRow>
                            <TableRowColumn>Number of participants</TableRowColumn>
                            <TableRowColumn>{contractStats.employeesNo}</TableRowColumn>
                        </TableRow>
                        <TableRow>
                            <TableRowColumn>Number of options given</TableRowColumn>
                            <TableRowColumn>{contractStats.optionsGiven}</TableRowColumn>
                        </TableRow>
                        <TableRow>
                            <TableRowColumn>Number of options left in pool</TableRowColumn>
                            <TableRowColumn>{contractStats.optionsLeft}</TableRowColumn>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}