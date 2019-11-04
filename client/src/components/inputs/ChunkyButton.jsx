import React from 'react';
import './button-theme.css';
import {AwesomeButton} from "react-awesome-button";


const ChunkyButton = (props) => {
    return (
        <AwesomeButton
            type={props.type}
            size={props.size === 'medium' ? 'medium' : 'large'}
            onPress={props.onPress}
            ripple
        >
            {props.text}
        </AwesomeButton>
    );
};

export default ChunkyButton;
