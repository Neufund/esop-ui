import React from 'react';
import './Init.scss';
import {web3} from '../web3'

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

export default class Init extends React.Component {

    constructor(props) {
        super(props);
        this.store = props.store;
        this.services = props.services;

        this.state = {}
    }

    componentDidMount() {
        this.unsubscribe = this.store.subscribe(() => this.forceUpdate());
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    handleOpenEsopButton = () => {
        let optionsCalculatorAddress = this.state.OptionsCalculatorAddress;
        let employeesListAddress = this.state.EmployeesListAddress;
        let totalPoolOptions = parseInt(this.state.totalPoolOptions);
        let ESOPLegalWrapperIPFSHash = web3.toBigNumber('0x' + new Buffer(this.state.ESOPLegalWrapperIPFSHash, 'ascii').toString('hex'));
        this.services.ESOPService.openESOP(optionsCalculatorAddress, employeesListAddress, totalPoolOptions, ESOPLegalWrapperIPFSHash);
    };

    render() {
        let ESOPState = this.store.getState().ESOP;
        return (
            <div className="new_esop">
                <div className="row">
                    <div className="col-xs-12 col-md-10 col-md-offset-1">
                        <h1>New ESOP</h1>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xs-12 col-md-10 col-md-offset-1">
                        <h2>ESOP contract addresses</h2>
                        <TextField floatingLabelText="RoT contract address" value={ESOPState.RoTAddress}
                                   style={{width: "32.000rem"}} disabled={true}/> <br />
                        <TextField floatingLabelText="ESOP contract address" value={ESOPState.ESOPAddress}
                                   style={{width: "32.000rem"}} disabled={true}/> <br />
                    </div>
                </div>

                <div className="row">
                    <div className="col-xs-12 col-md-10 col-md-offset-1">
                        <h2>ESOP contract parameters</h2>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xs-12 col-md-10 col-md-offset-1">
                        <TextField floatingLabelText="OptionsCalculator contract address" style={{width: "32.000rem"}}
                                   onChange={(event, newValue) => this.setState({OptionsCalculatorAddress: newValue})}/>
                        <br />
                        <TextField floatingLabelText="EmployeesList contract address" style={{width: "32.000rem"}}
                                   onChange={(event, newValue) => this.setState({EmployeesListAddress: newValue})}/>
                        <br />
                        <TextField floatingLabelText="total pool options" className="contract_parameter"
                                   onChange={(event, newValue) => this.setState({totalPoolOptions: newValue})}/> <br />
                        <TextField floatingLabelText="ESOP Legal Wrapper IPFS Hash" style={{width: "32.000rem"}}
                                   onChange={(event, newValue) => this.setState({ESOPLegalWrapperIPFSHash: newValue})}/>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xs-12 col-md-10 col-md-offset-1 start">
                        <RaisedButton label="Start ESOP!" onClick={this.handleOpenEsopButton}/>
                    </div>
                </div>

            </div>
        )
    }
};