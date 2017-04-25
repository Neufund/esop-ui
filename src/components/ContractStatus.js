import React from 'react';
import {Table, TableBody, TableRow, TableRowColumn} from 'material-ui/Table';
import ContractUtils from '../ContractUtils'

export default ({contractState}) => {
    let numberFormatter = new Intl.NumberFormat();
    let table = [
        {
            title: "ESOP state",
            value: ContractUtils.getESOPStateName(contractState.esopState)
        },
        {
            title: "Employees in ESOP",
            value: contractState.employees.length
        },
        {
            title: "Total pool options",
            value: numberFormatter.format(contractState.totalPoolOptions)
        },
        {
            title: "Remaning pool options",
            value: numberFormatter.format(contractState.remainingPoolOptions)
        },
        {
            title: "Extra options issued",
            value: numberFormatter.format(contractState.totalExtraOptions)
        }
    ];

    return (
        <div className="row">
            <div className="col-xs-12">
                <h2 className="contracts_stats">Contract status:</h2>
                <Table selectable={false}>
                    <TableBody displayRowCheckbox={false}>
                        {table.map((row, index) =>
                            <TableRow key={index}>
                                <TableRowColumn>{row.title}</TableRowColumn>
                                <TableRowColumn>{row.value}</TableRowColumn>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}