import React from 'react';
import {AwesomeButton} from "react-awesome-button";
import './button-theme.css';


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
