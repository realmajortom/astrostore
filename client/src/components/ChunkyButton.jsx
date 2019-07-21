import React from 'react';
import { AwesomeButton as Button } from "react-awesome-button";
import "./theme/button-theme.css"


const ChunkyButton = (props) => {
  return (
    <Button
      type={props.type}
      size='large'
      onPress={props.onPress}
      ripple
    >
      {props.text}
    </Button>
  );
}

export default ChunkyButton;
