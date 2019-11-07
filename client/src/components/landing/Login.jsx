import axios from 'axios/index';
import React, {useState} from 'react';
import {Redirect} from 'react-router-dom';
import ChunkyButton from '../inputs/ChunkyButton';
import {TextField} from '../inputs/MaterialInputs';
import Dialog from '@material-ui/core/Dialog/index';


function Login() {

    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [vis, setVis] = useState(false);
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);

    const loginUser = () => {
        if (user === '' || pass === '') {
            setMessage('Please enter username & password');
        } else {
            axios.post('https://astrostore.io/api/user/login',
                {username: user, password: pass}).then(res => {
                    if (res.data.success === true) {
                        localStorage.setItem('token', res.data.token);
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
                <ChunkyButton onPress={() => setVis(true)} text={'Login'} type={'secondary'} />

                <Dialog open={vis}
                    onClose={() => setVis(false)}
                    classes={{paper: 'modalBody modalMedium'}}
                    aria-labelledby="Login Form"
                    elevation={24}
                    onKeyPress={(e) => e.charCode === 13 && loginUser()}
                    transitionDuration={250}>

                    <div className='modalHeader'>Login</div>

                    {message.length > 0 && <div className='modalMessage'>{message}</div>}

                    <form>
                        <TextField
                            autocomplete='username'
                            label='Username'
                            placeholder=''
                            value={user}
                            onChange={(e) => setUser(e.target.value)} />

                        <TextField
                            autocomplete='current-password'
                            type='password'
                            label='Password'
                            placeholder=''
                            svalue={pass}
                            onChange={(e) => setPass(e.target.value)} />
                    </form>

                    <div className='submitWrapper'>
                        <ChunkyButton onPress={() => loginUser()} text={'Submit'} type={'primary'} />
                    </div>
                </Dialog>
            </div>
        );
    } else {
        return <Redirect to={`/${user}`} />;
    }
}

export default Login;