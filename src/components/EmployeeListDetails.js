import React from 'react';
import './EmployeeListDetails.scss';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';

export default class EmployeeListDetails extends React.Component {
    constructor(props) {
        super(props);
        this.store = props.store;
        this.services = props.services;

        this.state = {
            terminateDate: new Date
        };
    }

    componentDidMount() {
        this.unsubscribe = this.store.subscribe(() => this.forceUpdate());
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    handleToggleSuspendButton = () => {

        let ESOPState = this.store.getState().ESOP;
        let UIState = this.store.getState().UI;
        let employee = ESOPState.employees.find(e => e.address == UIState.selectedUser);
        let employeePublicKey = employee.address;
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

    /**
     *
     * @param terminationType 0 - Regular, 1 - BadLeaver
     * @returns {function()}
     */
    handleTerminateUserButton = (terminationType) => {

        let ESOPState = this.store.getState().ESOP;
        let UIState = this.store.getState().UI;
        let employee = ESOPState.employees.find(e => e.address == UIState.selectedUser);

        let tType;
        if (terminationType === "Regular") {
            tType = 0;
        } else if (terminationType === "BadLeaver") {
            tType = 1;
        }

        let terminatedAt = Math.floor(this.state.terminateDate / 1000);

        return () => {
            this.store.dispatch({
                type: "SHOW_CONFIRM_TRANSACTION_DIALOG",
                confirmTransactionDialog: true
            });

            this.services.ESOPService.terminateEmployee(employee.address, terminatedAt, tType).then(
                success => {
                    this.services.ESOPService.getESOPDataFromContract();
                    this.store.dispatch({
                        type: "SHOW_CONFIRM_TRANSACTION_DIALOG",
                        confirmTransactionDialog: false
                    });
                    this.setState({terminateDate: undefined});
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
    };

    render() {
        let ESOPState = this.store.getState().ESOP;
        let UIState = this.store.getState().UI;
        let employee = ESOPState.employees.find(e => e.address == UIState.selectedUser);
        let toggleSuspendButtonLabel = employee.suspendedAt == 0 ? "Suspend" : "Unsuspend";

        let showSuspendButton = employee.state == 1 || employee.state == 2; // WaitingForSignature or Employed
        let showTerminateButtons = employee.state < 3; // not Terminated  and not OptionsExercised

        return (
            <div className="employee_details">
                <h3>Employee details:</h3>
                <TextField floatingLabelText="Issue date" className="employee_parameter"
                           value={employee.issueDate} disabled={true}/>
                <TextField floatingLabelText="Time to sign" className="employee_parameter"
                           value={employee.timeToSign} disabled={true}/>
                <TextField floatingLabelText="Terminated at" className="employee_parameter"
                           value={employee.terminatedAt} disabled={true}/>
                <TextField floatingLabelText="Fadeout starts" className="employee_parameter"
                           value={employee.fadeoutStarts} disabled={true}/>
                <TextField floatingLabelText="Pool options" className="employee_parameter"
                           value={employee.poolOptions} disabled={true}/>
                <TextField floatingLabelText="Extra options" className="employee_parameter"
                           value={employee.extraOptions} disabled={true}/>
                <TextField floatingLabelText="Suspened at" className="employee_parameter"
                           value={employee.suspendedAt} disabled={true}/>
                <TextField floatingLabelText="State" className="employee_parameter"
                           value={employee.state} disabled={true}/>
                <br />
                {showSuspendButton &&
                <RaisedButton label={toggleSuspendButtonLabel} onTouchTap={this.handleToggleSuspendButton}/>
                }
                {showTerminateButtons &&
                <div>
                    <DatePicker hintText="Terminate date" mode="landscape"
                                onChange={(event, newValue) => this.setState({terminateDate: newValue})}/>
                    <RaisedButton label="Terminate"
                                  onTouchTap={this.handleTerminateUserButton("BadLeaver")}/>&nbsp;&nbsp;&nbsp;&nbsp;
                    <RaisedButton label="Good will terminate"
                                  onTouchTap={this.handleTerminateUserButton("Regular")}/>
                </div>
                }
            </div>
        )
    }
}