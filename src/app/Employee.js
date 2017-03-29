import React from 'react';
import './Employee.scss';

export default (props) => {
    console.log(props);
    return (
        <div>hi employee {props.params.publicKey != "undefined" && props.params.publicKey}</div>
    )
};