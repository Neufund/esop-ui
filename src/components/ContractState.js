import React from 'react';
import ContractUtils from '../ContractUtils'
import {Table, TableBody, TableRow, TableRowColumn} from 'material-ui/Table';

export default ({contractState}) => {
    return (
        <div className="row">
            <div className="col-xs-12">
                <h2 className="contracts_stats">Contract state:</h2>
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
                            <TableRowColumn>total extra options</TableRowColumn>
                            <TableRowColumn>{contractState.totalExtraOptions}</TableRowColumn>
                        </TableRow>
                        <TableRow>
                            <TableRowColumn>conversion offered at</TableRowColumn>
                            <TableRowColumn>{contractState.conversionOfferedAt}</TableRowColumn>
                        </TableRow>
                        <TableRow>
                            <TableRowColumn>exercise options dead line</TableRowColumn>
                            <TableRowColumn>{contractState.exerciseOptionsDeadline}</TableRowColumn>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}