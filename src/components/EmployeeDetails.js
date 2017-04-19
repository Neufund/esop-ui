import React from 'react';
import './EmployeeDetails.scss';

import chart from '../images/esop_chart.jpg';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

export default ({selectedUser, store}) => {
    let userState = store.getState().user;
    let ESOPState = store.getState().ESOP;

    let employee = ESOPState.employees.find(e => e.address == selectedUser);
    console.log(employee);

    return (
        <div className="employee_details">
            <h3>Employee details:</h3>
            <div>{employee.address}</div>
            <TextField floatingLabelText="Issue date" className="employee_parameter"
                       value={employee.issueDate} disabled={true}/>
            <TextField floatingLabelText="Time to sign" className="employee_parameter"
                       value={employee.timeToSign} disabled={true}/>
            <TextField floatingLabelText="Terminated at" className="employee_parameter"
                       value={employee.terminatedAt} disabled={true}/>
            <TextField floatingLabelText="Fadeout starts" className="employee_parameter"
                       value={employee.fadeoutStarts} disabled={true}/>
            <TextField floatingLabelText="Pool options" className="employee_parameter"
                       value={employee.poolOptions} disabled={true}/>
            <TextField floatingLabelText="Extra options" className="employee_parameter"
                       value={employee.extraOptions} disabled={true}/>
            <TextField floatingLabelText="Suspened at" className="employee_parameter"
                       value={employee.suspendedAt} disabled={true}/>
            <TextField floatingLabelText="State" className="employee_parameter"
                       value={employee.state} disabled={true}/>

            <img className="contract_chart" src={chart}/>
            {userState.userType == "ceo" &&
            <div>
                <RaisedButton label="Terminate"/>&nbsp;&nbsp;&nbsp;&nbsp;
                <RaisedButton label="Good will terminate"/>&nbsp;&nbsp;&nbsp;&nbsp;
                <RaisedButton label="Suspend"/>
            </div>
            }

            {userState.userType == "employee" &&
            <RaisedButton label="Convert"/>
            }
        </div>
    )
}