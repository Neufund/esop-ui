import React from 'react';
import './EmployeeDetails.scss';

import chart from '../images/esop_chart.jpg';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

export default ({store}) => {
    let userState = store.getState().user;
    return (
        <div className="employee_details">
            <h3>Employee details:</h3>
            <TextField floatingLabelText="Employee status" className="employee_parameter"
                       value="Employed" disabled={true}/>
            <TextField floatingLabelText="parameter 1" className="employee_parameter"
                       value="parameter 1 value" disabled={true}/>
            <TextField floatingLabelText="parameter 2" className="employee_parameter"
                       value="parameter 2 value" disabled={true}/>
            <TextField floatingLabelText="parameter 3" className="employee_parameter"
                       value="parameter 3 value" disabled={true}/>
            <TextField floatingLabelText="parameter 4" className="employee_parameter"
                       value="parameter 4 value" disabled={true}/>

            <img className="contract_chart" src={chart}/>
            {userState.userType == "ceo" &&
            <div>
                <RaisedButton label="Terminate"/>&nbsp;&nbsp;&nbsp;&nbsp;<RaisedButton label="Good will terminate"/>
            </div>
            }

            {userState.userType == "employee" &&
            <RaisedButton label="Convert"/>
            }
        </div>
    )
}