import React from 'react';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

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

    handleRowSelection = (index) => {
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
        let allowUserSelection = userState.userType == 'ceo';

        return (
            <div>
                <h3>Employee list:</h3>
                <Table
                    selectable={allowUserSelection}
                    onRowSelection={this.handleRowSelection}
                >
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
                        stripedRows={false} //TODO: there is problem with colors - same for selected row and stripped row fix it before turning on
                        deselectOnClickaway={false}
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
}
