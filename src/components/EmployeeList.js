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

            //TODO: scroll to bottom of form -  timeout due to react render - should be done better
            window.setTimeout(() => {
                window.scrollTo(0, document.getElementById("user_list_bottom").offsetTop);
            }, 100);
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
        let numberFormatter = new Intl.NumberFormat();

        return (
            <div>
                <h3>Employee list:</h3>
                <Table onRowSelection={this.handleRowSelection}>
                    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                        <TableRow>
                            <TableHeaderColumn>Public key</TableHeaderColumn>
                            <TableHeaderColumn>Issue date</TableHeaderColumn>
                            <TableHeaderColumn>Issued options</TableHeaderColumn>
                            <TableHeaderColumn>Vested options</TableHeaderColumn>
                            <TableHeaderColumn>State</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    //TODO: there is problem with colors - same for selected row and stripped row fix it before turning on
                    <TableBody displayRowCheckbox={false} stripedRows={false} deselectOnClickaway={false}>
                        {employeeList.map((employee, index) => (
                            <TableRow key={index}>
                                <TableRowColumn><a className="inline_link" target="_blank" href={ContractUtils.formatEtherscanUrl(employee.address, ESOPState.networkId)}>
                                    <FontIcon className="material-icons material_icon_table">link</FontIcon></a>{employee.address}</TableRowColumn>
                                <TableRowColumn>{moment.unix(employee.issueDate).format(dateFormat)}</TableRowColumn>
                                <TableRowColumn>{numberFormatter.format(employee.poolOptions + employee.extraOptions)}</TableRowColumn>
                                <TableRowColumn>{numberFormatter.format(employee.vestedOptions)}</TableRowColumn>
                                <TableRowColumn>{ContractUtils.getEmployeeStateName(employee.state)}</TableRowColumn>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div id="user_list_bottom"></div>
            </div>
        )
    }
}
