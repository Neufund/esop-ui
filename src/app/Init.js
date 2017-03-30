import React from 'react';
import './Init.scss';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

export default () => {
    return (
        <div className="new_esop">
            <div className="row">
                <div className="col-xs-12">
                    <h1>New ESOP</h1>
                </div>
            </div>

            <div className="row">
                <div className="col-xs-12">
                    <h2>ESOP contract address</h2>
                    <TextField floatingLabelText="ESOP contract address" style={{width: "32.000rem"}}/>
                </div>
            </div>

            <div className="row">
                <div className="col-xs-12">
                    <h2>ESOP contract parameters</h2>
                </div>
            </div>

            <div className="row">
                <div className="col-xs-12 contract_parameters">
                    <TextField floatingLabelText="cliff duration" className="contract_parameter"/>
                    <TextField floatingLabelText="vesting duration" className="contract_parameter"/>
                    <TextField floatingLabelText="max fadeout promille" className="contract_parameter"/>
                    <TextField floatingLabelText="exit bonus promille" className="contract_parameter"/>
                    <TextField floatingLabelText="new employee pool promille" className="contract_parameter"/>
                    <TextField floatingLabelText="total options" className="contract_parameter"/>
                </div>
            </div>

            <div className="row">
                <div className="col-xs-12">
                    <h2>ESOP paper agreement</h2>
                </div>
            </div>

            <div className="row">
                <div className="col-xs-12 contract_data">
                    <TextField floatingLabelText="IPFS hash" style={{width: "32.000rem"}}/> <span className="or">OR</span>
                    <RaisedButton label="Upload contract"/> &nbsp;&nbsp; - we re not sure how we gonna implement it yet
                </div>
            </div>

            <div className="row">
                <div className="col-xs-12 start">
                    <RaisedButton label="Start ESOP!" onClick={() => alert("This will start ESOP you will see nice spinner and after some time will be redirected to public view of contract")} />
                </div>
            </div>

        </div>
    )
};