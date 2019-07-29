import React from 'react';
import {AwesomeButton as Button} from "react-awesome-button";
import "./button-theme.css";


const ChunkyButton = (props) => {
    return (
        <Button type={props.type}
                size={props.size === 'medium' ? 'medium' : 'large'}
                onPress={props.onPress} ripple>
            {props.text}
        </Button>
    );
};

export default ChunkyButton;
