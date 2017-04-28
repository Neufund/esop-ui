import React from 'react';

import EmployeeSignESOP from './EmployeeSignESOP'
import EmployeeESOPDetails from './EmployeeESOPDetails'
import {web3} from '../web3'
import {validateDoc}from '../utils'
import IPFSDialog from '../components/IPFSDialog';
export default class EmployeeDetails extends React.Component {

    constructor(props) {
        super(props);
        this.store = props.store;
        this.services = props.services;
        this.state = {
            showDocumentDialog:false,
            LegalDocument :'',
            IPFSHash : ''
        }
    }

    componentDidMount() {
        this.unsubscribe = this.store.subscribe(() => this.forceUpdate());
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    signEmployeeHandler = () => {
        this.store.dispatch({
            type: "SHOW_CONFIRM_TRANSACTION_DIALOG",
            confirmTransactionDialog: true
        });

        this.services.ESOPService.employeeSignsToESOP().then(
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

    timestampToDate(timestamp){
        return new Date(timestamp*1000).toDateString();
    }

    showPapelCopeyHandler = () =>{
        let userState = this.store.getState().user;
        let ESOPState = this.store.getState().ESOP;

        let employee = ESOPState.employees.find(e => e.address == userState.userPK);
        const dic ={
            'company-address' : ESOPState.companyAddress,
            'esop-sc-address' : ESOPState.ESOPAddress,
            'options-per-share' : ESOPState.optionsPerShare,
            'strike-price' : ESOPState.STRIKE_PRICE,
            'pool-options' : ESOPState.totalPoolOptions,
            'new-employee-pool-share' : ESOPState.newEmployeePoolPromille,
            'employee-address' : employee.address,
            'issued-options' : employee.extraOptions + employee.poolOptions,
            'employee-pool-options' : employee.poolOptions,
            'employee-extra-options' : employee.extraOptions,
            'issue-date' : this.timestampToDate(employee.issueDate),
            'vesting-period' : ESOPState.vestingPeriod,
            'cliff-period' : ESOPState.cliffPeriod,
            'bonus-options' : ESOPState.bonusOptionsPromille,
            'time-to-sign' : this.timestampToDate(employee.timeToSign),
            'curr-block-hash' : ESOPState.currentBlockHash
        };

        const ipfsHash = web3.toAscii(web3.toHex(web3.toBigNumber(ESOPState.ESOPLegalWrapperIPFSHash.replace(new RegExp('"',"g"),""))));
        this.setState({
            'ipfsHash' : ipfsHash
        });
        validateDoc(ipfsHash , (data) =>{
            Object.keys(dic).map((key, index)=>{
                data = data.replace(new RegExp(`{${key}}` , 'g') , dic[key])
            });

            this.setState({
                showDocumentDialog: true,
                LegalDocument:data
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

    render() {
        let userState = this.store.getState().user;
        let ESOPState = this.store.getState().ESOP;

        let employee = ESOPState.employees.find(e => e.address == userState.userPK);

        return (
            <div>

                <IPFSDialog
                    showDocumentDialog={this.state.showDocumentDialog}
                    handleDialogRequestClose={this.handleDialogRequestClose}
                    handlePrint ={this.handlePrint}
                    title="Employee Share Option Pool Conditions"
                    documentHtml={this.state.LegalDocument}
                />

                <div className="row">
                    <div className="col-xs-12">
                        <h2>Employee details:</h2>
                        <p>Hello {userState.userPK}</p>
                    </div>
                </div>
                {employee.state == 1 &&
                <EmployeeSignESOP employee={employee} ESOPState={ESOPState} signHandler={this.signEmployeeHandler}  showPapelCopeyHandler={this.showPapelCopeyHandler}/>
                }
                {employee.state > 1 &&
                <EmployeeESOPDetails employee={employee} ESOPState={ESOPState}/>
                }
            </div>
        )
    }
}

