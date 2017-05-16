import React from 'react';
import './Esop.scss';

import EmployeeList from '../components/EmployeeList'
import EmployeeAdd from '../components/EmployeeAdd'
import EmployeeListDetails from '../components/EmployeeListDetails'
import EmployeeDetails from '../components/EmployeeDetails'
import ContractAddresses from '../components/ContractAddresses'
import ContractStatus from '../components/ContractStatus'
import ConversionStatus from '../components/ConversionStatus'
import ContractParameters from '../components/ContractParameters'
import ConvertOptions from '../components/ConvertOptions'

import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton'
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';

export default class Esop extends React.Component {

    constructor(props) {
        super(props);
        this.store = props.store;
        this.services = props.services;
    }

    componentDidMount() {
        this.unsubscribe = this.store.subscribe(() => this.forceUpdate());
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    handleEmployeeListClick = employee => this.store.dispatch({
        type: "SET_SELECTED_USER",
        selectedUser: employee
    });

    render() {
        let userState = this.store.getState().user;
        let ESOPState = this.store.getState().ESOP;
        let UIState = this.store.getState().UI;

        return (
            <div className="row">
                <div className="col-xs-12 col-md-10 col-md-offset-1">
                    <div className="esop">

                        <div className="row">
                            <div className="col-xs-12">
                                <h1>Neufund’s ESOP overview</h1>
                            </div>
                        </div>

                        {(userState.userType == 'employee') &&
                        <EmployeeDetails services={this.services} store={this.store}/>
                        }

                        <ContractStatus contractState={ESOPState}/>

                        {ESOPState.conversionOfferedAt != 0 &&
                        <ConversionStatus contractState={ESOPState}/>
                        }
                        <ContractAddresses RoTAddress={ESOPState.RoTAddress} ESOPAddress={ESOPState.ESOPAddress}
                                           networkId={ESOPState.networkId}/>
                        <ContractParameters contractParameters={ESOPState}/>

                        <div className="row">
                            <div className="col-xs-12">
                                <h2>Employees:</h2>
                            </div>
                        </div>

                        <EmployeeList employees={ESOPState.employees} selectedUser={UIState.selectedUser}
                                      currentBlockTimestamp={ESOPState.currentBlockTimestamp}
                                      rowSelectAction={this.handleEmployeeListClick}
                                      networkId={ESOPState.networkId}/>

                        {(UIState.selectedUser !== undefined) &&
                        <div className="row">
                            <div className="col-xs-12 ">
                                <EmployeeListDetails store={this.store} services={this.services}/>
                            </div>
                        </div>
                        }

                        {userState.userType === "ceo" &&
                        <EmployeeAdd services={this.services} store={this.store}/>
                        }

                        {(userState.userType === "ceo" && ESOPState.esopState === 1 && false) &&
                        <ConvertOptions store={this.store} services={this.services}/>
                        }
                    </div>
                </div>
            </div>
        )
    }
};