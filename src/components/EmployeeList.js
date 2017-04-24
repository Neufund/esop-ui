import React from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import FontIcon from 'material-ui/FontIcon';
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
                            <TableHeaderColumn>Issued options</TableHeaderColumn>
                            <TableHeaderColumn>State</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    //TODO: there is problem with colors - same for selected row and stripped row fix it before turning on
                    <TableBody displayRowCheckbox={false} stripedRows={false} deselectOnClickaway={false}>
                        {employeeList.map((employee, index) => (
                            <TableRow key={index}>
                                <TableRowColumn><a className="inline_link" target="_blank" href={`https://etherscan.io/address/${employee.address}`}>
                                    <FontIcon className="material-icons material_icon_table">link</FontIcon></a>{employee.address}</TableRowColumn>
                                <TableRowColumn>{moment.unix(employee.issueDate).format(dateFormat)}</TableRowColumn>
                                <TableRowColumn>{employee.poolOptions + employee.extraOptions}</TableRowColumn>
                                <TableRowColumn>{ContractUtils.getEmployeeStateName(employee.state)}</TableRowColumn>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        )
    }
}
