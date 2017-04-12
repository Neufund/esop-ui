import React from 'react';
import './Init.scss';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

export default class Init extends React.Component {

    constructor(props) {
        super(props);
        this.store = props.store;
    }

    componentDidMount() {
        this.unsubscribe = this.store.subscribe(() => this.forceUpdate());
    }

    componentWillUnmount() {
        this.unsubscribe();
    }


    render() {
        let ESOPState = this.store.getState().ESOP;
        return (
            <div className="new_esop">
                <div className="row">
                    <div className="col-xs-12">
                        <h1>New ESOP</h1>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xs-12">
                        <h2>ESOP contract addresses</h2>
                        <TextField floatingLabelText="RoT contract address" value={ESOPState.RoTAddress}
                                   style={{width: "32.000rem"}}
                                   disabled={true}/> <br />
                        <TextField floatingLabelText="ESOP contract address" value={ESOPState.ESOPAddress}
                                   style={{width: "32.000rem"}}
                                   disabled={true}/> <br />
                        <TextField floatingLabelText="OptionsCalculator contract address"
                                   value={ESOPState.OptionsCalculatorAddress}
                                   style={{width: "32.000rem"}} disabled={true}/> <br />
                        <TextField floatingLabelText="EmployeesList contract address" value={ESOPState.EmployeesList}
                                   style={{width: "32.000rem"}} disabled={true}/>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xs-12">
                        <h2>ESOP contract parameters</h2>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xs-12">
                        <TextField floatingLabelText="total pool options" className="contract_parameter"/> <br />
                        <TextField floatingLabelText="ESOP Legal Wrapper IPFS Hash" style={{width: "32.000rem"}}/>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xs-12 start">
                        <RaisedButton label="Start ESOP!"
                                      onClick={() => alert("This will start ESOP you will see nice spinner and after some time will be redirected to public view of contract")}/>
                    </div>
                </div>

            </div>
        )
    }
};