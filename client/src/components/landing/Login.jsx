import React, {useState} from 'react';
import {Redirect} from 'react-router-dom';
import axios from 'axios/index';
import Dialog from '@material-ui/core/Dialog/index';
import ChunkyButton from '../inputs/ChunkyButton';
import {TextField} from '../inputs/MaterialInputs';


function Login() {

    const [vis, setVis] = useState(false);
    const [success, setSuccess] = useState(false);
    const [message, setMessage] = useState('');
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');


    const loginUser = () => {
        if (user === '' || pass === '') {
            setMessage('Please enter username & password');
        } else {
            axios.post('https://astrostore.io/api/user/login',
                {username: user, password: pass}).then(res => {
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


    if (success === true) {
        return <Redirect to={`/${user}`}/>;
    } else {
        return (
            <div>
                <ChunkyButton onPress={() => setVis(true)} text={'Login'}
                              type={'secondary'}/>

                <Dialog open={vis} onClose={() => setVis(false)}
                        classes={{paper: 'modalBody modalMedium'}}
                        aria-labelledby="Login Form" elevation={24}
                        onKeyPress={(e) => e.charCode === 13 && loginUser()}
                        transitionDuration={250}>

                    <div className='modalHeader'>Login</div>
                    <div className='modalMessage'>{message}</div>

                    <div className='fieldWrapper'>
                        <TextField label='Username' placeholder='REALHUMAN1'
                                   value={user}
                                   onChange={(e) => setUser(e.target.value)}/>

                        <TextField type='password' label='Password'
                                   placeholder='ROBOTS_UNITE' value={pass}
                                   onChange={(e) => setPass(e.target.value)}/>
                    </div>

                    <div className='submitWrapper'>
                        <ChunkyButton onPress={() => loginUser()}
                                      text={'Beam Me Up'} type={'primary'}/>
                    </div>

                </Dialog>
            </div>
        );
    }
}

export default Login;