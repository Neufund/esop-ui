import React from 'react';
import TextFieldWithToolTip from './TextFieldWithToolTip'

export default ({parameters}) => {

    let rows = parameters.reduce((table, value, index) => (index % 2 == 0 ? table.push([value]) : table[table.length - 1].push(value)) && table, []);

    return (
        <div>
            {rows.map((value, index) =>
                <div className="row" key={index}>
                    <div className="col-xs-12 col-sm-4 col-md-4 col-lg-3">
                        <TextFieldWithToolTip label={value[0].label} value={value[0].value} description={value[0].desc}/>
                    </div>
                    {value[1] != undefined &&
                    <div className="col-xs-12 col-sm-4 col-md-4 col-lg-3">
                        <TextFieldWithToolTip label={value[1].label} value={value[1].value} description={value[1].desc}/>
                    </div>
                    }
                </div>
            )}
        </div>
    )
}