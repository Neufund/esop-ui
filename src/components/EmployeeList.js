import React from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import moment from 'moment'
import ContractUtils from '../ContractUtils'

export default class Init extends React.Component {
    constructor(props) {
        super(props);
        this.store = props.store;
    }

    componentDidMount() {
        this.unsubscribe = this.store.subscribe(() => this.forceUpdate());
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    handleRowSelection = index => {
        let selectedEmployee;

        if (index[0] != undefined) {
            let ESOPState = this.store.getState().ESOP;
            let employeeList = ESOPState.employees;
            selectedEmployee = employeeList[index[0]].address;
        } else {
            selectedEmployee = undefined
        }

        this.store.dispatch({
            type: "SET_SELECTED_USER",
            selectedUser: selectedEmployee
        });
    };

    render() {
        let userState = this.store.getState().user;
        let ESOPState = this.store.getState().ESOP;
        let employeeList = ESOPState.employees;
        let dateFormat = 'YY-MM-DD'; //TODO: this should go to configuration

        return (
            <div>
                <h3>Employee list:</h3>
                <Table onRowSelection={this.handleRowSelection}>
                    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
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
                    //TODO: there is problem with colors - same for selected row and stripped row fix it before turning on
                    <TableBody displayRowCheckbox={false} stripedRows={false} deselectOnClickaway={false}>
                        {employeeList.map((row, index) => (
                            <TableRow key={index}>
                                <TableRowColumn>{row.address}</TableRowColumn>
                                <TableRowColumn>{moment.unix(row.issueDate).format(dateFormat)}</TableRowColumn>
                                <TableRowColumn>{row.terminatedAt != 0 ? moment.unix(row.terminatedAt).format(dateFormat) : "-"}</TableRowColumn>
                                <TableRowColumn>{row.fadeoutStarts != 0 ? moment.unix(row.fadeoutStarts).format(dateFormat) : "-"}</TableRowColumn>
                                <TableRowColumn>{row.poolOptions}</TableRowColumn>
                                <TableRowColumn>{row.suspendedAt != 0 ? moment.unix(row.suspendedAt).format(dateFormat) : "-"}</TableRowColumn>
                                <TableRowColumn>{ContractUtils.getEmployeeStateName(row.state)}</TableRowColumn>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        )
    }
}
