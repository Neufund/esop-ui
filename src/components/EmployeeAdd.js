import React from 'react';
import './EmployeeAdd.scss';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import FontIcon from 'material-ui/FontIcon';
import ContractUtils from '../ContractUtils'

export default class EmployeeAdd extends React.Component {

    constructor(props) {
        super(props);
        this.services = props.services;
        this.store = props.store;

        this.miniSignPeriod = Math.floor(this.store.getState().ESOP.MINIMUM_MANUAL_SIGN_PERIOD / this.day) + 1;

        this.state = {
            showForm: false,
            allowValidation: false,
            employeePublicKey: "",
            employeePublicKeyValidation: "",
            issueDate: new Date(),
            extraOptions: false,
            timeToSign: this.miniSignPeriod.toString(),
            timeToSignValidation: "",
            extraOptionsNumber: "",
            extraOptionsNumberValidation: ""
        }
    }

    day = 24 * 60 * 60;

    validatePublicKey = (value) => {
        let validationOutcome = value === '' ? "please fill this field" : "";
        this.setState({employeePublicKeyValidation: validationOutcome});
        return validationOutcome;
    };

    validateTimeToSign = (value) => {
        let validationOutcome = value === '' ? "please fill this field" : "";

        if (validationOutcome == "") {
            let num = parseInt(value);
            if (isNaN(num))
                validationOutcome = 'value is not a number';
            else if (num < this.miniSignPeriod)
                validationOutcome = `value must be bigger than ${this.miniSignPeriod - 1}`;
        }
        this.setState({timeToSignValidation: validationOutcome});
        return validationOutcome;
    };

    validateExtraOptions = (value) => {

        if (!this.state.extraOptions) // we do not validate if extra options checkbox is not checked
            return "";

        let validationOutcome = value === '' ? "please fill this field" : "";

        if (validationOutcome == "") {
            let num = parseInt(value);
            if (isNaN(num))
                validationOutcome = 'value is not a number';
            else if (num <= 0)
                validationOutcome = 'value must be bigger than zero';
        }
        this.setState({extraOptionsNumberValidation: validationOutcome});
        return validationOutcome;
    };

    handleTextFieldChange = (fieldName, validateFunction) =>
        (event, newValue) => {
            let obj = {};
            obj[fieldName] = newValue;
            this.setState(obj);
            if (this.state.allowValidation) {
                validateFunction(newValue);
            }
        };

    validateFields = () => {
        let validateEmployeePublicKey = this.validatePublicKey(this.state.employeePublicKey) == "";
        let validateTimeToSign = this.validateTimeToSign(this.state.timeToSign) == "";
        let validateExtraOptionsNumber = this.validateExtraOptions(this.state.extraOptionsNumber) == "";

        return validateEmployeePublicKey && validateTimeToSign && validateExtraOptionsNumber
    };

    handleExtraOptionsCheckbox = (event, isInputChecked) => {
        this.setState({extraOptions: isInputChecked});
    };

    handleAddUserButton = () => {

        this.setState({allowValidation: true});
        if (!this.validateFields()) {
            return;
        }

        let employeePublicKey = this.state.employeePublicKey;
        let issueDate = Math.floor(this.state.issueDate / 1000);
        let timeToSign = Math.floor(new Date() / 1000) + this.day * parseInt(this.state.timeToSign);
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
                    issueDate: new Date(),
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
                    type: "SET_ERROR_DIALOG_MSG",
                    errorDialogMsg: error.toString()
                });

                this.store.dispatch({
                    type: "SHOW_ERROR_DIALOG",
                    errorDialog: true
                });
                console.log(error);
            }
        );
    };

    handleAddEmployeeButton = () => {
        this.setState({showForm: true});
        //TODO: scroll to form -  timeout due to react render - should be done better
        window.setTimeout(() => {
            window.scrollTo(0, document.getElementById("add_employee_form").offsetTop);
        }, 100);
    };

    render() {
        let numberFormatter = new Intl.NumberFormat();

        let textFieldsProps = {};

        let ESOPState = this.store.getState().ESOP;

        textFieldsProps.employeePublicKey = {
            floatingLabelText: "employees' public address",
            className: "employee_parameter",
            value: this.state.employeePublicKey,
            onChange: this.handleTextFieldChange("employeePublicKey", this.validatePublicKey),
            style: {width: "32.000rem"}
        };

        textFieldsProps.timeToSign = {
            floatingLabelText: "time to sign [days]",
            className: "employee_parameter",
            value: this.state.timeToSign,
            onChange: this.handleTextFieldChange("timeToSign", this.validateTimeToSign)
        };

        textFieldsProps.extraOptionsNumber = {
            floatingLabelText: "extra options number",
            className: "employee_parameter",
            value: this.state.extraOptionsNumber,
            onChange: this.handleTextFieldChange("extraOptionsNumber", this.validateExtraOptions),
            disabled: !this.state.extraOptions
        };

        textFieldsProps.poolOptionsNumber = {
            floatingLabelText: "estimated pool options",
            className: "employee_parameter",
            disabled: true,
            value: numberFormatter.format(this.store.getState().ESOP.newEmployeePoolOption)
        };

        if (this.state.allowValidation) {
            textFieldsProps.employeePublicKey.errorText = this.state.employeePublicKeyValidation;
            textFieldsProps.timeToSign.errorText = this.state.timeToSignValidation;
            textFieldsProps.extraOptionsNumber.errorText = this.state.extraOptionsNumberValidation;
        }

        return (
            <div className="row">
                <div className="col-xs-12 employee_add">
                    {!this.state.showForm &&
                    <RaisedButton className="add_employee_button" label="Add employee" onClick={this.handleAddEmployeeButton}/>
                    }

                    {this.state.showForm &&
                    <div id="add_employee_form">
                        <h3>Offer options to employee:</h3>

                        {this.state.employeePublicKey != '' &&
                        <a className="etherscan_link" target="_blank" href={ContractUtils.formatEtherscanUrl(this.state.employeePublicKey, ESOPState.networkId)}>
                            <FontIcon className="material-icons">link</FontIcon>
                        </a>
                        }
                        <TextField {...textFieldsProps.employeePublicKey}/>

                        <DatePicker hintText="issue date" mode="landscape"
                                    value={this.state.issueDate}
                                    floatingLabelText="issue date"
                                    onChange={(event, newValue) => this.setState({issueDate: newValue})}/>

                        <TextField {...textFieldsProps.timeToSign}/>

                        <Checkbox label="issue extra options instead of pool options" checked={this.state.extraOptions}
                                  onCheck={this.handleExtraOptionsCheckbox}/>

                        {this.state.extraOptions ?
                            <TextField {...textFieldsProps.extraOptionsNumber}/>
                            :
                            <TextField {...textFieldsProps.poolOptionsNumber}/>
                        }

                        <br />
                        <RaisedButton label="Offer options" onClick={this.handleAddUserButton}/>
                    </div>
                    }
                </div>
            </div>
        )
    }
}