import React from 'react';

import EmployeeSignESOP from './EmployeeSignESOP'
import {web3} from '../web3'
import {validateDoc, epochAsYears}from '../utils'
import IPFSDialog from '../components/IPFSDialog';
import Config from '../config'

import moment from 'moment'

export default class EmployeeDetails extends React.Component {

    constructor(props) {
        super(props);
        this.store = props.store;
        this.services = props.services;
        this.state = {
            showDocumentDialog: false,
            LegalDocument: '',
            IPFSHash: ''
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

    showPaperCopyHandler = () => {
        let userState = this.store.getState().user;
        let ESOPState = this.store.getState().ESOP;
        let employee = ESOPState.employees.find(e => e.address == userState.userPK);
        let numberFormatter = new Intl.NumberFormat();

        const dic = {
            'company-address': ESOPState.companyAddress,
            'esop-sc-address': ESOPState.ESOPAddress,
            'options-per-share': numberFormatter.format(ESOPState.optionsPerShare),
            'strike-price': ESOPState.STRIKE_PRICE,
            'pool-options': numberFormatter.format(ESOPState.totalPoolOptions),
            'new-employee-pool-share': (ESOPState.newEmployeePoolPromille / 100) + '%',
            'employee-address': employee.address,
            'issued-options': numberFormatter.format(employee.extraOptions + employee.poolOptions),
            'employee-pool-options': numberFormatter.format(employee.poolOptions),
            'employee-extra-options': numberFormatter.format(employee.extraOptions),
            'issue-date': moment.unix(employee.issueDate).format(Config.dateFormat),
            'vesting-period': epochAsYears(ESOPState.vestingPeriod),
            'cliff-period': epochAsYears(ESOPState.cliffPeriod),
            'bonus-options': (ESOPState.bonusOptionsPromille / 100) + '%',
            'time-to-sign': moment.unix(employee.timeToSign).format(Config.dateFormat),
            'curr-block-hash': ESOPState.currentBlockHash,
            'residual-amount': (ESOPState.residualAmountPromille / 100) + '%'
        };

        const ipfsHash = web3.toAscii(web3.toHex(web3.toBigNumber(ESOPState.ESOPLegalWrapperIPFSHash.replace(new RegExp('"', "g"), ""))));
        this.setState({
            'ipfsHash': ipfsHash
        });
        validateDoc(ipfsHash, (data) => {
            Object.keys(dic).map((key, index) => {
                data = data.replace(new RegExp(`{${key}}`, 'g'), dic[key])
            });

            this.setState({
                showDocumentDialog: true,
                LegalDocument: data
            });
        });

    };

    handleDialogRequestClose = () => {
        this.setState({
            showDocumentDialog: false,
        });
    };

    handlePrint = () => {
        let mywindow = window.open('', 'PRINT', 'height=400,width=600');

        mywindow.document.write('<html><head><title>' + document.title + '</title>');
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
                    handlePrint={this.handlePrint}
                    documentHtml={this.state.LegalDocument}
                />
                {employee.state == 1 &&
                <EmployeeSignESOP employee={employee} ESOPState={ESOPState} signHandler={this.signEmployeeHandler}
                                  showPaperCopyHandler={this.showPaperCopyHandler}/>
                }
            </div>
        )
    }
}

