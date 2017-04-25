import React from 'react';
import {Table, TableBody, TableRow, TableRowColumn} from 'material-ui/Table';
import ContractUtils from '../ContractUtils'

export default ({contractState}) => {
    let numberFormatter = new Intl.NumberFormat();
    let table = [
        {
            desc: "ESOP state",
            value: ContractUtils.getESOPStateName(contractState.esopState)
        },
        {
            desc: "Employees in ESOP",
            value: contractState.employees.length
        },
        {
            desc: "Total pool options",
            value: numberFormatter.format(contractState.totalPoolOptions)
        },
        {
            desc: "Remaning pool options",
            value: numberFormatter.format(contractState.remainingPoolOptions)
        },
        {
            desc: "Extra options issued",
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
                                <TableRowColumn>{row.desc}</TableRowColumn>
                                <TableRowColumn>{row.value}</TableRowColumn>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}