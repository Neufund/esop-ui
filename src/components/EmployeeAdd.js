import React from 'react';
import './EmployeeAdd.scss';

import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';


export default class EmployeeAdd extends React.Component {

    constructor(props) {
        super(props);
        this.services = props.services;

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

        this.services.ESOPService.addEmployee(employeePublicKey, issueDate, timeToSign, extraOptionsNumber).then(
            success => {
                this.services.ESOPService.getESOPDataFromContract();
                this.setState({
                    employeePublicKey: '',
                    issueDate: undefined,
                    extraOptions: false,
                    timeToSign: "15",
                    extraOptionsNumber: ''
                })
            },
            error => {
                console.log(error);
            }
        );


    };


    render() {
        return (
            <div className="row">
                <div className="col-xs-12 employee_add">
                    <h3>Add employee:</h3>
                    <TextField floatingLabelText="public key" className="employee_parameter"
                               value={this.state.employeePublicKey}
                               onChange={(event, newValue) => this.setState({employeePublicKey: newValue})}
                               style={{width: "32.000rem"}}/>
                    <DatePicker hintText="ESOP issue date" mode="landscape"
                                value={this.state.issueDate}
                                onChange={(event, newValue) => this.setState({issueDate: newValue})}/>
                    <TextField floatingLabelText="time to sign [days]" className="employee_parameter"
                               value={this.state.timeToSign}
                               onChange={(event, newValue) => this.setState({timeToSign: newValue})}/>
                    <Checkbox label="Use extra options" checked={this.state.extraOptions}
                              onCheck={this.handleExtraOptionsCheckbox}/>
                    {
                        this.state.extraOptions &&
                        <div>
                            <TextField floatingLabelText="extra options" className="employee_parameter"
                                       value={this.state.extraOptionsNumber}
                                       onChange={(event, newValue) => this.setState({extraOptionsNumber: newValue})}/>
                        </div>
                    }

                    <RaisedButton label="Add employee" onClick={this.handleAddUserButton}/>
                </div>
            </div>
        )
    }
}