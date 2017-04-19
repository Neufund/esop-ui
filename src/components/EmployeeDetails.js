import React from 'react';
import './EmployeeDetails.scss';

import EmployeeSignESOP from './EmployeeSignESOP'

import RaisedButton from 'material-ui/RaisedButton'

export default class EmployeeDetails extends React.Component {

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

    signEmployeeHandler = () => {
        this.services.ESOPService.employeeSignsToESOP();
    };

    render() {
        let userState = this.store.getState().user;
        let ESOPState = this.store.getState().ESOP;
        let UIState = this.store.getState().UI;

        let employee = ESOPState.employees.find(e => e.address == userState.userPK);

        return (
            <div>
                <div className="row">
                    <div className="col-xs-12">
                        <h2>Employee details:</h2>

                        <p>Hello {userState.userPK}</p>
                    </div>
                </div>
                {employee.state == 1 &&
                <EmployeeSignESOP employee={employee} ESOPState={ESOPState} signHandler={this.signEmployeeHandler}/>
                }
            </div>
        )
    }
}

