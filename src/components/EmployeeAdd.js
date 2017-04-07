import React from 'react';
import './EmployeeAdd.scss';

import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';

export default (props) => {

    return (
        <div className="row">
            <div className="col-xs-12 employee_add">
                <h3>Add employee:</h3>
                <TextField floatingLabelText="public key" className="employee_parameter"/> <br />
                <TextField floatingLabelText="started working" className="employee_parameter"/> <br />
                <TextField floatingLabelText="time to sign [days]" className="employee_parameter"/> <br />
                <Checkbox label="Use bonus shares"/>
                <TextField floatingLabelText="extra options" className="employee_parameter"/> <br />
                <RaisedButton label="Add user"/>
            </div>
        </div>
    )
}