import React, {useState} from 'react';
import {Redirect} from 'react-router-dom';
import axios from 'axios/index';
import Dialog from '@material-ui/core/Dialog/index';
import ChunkyButton from '../inputs/ChunkyButton';
import {TextField} from '../inputs/MaterialInputs';


function Register() {

    const [vis, setVis] = useState(false);
    const [success, setSuccess] = useState(false);
    const [message, setMessage] = useState('');
    const [user, setUser] = useState('');
    const [pass1, setPass1] = useState('');
    const [pass2, setPass2] = useState('');


    const register = () => {

        if (user === '' || pass2 === '') {

            setMessage('Please enter a username and password');

        } else if (pass1 !== pass2) {

            setMessage("Passwords don't match");

        } else {

            axios.post('https://astrostore.io/api/user/register',

                {username: user, password: pass2}).then(res => {

                if (res.data.success === true) {
                    localStorage.setItem('JWT', res.data.token);
                    localStorage.setItem('user', user);
                    setSuccess(true);

                } else {
                    setMessage(res.data.message);
                }

            });
        }
    };

    if (success !== true) {

        return (

            <div>

                <ChunkyButton onPress={() => setVis(true)} text={'Register'} type={'secondary'}/>

                <Dialog open={vis}
                        onClose={() => setVis(false)}
                        classes={{paper: "modalBody"}}
                        aria-labelledby="Registration Form"
                        elevation={24}
                        onKeyPress={(e) => e.charCode === 13 && register()}
                        transitionDuration={250}>

                    <div className="modalHeader">Register</div>

                    <div className="modalMessage">{message}</div>

                    <div className='fieldWrapper'>

                        <TextField label='Username'
                                   placeholder=''
                                   value={user}
                                   onChange={(e) => setUser(e.target.value)}/>

                        <TextField type='password'
                                   label='Password'
                                   placeholder=''
                                   value={pass1}
                                   onChange={(e) => setPass1(e.target.value)}/>

                        <TextField type='password'
                                   label='Confirm Password'
                                   placeholder=''
                                   value={pass2}
                                   onChange={(e) => setPass2(e.target.value)}/>

                    </div>

                    <div className='submitWrapper'>

                        <ChunkyButton onPress={register} text={'Submit'} type={'primary'}/>

                    </div>

                </Dialog>

            </div>
        );
    } else {
	    return <Redirect to={`/${user}`}/>;
    }
}

export default Register;