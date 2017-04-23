import React from 'react';
import {Table, TableBody, TableRow, TableRowColumn} from 'material-ui/Table';
import ContractUtils from '../ContractUtils'
import {humanReadableDuration} from '../utils'

export default ({contractState}) => {
    return (
        <div className="row">
            <div className="col-xs-12">
                <h2 className="contracts_stats">Contract status:</h2>
                <Table selectable={false}>
                    <TableBody displayRowCheckbox={false}>
                        <TableRow >
                            <TableRowColumn>ESOP state</TableRowColumn>
                            <TableRowColumn>{ContractUtils.getESOPStateName(contractState.esopState)}</TableRowColumn>
                        </TableRow>
                        <TableRow>
                            <TableRowColumn>Remaning pool options</TableRowColumn>
                            <TableRowColumn>{contractState.remainingPoolOptions}</TableRowColumn>
                        </TableRow>
                        <TableRow>
                            <TableRowColumn>Extra options issued</TableRowColumn>
                            <TableRowColumn>{contractState.totalExtraOptions}</TableRowColumn>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}