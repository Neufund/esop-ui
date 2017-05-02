import React from 'react';
import {Table, TableBody, TableRow, TableRowColumn} from 'material-ui/Table';

import Config from '../config'


export default ({contractState}) => {
    return (
        <div className="row">
            <div className="col-xs-12">
                <h2 className="contracts_stats">Conversion status:</h2>
                <Table selectable={false}>
                    <TableBody displayRowCheckbox={false}>
                        <TableRow>
                            <TableRowColumn>conversion offered at</TableRowColumn>
                            <TableRowColumn>{moment.unix(contractState.conversionOfferedAt).format(Config.dateFormat)}</TableRowColumn>
                        </TableRow>
                        <TableRow>
                            <TableRowColumn>exercise options dead line</TableRowColumn>
                            <TableRowColumn>{moment.unix(contractState.exerciseOptionsDeadline).format(Config.dateFormat)}</TableRowColumn>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}