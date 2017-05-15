import React from 'react';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';

import './TextFieldWithToolTip.scss'

export default ({label, value, description}) => {

    let tooltipStyles = {
        fontSize: "1rem",
        padding: "0.5rem"
    };

    let className = "tfwtt";
    if (description === undefined) {
        className += " no_tooltip"
    }

    return (
        <div className={className}>
            <TextField floatingLabelText={label} className="text_field" disabled={true} value={value}/>
            {description != undefined &&
                <IconButton iconClassName="material-icons" tooltip={description}
                            tooltipStyles={tooltipStyles}>info_outline</IconButton>
            }
        </div>
    )
}