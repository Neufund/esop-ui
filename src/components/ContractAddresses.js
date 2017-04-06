import React from 'react';

import FontIcon from 'material-ui/FontIcon';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

export default ({RoTAddress, ESOPAddress, OptionsConverterAddress}) => {
    return (
        <div>
            <div className="row">
                <div className="col-xs-12">
                    <h2>Contract addresses:</h2>
                </div>
            </div>

            <div className="row">
                <div className="col-xs-12">
                    <Table selectable={false}>
                        <TableBody displayRowCheckbox={false}>
                            <TableRow >
                                <TableRowColumn>Root of trust</TableRowColumn>
                                <TableRowColumn>
                                    <FontIcon className="material-icons copy_icon">content_copy</FontIcon>
                                    {RoTAddress}
                                </TableRowColumn>
                            </TableRow>
                            <TableRow>
                                <TableRowColumn>ESOP contract</TableRowColumn>
                                <TableRowColumn>
                                    <FontIcon className="material-icons copy_icon">content_copy</FontIcon>
                                    {ESOPAddress}
                                </TableRowColumn>
                            </TableRow>
                            {
                                OptionsConverterAddress != "0x0000000000000000000000000000000000000000" &&
                                <TableRow>
                                    <TableRowColumn>Conversion contract</TableRowColumn>
                                    <TableRowColumn>
                                        <FontIcon className="material-icons copy_icon">content_copy</FontIcon>
                                        {OptionsConverterAddress}
                                    </TableRowColumn>
                                </TableRow>
                            }
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}