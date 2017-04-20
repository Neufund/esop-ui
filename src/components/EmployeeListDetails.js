import React from 'react';
import './EmployeeListDetails.scss';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

export default class EmployeeListDetails extends React.Component {
    constructor(props) {
        super(props);
        this.store = props.store;
        this.services = props.services;

        let ESOPState = this.store.getState().ESOP;
        let UIState = this.store.getState().UI;

        this.employee = ESOPState.employees.find(e => e.address == UIState.selectedUser);
    }

    handleToggleSuspendButton = () => {

        let employeePublicKey = this.employee.address;
        let toggledAt = new Date() / 1000;

        this.store.dispatch({
            type: "SHOW_CONFIRM_TRANSACTION_DIALOG",
            confirmTransactionDialog: true
        });

        this.services.ESOPService.toggleEmployeeSuspension(employeePublicKey, toggledAt).then(
            success => {
                this.services.ESOPService.getESOPDataFromContract();
                this.store.dispatch({
                    type: "SHOW_CONFIRM_TRANSACTION_DIALOG",
                    confirmTransactionDialog: false
                });
            },
            error => {
                this.store.dispatch({
                    type: "SHOW_CONFIRM_TRANSACTION_DIALOG",
                    confirmTransactionDialog: false
                });

                this.store.dispatch({
                    type: "SHOW_ERROR_DIALOG",
                    errorDialog: true
                });
                console.log(error);
            }
        );
    };

    render() {
        let toggleSuspendButtonLabel = this.employee.suspendedAt == 0 ? "Suspend" : "Unsuspend";

        return (
            <div className="employee_details">
                <h3>Employee details:</h3>
                <TextField floatingLabelText="Issue date" className="employee_parameter"
                           value={this.employee.issueDate} disabled={true}/>
                <TextField floatingLabelText="Time to sign" className="employee_parameter"
                           value={this.employee.timeToSign} disabled={true}/>
                <TextField floatingLabelText="Terminated at" className="employee_parameter"
                           value={this.employee.terminatedAt} disabled={true}/>
                <TextField floatingLabelText="Fadeout starts" className="employee_parameter"
                           value={this.employee.fadeoutStarts} disabled={true}/>
                <TextField floatingLabelText="Pool options" className="employee_parameter"
                           value={this.employee.poolOptions} disabled={true}/>
                <TextField floatingLabelText="Extra options" className="employee_parameter"
                           value={this.employee.extraOptions} disabled={true}/>
                <TextField floatingLabelText="Suspened at" className="employee_parameter"
                           value={this.employee.suspendedAt} disabled={true}/>
                <TextField floatingLabelText="State" className="employee_parameter"
                           value={this.employee.state} disabled={true}/>
                <div>
                    <RaisedButton label="Terminate"/>&nbsp;&nbsp;&nbsp;&nbsp;
                    <RaisedButton label="Good will terminate"/>&nbsp;&nbsp;&nbsp;&nbsp;
                    <RaisedButton label={toggleSuspendButtonLabel} onTouchTap={this.handleToggleSuspendButton}/>
                </div>
            </div>
        )
    }
}