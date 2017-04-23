import React from 'react';
import './Waiting.scss';

import RefreshIndicator from 'material-ui/RefreshIndicator';

export default () => {
    return (
        <div className="waitingForData">
            <div className="row">
                <div className="col-xs-12 col-md-10 col-md-offset-1">
                    <h2>Obtaining data from smart contract - this might take a while</h2>
                </div>
            </div>
            <div className="row">
                <div className="col-xs-12 col-md-10 col-md-offset-1">
                    <RefreshIndicator
                        size={40}
                        left={0}
                        top={0}
                        status="loading"
                        style={{
                            position: "relative",
                            "marginLeft": "auto",
                            "marginRight": "auto"
                        }}
                    />
                </div>
            </div>
        </div>
    )
}