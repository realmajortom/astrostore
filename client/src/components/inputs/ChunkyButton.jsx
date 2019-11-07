import React from 'react';
import './button-theme.css';
import {AwesomeButton} from "react-awesome-button";


const ChunkyButton = (props) => {
    return (
        <div className={props.locale === 'nav' ? '' : 'btnWrapper'}>
            <AwesomeButton
                type={props.type}
                size={props.size === 'medium' ? 'medium' : 'large'}
                onPress={props.onPress}
                ripple
            >
                {props.text}
            </AwesomeButton>
        </div>
    );
};

export default ChunkyButton;
