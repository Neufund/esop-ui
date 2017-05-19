import React from 'react';
import './OpenESOP.scss';
import {web3} from '../web3'

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton'

import {validateDoc}from '../utils'
import IPFSDialog from '../components/IPFSDialog';
import Texting from '../texting'
import ContractUtils from '../ContractUtils'


export default class Init extends React.Component {

    constructor(props) {
        super(props);
        this.store = props.store;
        this.services = props.services;

        this.state = {
            allowValidation: false,
            totalPoolOptions: '',
            totalPoolOptionsValidation: '',
            cliffPeriod: '',
            cliffPeriodValidation: '',
            vestingPeriod: '',
            vestingPeriodValidation: '',
            residualAmount: '',
            residualAmountValidation: '',
            bonusOptions: '',
            bonusOptionsValidation: '',
            newEmployeePool: '',
            newEmployeePoolValidation: '',
            optionsPerShare: '',
            optionsPerShareValidation: '',
            ESOPLegalWrapperIPFSHash: '',
            ESOPLegalWrapperIPFSHashValidation: '',
            LegalDocument :'',
            showDocumentDialog:false
        };
    }

    validateTotalPoolOptions = (value) => {
        let validationOutcome = value === '' ? "please fill this field" : "";

        if (validationOutcome == "") {
            let num = parseInt(value);
            if (isNaN(num))
                validationOutcome = 'value is not a number';
            else if (num < 10000)
                validationOutcome = 'value must be > 10000';
            // else if (num > 1100000)
            //    validationOutcome = 'value must be less than 100';
        }
        this.setState({totalPoolOptionsValidation: validationOutcome});
        return validationOutcome;
    };

    validateCliffPeriod = (value) => {
        let validationOutcome = value === '' ? "please fill this field" : "";

        if (validationOutcome == "") {
            let num = Number.parseInt(value);
            if (isNaN(num))
                validationOutcome = 'value is not a number';
            else if (num <= 0)
                validationOutcome = 'time period must be bigger than zero';
        }
        this.setState({cliffPeriodValidation: validationOutcome});
        return validationOutcome;
    };

    validateVestingPeriod = (value) => {
        let validationOutcome = value === '' ? "please fill this field" : "";

        if (validationOutcome == "") {
            let num = Number.parseInt(value);
            if (isNaN(num))
                validationOutcome = 'value is not a number';
            else if (num <= 0)
                validationOutcome = 'time period must be bigger than zero';
        }
        this.setState({vestingPeriodValidation: validationOutcome});
        return validationOutcome;
    };

    validateResidualAmount = (value) => {
        let validationOutcome = value === '' ? "please fill this field" : "";

        if (validationOutcome == "") {
            let num = parseInt(value);
            if (isNaN(num))
                validationOutcome = 'value is not a number';
            else if (num <= 0)
                validationOutcome = 'value must be bigger than zero';
            else if (num > 100)
                validationOutcome = 'value must be less than 100';
        }
        this.setState({residualAmountValidation: validationOutcome});
        return validationOutcome;
    };

    validateBonusOptions = (value) => {
        let validationOutcome = value === '' ? "please fill this field" : "";

        if (validationOutcome == "") {
            let num = parseInt(value);
            if (isNaN(num))
                validationOutcome = 'value is not a number';
            else if (num <= 0)
                validationOutcome = 'value must be bigger than zero';
            else if (num > 100)
                validationOutcome = 'value must be less than 100';
        }
        this.setState({bonusOptionsValidation: validationOutcome});
        return validationOutcome;
    };

    validateNewEmployeePool = (value) => {
        let validationOutcome = value === '' ? "please fill this field" : "";

        if (validationOutcome == "") {
            let num = parseInt(value);
            if (isNaN(num))
                validationOutcome = 'value is not a number';
            else if (num <= 0)
                validationOutcome = 'value must be bigger than zero';
            else if (num > 100)
                validationOutcome = 'value must be less than 100';
        }
        this.setState({newEmployeePoolValidation: validationOutcome});
        return validationOutcome;
    };

    validateOptionsPerShare = (value) => {
        let validationOutcome = value === '' ? "please fill this field" : "";

        if (validationOutcome == "") {
            let num = parseInt(value);
            if (isNaN(num))
                validationOutcome = 'value is not a number';
            else if (num <= 0)
                validationOutcome = 'value must be bigger than zero';
            else if (this.state.totalPoolOptions % value > 0)
                validationOutcome = 'should be a divisor of total pool options';
        }
        this.setState({optionsPerShareValidation: validationOutcome});
        return validationOutcome;
    };

