import React from 'react';

import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import FontIcon from 'material-ui/FontIcon';

export default class EmployeeAdd extends React.Component {

    constructor(props) {
        super(props);
        this.services = props.services;
        this.store = props.store;

        this.state = {
            employeePublicKey: '',
            extraOptions: false,
            timeToSign: "15",
            extraOptionsNumber: ''
        }
    }

    handleExtraOptionsCheckbox = (event, isInputChecked) => {
        this.setState({extraOptions: isInputChecked});
    };

    handleAddUserButton = () => {

        const day = 24 * 60 * 60;

        let employeePublicKey = this.state.employeePublicKey;
        let issueDate = Math.floor(this.state.issueDate / 1000);
        let timeToSign = Math.floor(new Date() / 1000) + day * parseInt(this.state.timeToSign);
        let grantExtraOptions = this.state.extraOptions;
        let extraOptionsNumber = parseInt(this.state.extraOptionsNumber);

        if (!grantExtraOptions) {
            extraOptionsNumber = 0;
        }

        this.store.dispatch({
            type: "SHOW_CONFIRM_TRANSACTION_DIALOG",
            confirmTransactionDialog: true
        });

        this.services.ESOPService.addEmployee(employeePublicKey, issueDate, timeToSign, extraOptionsNumber).then(
            success => {
                this.services.ESOPService.getESOPDataFromContract();
                this.setState({
                    employeePublicKey: '',
                    issueDate: undefined,
                    extraOptions: false,
                    timeToSign: "15",
                    extraOptionsNumber: ''
                });
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
        return (
            <div className="row">
                <div className="col-xs-12 employee_add">
                    <h3>Add employee:</h3>
                    <TextField floatingLabelText="pool options for new employee" className="employee_parameter"
                               value={this.store.getState().ESOP.newEmployeePoolOption}
                               disabled={true}/>
                    <br />
                    <TextField floatingLabelText="public key" className="employee_parameter"
                               value={this.state.employeePublicKey}
                               onChange={(event, newValue) => this.setState({employeePublicKey: newValue})}
                               style={{width: "32.000rem"}}/>

                    {this.state.employeePublicKey != '' &&
                    <a target="_blank" href={`https://etherscan.io/address/${this.state.employeePublicKey}`}>
                        <FontIcon className="material-icons">link</FontIcon>
                    </a>
                    }


                    <DatePicker hintText="issue date" mode="landscape"
                                value={this.state.issueDate}
                                onChange={(event, newValue) => this.setState({issueDate: newValue})}/>
                    <TextField floatingLabelText="time to sign [days]" className="employee_parameter"
                               value={this.state.timeToSign}
                               onChange={(event, newValue) => this.setState({timeToSign: newValue})}/>
                    <Checkbox label="issue extra options" checked={this.state.extraOptions}
                              onCheck={this.handleExtraOptionsCheckbox}/>
                    <TextField floatingLabelText="extra options number" className="employee_parameter"
                               disabled={!this.state.extraOptions}
                               value={this.state.extraOptionsNumber}
                               onChange={(event, newValue) => this.setState({extraOptionsNumber: newValue})}/>
                    <br />
                    <RaisedButton label="Add employee" onClick={this.handleAddUserButton}/>
                </div>
            </div>
        )
    }
}