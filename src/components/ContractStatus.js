import React from 'react';
import {Table, TableBody, TableRow, TableRowColumn} from 'material-ui/Table';
import FontIcon from 'material-ui/FontIcon';
import ContractUtils from '../ContractUtils'
import './ContractStatus.scss'
import Texting from '../texting'

export default ({contractState}) => {
    let numberFormatter = new Intl.NumberFormat();
    let table = [
        {
            title: "Total pool options",
            value: numberFormatter.format(contractState.totalPoolOptions)
        },
        {
            title: "Employees in ESOP",
            value: contractState.employees.length
        },
        {
            title: "",
            value: ""
        },
        {
            title: "Remaning pool options",
            value: numberFormatter.format(contractState.remainingPoolOptions)
        },
        {
            title: "Extra options issued",
            desc: Texting.definitions.extraOptions,
            value: numberFormatter.format(contractState.totalExtraOptions)
        },
        {
            title: "ESOP state",
            value: ContractUtils.getESOPStateName(contractState.esopState)
        }
    ];

    let cellClickHandler = (rowNumber, columnId) => {
        let element = document.getElementById(`desc${rowNumber}`);
        if (element != null) {
            if (element.style.display == "" || element.style.display == "none") {
                element.style.display = "block";
            }
            else {
                element.style.display = "";
            }
        }
    };

    return (
        <div className="row contract_status">
            <div className="col-xs-12 col-md-12 col-lg-10">
                <h2 className="contracts_stats">Neufund employee option grants status:</h2>
                <Table selectable={false} onCellClick={cellClickHandler}>
                    <TableBody displayRowCheckbox={false}>
                        {table.map((row, index) =>
                            <TableRow key={index}>
                                <TableRowColumn>
                                    {row.desc == undefined ?
                                        row.title
                                        :
                                        <div>
                                            <div className="title">
                                                {row.title}<FontIcon className="material-icons">info_outline</FontIcon>
                                            </div>
                                            <div className="description" id={`desc${index}`}>{row.desc}</div>
                                        </div>
                                    }
                                </TableRowColumn>
                                <TableRowColumn>{row.value}</TableRowColumn>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}