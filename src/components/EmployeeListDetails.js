import React from 'react';
import './EmployeeListDetails.scss';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import ContractUtils from '../ContractUtils'
import moment from 'moment'

export default class EmployeeListDetails extends React.Component {
    constructor(props) {
        super(props);
        this.store = props.store;
        this.services = props.services;

        this.state = {
            terminateDate: new Date()
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

                    this.store.dispatch({
                        type: "SET_SELECTED_USER",
                        selectedUser: undefined
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
    };

    render() {
        let userState = this.store.getState().user;
        let ESOPState = this.store.getState().ESOP;
        let UIState = this.store.getState().UI;
        let employee = ESOPState.employees.find(e => e.address == UIState.selectedUser);
        let toggleSuspendButtonLabel = employee.suspendedAt == 0 ? "Suspend" : "Unsuspend";

        let showSuspendButton = employee.state == 1 || employee.state == 2; // WaitingForSignature or Employed
        let showTerminateButtons = employee.state < 3; // not Terminated  and not OptionsExercised

        let dateFormat = 'YY-MM-DD'; //TODO: this should go to configuration
        let todayUnixTime = new Date() / 1000;

        let showTimeToSign = false;
        let timeToSignValue;


        if(employee.state < 2) { // 0: Not set; 1: Waiting for signature
            showTimeToSign = true;

            if (employee.timeToSign > todayUnixTime) {
                timeToSignValue = moment.unix(employee.timeToSign).format(dateFormat);
            } else {
                timeToSignValue = "expired"
            }
        }
        return (
            <div className="employee_details">
                <h3>Employee details:</h3>

                <p>
                    Employee address: {employee.address}
                </p>
                <div>
                    <RaisedButton label="Show agreement"/>
                </div>

                <TextField floatingLabelText="Issue date" className="employee_parameter"
                           value={moment.unix(employee.issueDate).format(dateFormat)} disabled={true}/>

                {showTimeToSign &&
                <TextField floatingLabelText="Time to sign" className="employee_parameter" value={timeToSignValue}
                           disabled={true}/>
                }

                {employee.terminatedAt != 0 &&
                    <TextField floatingLabelText="Terminated at" className="employee_parameter"
                               value={moment.unix(employee.terminatedAt).format(dateFormat)} disabled={true}/>
                }

                <TextField floatingLabelText="Pool options" className="employee_parameter"
                           value={employee.poolOptions} disabled={true}/>

                <TextField floatingLabelText="Extra options" className="employee_parameter"
                           value={employee.extraOptions} disabled={true}/>

                {employee.suspendedAt != 0 &&
                <TextField floatingLabelText="Suspened at" className="employee_parameter"
                           value={moment.unix(employee.suspendedAt).format(dateFormat)} disabled={true}/>
                }

                <TextField floatingLabelText="State" className="employee_parameter"
                           value={ContractUtils.getEmployeeStateName(employee.state)} disabled={true}/>
                <br />
                {userState.userType == "ceo" &&
                    <div>
                        {showSuspendButton &&
                        <RaisedButton className="suspendButton" label={toggleSuspendButtonLabel} onTouchTap={this.handleToggleSuspendButton}/>
                        }
                        {showTerminateButtons &&
                        <div>
                            <DatePicker hintText="Terminate date" mode="landscape" className="date_picker"
                                        value={this.state.terminateDate}
                                        onChange={(event, newValue) => this.setState({terminateDate: newValue})}/>
                            <RaisedButton label="Bad Leaver" onTouchTap={this.handleTerminateUserButton("BadLeaver")}/>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <RaisedButton label="Terminate" onTouchTap={this.handleTerminateUserButton("Regular")}/>
                        </div>
                        }
                    </div>
                }
            </div>
        )
    }
}