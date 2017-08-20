import React from 'react';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';

import './TextFieldWithToolTip.scss';

export default ({ label, value, description }) => {
  const tooltipStyles = {
    fontSize: '1rem',
    padding: '0.5rem',
  };

  const floatingLabelStyle = {
    color: '#000',
  };

  const inputStyle = {
    color: '#000',
    width: '10rem',
  };

  const style = {
    width: '10rem',
  };

  const underlineStyle = {
    border: '0.063rem rgb(244, 244, 244) solid',
  };

  let className = 'tfwtt';
  if (description === undefined) {
    className += ' no_tooltip';
  }

  return (
    <div className={className}>
      <TextField
        floatingLabelText={label}
        className="text_field"
        disabled
        value={value}
        floatingLabelStyle={floatingLabelStyle}
        inputStyle={inputStyle}
        style={style}
        underlineStyle={underlineStyle}
      />
      {description !== undefined &&
        <IconButton
          iconClassName="material-icons"
          tooltip={description}
          tooltipStyles={tooltipStyles}
        >info_outline</IconButton>
      }
    </div>
  );
};
