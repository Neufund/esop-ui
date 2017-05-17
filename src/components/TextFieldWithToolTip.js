import React from 'react';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';

import './TextFieldWithToolTip.scss'

export default ({label, value, description}) => {

    let tooltipStyles = {
        fontSize: "1rem",
        padding: "0.5rem"
    };

    let floatingLabelStyle = {
        color: "#000"
    };

    let inputStyle = {
        color: "#000",
        width: "10rem"
    };

    let style = {
        width: "10rem"
    };

    let underlineStyle = {
        border: "0.063rem rgb(244, 244, 244) solid"
    };

    let className = "tfwtt";
    if (description === undefined) {
        className += " no_tooltip"
    }

    return (
        <div className={className}>
            <TextField floatingLabelText={label} className="text_field" disabled={true} value={value}
                       floatingLabelStyle={floatingLabelStyle}
                       inputStyle={inputStyle}
                       style={style}
                       underlineStyle={underlineStyle}
            />
            {description != undefined &&
            <IconButton iconClassName="material-icons" tooltip={description}
                        tooltipStyles={tooltipStyles}>info_outline</IconButton>
            }
        </div>
    )
}