    validatESOPLegalWrapperIPFSHash = (value) => {
        let validationOutcome = value === "" ? "please fill this field" : "";
        this.setState({ESOPLegalWrapperIPFSHashValidation: validationOutcome});
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
        let validateTotalPoolOptions = this.validateTotalPoolOptions(this.state.totalPoolOptions) == '';
        let validateCliffPeriod = this.validateCliffPeriod(this.state.cliffPeriod) == '';
        let validateVestingPeriod = this.validateVestingPeriod(this.state.vestingPeriod) == '';
        let validateResidualAmount = this.validateResidualAmount(this.state.residualAmount) == '';
        let validateBonusOptions = this.validateBonusOptions(this.state.bonusOptions) == '';
        let validateNewEmployeePool = this.validateNewEmployeePool(this.state.newEmployeePool) == '';
        let validateOptionsPerShare = this.validateOptionsPerShare(this.state.optionsPerShare) == '';
        let validatESOPLegalWrapperIPFSHash = this.validatESOPLegalWrapperIPFSHash(this.state.ESOPLegalWrapperIPFSHash) == '';

        return validateTotalPoolOptions && validateCliffPeriod && validateVestingPeriod
            && validateResidualAmount && validateBonusOptions && validateNewEmployeePool && validateOptionsPerShare
            && validatESOPLegalWrapperIPFSHash;
    };

    handleValidateDoc = () =>{
        const ESOPLegalWrapperIPFSHash = this.state.ESOPLegalWrapperIPFSHash; //QmXq9u2GPyCv8q9XCMPYtSMBe1WVAjoZidnhjX6P1SbiRt

        validateDoc(ESOPLegalWrapperIPFSHash , (data)=>{
            this.setState({
                LegalDocument:data,
                showDocumentDialog:true
            });
        });
    };

    handleDialogRequestClose=()=>{
        this.setState({
            showDocumentDialog: false,
        });
    };

    handlePrint = () =>{
        let mywindow = window.open('', 'PRINT', 'height=400,width=600');

        mywindow.document.write('<html><head><title>' + document.title  + '</title>');
        mywindow.document.write('</head><body >');
        mywindow.document.write(document.getElementById("ifmcontentstoprint").innerHTML);
        mywindow.document.write('</body></html>');

        mywindow.document.close(); // necessary for IE >= 10
        mywindow.focus(); // necessary for IE >= 10*/

        mywindow.print();
        mywindow.close();
    };

    handleOpenEsopButton = () => {

        this.setState({allowValidation: true});
        if (!this.validateFields()) {
            return;
        }
        let year = 365 * 24 * 60 * 60;

        let totalPoolOptions = parseInt(this.state.totalPoolOptions);
        let ESOPLegalWrapperIPFSHash = web3.toBigNumber('0x' + new Buffer(this.state.ESOPLegalWrapperIPFSHash, 'ascii').toString('hex'));
        let cliffPeriod = Number.parseInt(this.state.cliffPeriod) * year;
        let vestingPeriod = Number.parseInt(this.state.vestingPeriod) * year;
        let residualAmount = parseInt(this.state.residualAmount) * 100;
        let bonusOptions = parseInt(this.state.bonusOptions) * 100;
        let newEmployeePool = parseInt(this.state.newEmployeePool) * 100;
        let optionsPerShare = parseInt(this.state.optionsPerShare);

        this.store.dispatch({
            type: "SHOW_CONFIRM_TRANSACTION_DIALOG",
            confirmTransactionDialog: true
        });

        let handle_error = function (that, error) {
            that.store.dispatch({
                type: "SHOW_CONFIRM_TRANSACTION_DIALOG",
                confirmTransactionDialog: false
            });

            that.store.dispatch({
                type: "SET_ERROR_DIALOG_MSG",
                errorDialogMsg: error.toString()
            });

            that.store.dispatch({
                type: "SHOW_ERROR_DIALOG",
                errorDialog: true
            });
            console.log(error);
        };

        let ESOPState = this.store.getState().ESOP;
        let hasSetParameters = ESOPState.optionsPerShare > 0;

        this.services.ESOPService.setParametersOptional(cliffPeriod, vestingPeriod,
            residualAmount, bonusOptions, newEmployeePool, optionsPerShare, hasSetParameters).then(
            success => this.services.ESOPService.openESOP(totalPoolOptions, ESOPLegalWrapperIPFSHash).then(
                success => {
                    this.services.ESOPService.getESOPDataFromContract();
                    this.services.ESOPService.obtainContractAddresses();
                    this.store.dispatch({
                        type: "SHOW_CONFIRM_TRANSACTION_DIALOG",
                        confirmTransactionDialog: false
                    });
                },
                error => handle_error(this, error)
            ),
            error => handle_error(this, error)
        );
    };

