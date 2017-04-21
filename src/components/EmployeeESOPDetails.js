import React from 'react';
import RaisedButton from 'material-ui/RaisedButton'

export default ({employee, ESOPState, exerciseHandler, denyHandler}) => {

    let beforeConversionDeadline = ESOPState.exerciseOptionsDeadline >= (new Date() / 1000);

    return (
        <div>
            <div className="row">
                <div className="col-xs-12">
                    View of employee details visible when he is logged in
                </div>
            </div>
            {(employee.state == 2 && ESOPState.esopState == 2) &&
            <div>
                {(beforeConversionDeadline) ?
                    <div>
                        <RaisedButton label="Exercise Options" onTouchTap={exerciseHandler}/>
                        <RaisedButton label="Deny Exercise Options" onTouchTap={denyHandler}/>
                    </div>
                    :
                    <div>
                        It's after conversion deadline!
                    </div>
                }
            </div>
            }
        </div>
    )
}