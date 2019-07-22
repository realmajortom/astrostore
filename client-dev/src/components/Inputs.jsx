import React from 'react';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import InputBase from '@material-ui/core/InputBase';
import Select from '@material-ui/core/Select';


const MaterialInput = withStyles(theme => ({
  root: {
    marginTop: 23
  },
  input: {
    borderRadius: 3,
    border: '1px solid #ced4da',
    fontSize: 13,
    paddingLeft: '10px',
    transition: theme.transitions.create(['border-color']),
    fontFamily: ['"Lato"', 'sans-serif'].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.1rem rgba(0,123,255,.20)',
      backgroundColor: 'transparent'
    },
  },
}))(InputBase);

const useStyles = makeStyles({
  formControl: {
    margin: 0,
    width: '90%',
    maxWidth: 288,
    minWidth: 240
  },
  label: {
    fontFamily: ['"Lato"', 'sans-serif'],
    fontSize: 20,
    color: '#415a70!important'
  },
  dropdownPaper: {
    borderRadius: 3,
  },
  dropdownList: {
    color: '#1d1d1d',
    padding: 0
  }
});


export function TextField(props) {
  const classes = useStyles();
  return (
    <FormControl classes={{root: classes.formControl}} >
      <InputLabel classes={{root: classes.label}} shrink={true}>
        {props.label}
      </InputLabel>
      <MaterialInput
        type={props.type}
        placeholder={props.placeholder}
        value={props.val}
        onChange={props.onChange}
      />
    </FormControl>
  )
}

export function Dropdown(props) {
  const classes = useStyles();
  return (
    <FormControl classes={{root: classes.formControl}} >
      <InputLabel classes={{root: classes.label}} shrink={true}>
        {props.label}
      </InputLabel>
      <Select
        value={props.value}
        onChange={props.onChange}
        input={<MaterialInput />}
        MenuProps={{transitionDuration: 50, classes: {paper: classes.dropdownPaper, list: classes.dropdownList}}}
      >
        {props.children}
      </Select>
    </FormControl>
  )
}