    render() {
        let tooltipStyles = {
            fontSize: "0.8rem",
            padding: "0.4rem"
        };

        let ESOPState = this.store.getState().ESOP;
        let UIstate = this.store.getState().UI;
        let userState = this.store.getState().user;

        let textFieldsProps = {};

        textFieldsProps.totalPoolOptionsProps = {
            floatingLabelText: "total pool options",
            className: "contract_parameter",
            value: this.state.totalPoolOptions,
            onChange: this.handleTextFieldChange("totalPoolOptions", this.validateTotalPoolOptions)
        };

        textFieldsProps.cliffPeriodProps = {
            floatingLabelText: "cliff period [years]",
            className: "contract_parameter",
            value: this.state.cliffPeriod,
            onChange: this.handleTextFieldChange("cliffPeriod", this.validateCliffPeriod)
        };

        textFieldsProps.vestingPeriodProps = {
            floatingLabelText: "vesting period [years]",
            className: "contract_parameter",
            value: this.state.vestingPeriod,
            onChange: this.handleTextFieldChange("vestingPeriod", this.validateVestingPeriod)
        };

        textFieldsProps.residualAmountProps = {
            floatingLabelText: "residual amount [%]",
            className: "contract_parameter",
            value: this.state.residualAmount,
            onChange: this.handleTextFieldChange("residualAmount", this.validateResidualAmount)
        };

        textFieldsProps.bonusOptionsProps = {
            floatingLabelText: "bonus options[%]",
            className: "contract_parameter",
            value: this.state.bonusOptions,
            onChange: this.handleTextFieldChange("bonusOptions", this.validateBonusOptions)
        };

        textFieldsProps.newEmployeePoolProps = {
            floatingLabelText: "new employee % of pool [%]",
            className: "contract_parameter",
            value: this.state.newEmployeePool,
            onChange: this.handleTextFieldChange("newEmployeePool", this.validateNewEmployeePool)
        };

        textFieldsProps.optionsPerShareProps = {
            floatingLabelText: "options per share",
            className: "contract_parameter",
            value: this.state.optionsPerShare,
            onChange: this.handleTextFieldChange("optionsPerShare", this.validateOptionsPerShare)
        };

        textFieldsProps.ESOPLegalWrapperIPFSHashProps = {
            floatingLabelText: "ESOP Terms & Conditions Document IPFS Hash",
            style: {width: "32.000rem"},
            value: this.state.ESOPLegalWrapperIPFSHash,
            onChange: this.handleTextFieldChange("ESOPLegalWrapperIPFSHash", this.validatESOPLegalWrapperIPFSHash)
        };

        if (this.state.allowValidation) {
            textFieldsProps.totalPoolOptionsProps.errorText = this.state.totalPoolOptionsValidation;
            textFieldsProps.cliffPeriodProps.errorText = this.state.cliffPeriodValidation;
            textFieldsProps.vestingPeriodProps.errorText = this.state.vestingPeriodValidation;
            textFieldsProps.residualAmountProps.errorText = this.state.residualAmountValidation;
            textFieldsProps.bonusOptionsProps.errorText = this.state.bonusOptionsValidation;
            textFieldsProps.newEmployeePoolProps.errorText = this.state.newEmployeePoolValidation;
            textFieldsProps.optionsPerShareProps.errorText = this.state.optionsPerShareValidation;
            textFieldsProps.ESOPLegalWrapperIPFSHashProps.errorText = this.state.ESOPLegalWrapperIPFSHashValidation;
        }

        return (

            <div className="new_esop">
                <IPFSDialog
                    IPFSDialog={this.state.ESOPLegalWrapperIPFSHash}
                    showDocumentDialog={this.state.showDocumentDialog}
                    handleDialogRequestClose ={this.handleDialogRequestClose}
                    handlePrint ={this.handlePrint}
                    documentHtml={this.state.LegalDocument}
                />

                <div className="row">
                    <div className="col-xs-12 col-md-10 col-md-offset-1">
                        <h1>ESOP terms and conditions not set</h1>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xs-12 col-md-10 col-md-offset-1">
                        <h2>ESOP contract addresses:</h2>
                        <a target="_blank" href={ContractUtils.formatEtherscanUrl(ESOPState.RoTAddress, ESOPState.networkId)}>
                            <FontIcon className="material-icons">link</FontIcon>
                        </a>
                        <TextField floatingLabelText="Root of Trust" value={ESOPState.RoTAddress}
                                   style={{width: "32.000rem"}} disabled={true}/>

                        <br />
                        <a target="_blank" href={ContractUtils.formatEtherscanUrl(ESOPState.ESOPAddress, ESOPState.networkId)}>
                            <FontIcon className="material-icons">link</FontIcon>
                        </a>
                        <TextField floatingLabelText="ESOP smart contract" value={ESOPState.ESOPAddress}
                                   style={{width: "32.000rem"}} disabled={true}/>

                    </div>
                </div>

                {userState.userType != "ceo" ?
                    <div className="row">
                        <div className="col-xs-12 col-md-10 col-md-offset-1">
                            <h3>To set the terms & conditions of ESOP please connect company manages's account {ESOPState.companyAddress} configured during deployment process</h3>
                        </div>
                    </div>
                    :
                    <div className="contract_parameters">
                        <div className="row">
                            <div className="col-xs-12 col-md-10 col-md-offset-1">
                                <h2>Please fill ESOP parameters before employees can be added</h2>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12 col-sm-6 col-md-5 col-md-offset-1 col-lg-4">
                                <TextField {...textFieldsProps.totalPoolOptionsProps}/>
                                <IconButton tooltip={Texting.definitions.totalPoolOptions} iconClassName="material-icons" tooltipStyles={tooltipStyles}>info_outline</IconButton>
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-5 col-lg-4">
                                <TextField {...textFieldsProps.cliffPeriodProps}/>
                                <IconButton tooltip={Texting.definitions.cliffPeriod} iconClassName="material-icons" tooltipStyles={tooltipStyles}>info_outline</IconButton>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12 col-sm-6 col-md-5 col-md-offset-1 col-lg-4">
                                    <TextField {...textFieldsProps.vestingPeriodProps}/>
                                    <IconButton tooltip={Texting.definitions.vestingPeriod} iconClassName="material-icons" tooltipStyles={tooltipStyles}>info_outline</IconButton>
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-5 col-lg-4">
                                    <TextField {...textFieldsProps.residualAmountProps}/>
                                    <IconButton tooltip={Texting.definitions.residualAmount} iconClassName="material-icons" tooltipStyles={tooltipStyles}>info_outline</IconButton>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12 col-sm-6 col-md-5 col-md-offset-1 col-lg-4">
                                    <TextField {...textFieldsProps.bonusOptionsProps}/>
                                    <IconButton tooltip={Texting.definitions.bonusOptions} iconClassName="material-icons" tooltipStyles={tooltipStyles}>info_outline</IconButton>
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-5 col-lg-4">
                                    <TextField {...textFieldsProps.newEmployeePoolProps}/>
                                    <IconButton tooltip={Texting.definitions.newEmployeePool} iconClassName="material-icons" tooltipStyles={tooltipStyles}>info_outline</IconButton>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12 col-sm-6 col-md-5 col-md-offset-1 col-lg-4">
                                <TextField {...textFieldsProps.optionsPerShareProps}/>
                                <IconButton tooltip={Texting.definitions.optionsPerShare} iconClassName="material-icons" tooltipStyles={tooltipStyles}>info_outline</IconButton>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12 col-md-10 col-md-offset-1">
                                <TextField {...textFieldsProps.ESOPLegalWrapperIPFSHashProps}/>
                                <IconButton tooltip={Texting.definitions.termsDocIPFSHash} iconClassName="material-icons" tooltipStyles={tooltipStyles}>info_outline</IconButton>
                                <RaisedButton label="preview document" className="preview_button"
                                              onTouchTap={this.handleValidateDoc} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12 col-md-10 col-md-offset-1">
                                <br/>
                                <a href="https://github.com/Neufund/ESOP#esop-algorithm" target="_new">Read more on configuring ESOP Terms & Conditions</a>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12 col-md-10 col-md-offset-1">
                                <RaisedButton label="Initialize ESOP" onClick={this.handleOpenEsopButton}
                                              className="start_button"/>
                            </div>
                        </div>
                    </div>
                }
            </div>
        )
    }
};