import React, {useState, useContext} from 'react';
import axios from 'axios/index';
import {HomeDispatch, Token, DarkMode} from './Home';
import Drawer from '@material-ui/core/Drawer/index';
import ChunkyButton from '../inputs/ChunkyButton';
import {TextField} from '../inputs/MaterialInputs';
import Toggle from 'react-toggle'
import "react-toggle/style.css"
import Moon from './Moon';
import Sun from './Sun';
import Reorder from './Reorder'

function EditUser(props) {
    const token = useContext(Token);
    const darkMode = useContext(DarkMode);
    const user = localStorage.getItem('user');
    const dispatch = useContext(HomeDispatch);

    const [message, setMessage] = useState('');
    const [newUser, setNewUser] = useState('');
    const [newPass1, setNewPass1] = useState('');
    const [newPass2, setNewPass2] = useState('');
    const [collEdit, setCollEdit] = useState(false);
    const [currentPass, setCurrentPass] = useState('');


    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch({type: 'redirect'});
    };


    const updateUsername = () => {
        if (newUser.length < 3) {
            setMessage('Username must have at least 3 characters, P-A-L');
        } else if (newUser === user) {
            setMessage('That boring name again? Update. Failed.');
        } else {
            axios.post('https://astrostore.io/api/user/updateName',
                {newName: newUser},
                {headers: {Authorization: `JWT ${token}`}}).then(res => {
                    if (res.data.success) {
                        localStorage.setItem('user', newUser);
                        setMessage(`Welcome, ${newUser}!`);
                        setNewUser('');
                    } else {
                        setMessage(res.data.message);
                        setNewUser('');
                    }
                });
        }
    };


    const updatePassword = () => {
        if (newPass2.length < 5 || newPass2.length > 30) {
            setMessage('Password must have between 5 & 30 characters.');
        } else if (newPass1 !== newPass2) {
            setMessage('Passwords do not match.');
        } else if (currentPass === newPass2) {
            setMessage("Recycling is great...except with passwords! Please try again.");
        } else {
            axios.post('https://astrostore.io/api/user/updatePassword',
                {newPass: newPass2, currentPass: currentPass},
                {headers: {Authorization: `JWT ${token}`}}).then(res => {
                    if (res.data.success === true) {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        window.alert('Update successful! Please log in with your new credentials.');
                        dispatch({type: 'redirect'});
                    } else {
                        setMessage(res.data.message);
                    }
                });
        }
    };


    return (
        <div>
            <Drawer
                anchor='right'
                open={props.vis}
                onClose={() => dispatch({type: 'toggleSheet'})}
                classes={{paper: 'paper ' + (darkMode && 'darkDialog')}}
                elevation={24}
                transitionDuration={250}
            >

                <div className='userContainer'>

                    <div className={'welcomeHome ' + (darkMode && 'darkBook')}>Hello, {user}!</div>

                    <div className='toggleContainer'>
                        <Toggle
                            className='toggleCustom'
                            icons={{
                                checked: <Sun />,
                                unchecked: <Moon />
                            }}
                            defaultChecked={darkMode}
                            onChange={() => dispatch({type: 'toggleDark'})}
                        />
                    </div>

                    <button onClick={() => setCollEdit(true)} className={'reorderSaveBtn ' + (darkMode && 'darkReorderBtn')}>Rearrange Collections</button>

                    <Reorder vis={collEdit} collections={props.collections} close={() => setCollEdit(false)} />

                    <div className={(message !== '' && 'userMessage ') + (darkMode && 'darkText')}>{message}</div>

                    <form className={'userForm ' + (darkMode && 'darkUserForm')}>
                        <TextField
                            label='New Username'
                            placeholder={user}
                            value={newUser}
                            onChange={(e) => setNewUser(e.target.value)}
                            dark={darkMode}
                        />
                        <ChunkyButton
                            onPress={() => updateUsername()}
                            text="Update Username"
                            type={darkMode ? 'primaryDark' : 'primary'}
                        />
                    </form>


                    <form className={'passForm ' + (darkMode && 'darkUserForm')}>
                        <TextField
                            autocomplete='current-password'
                            type='password'
                            label='Current Password'
                            placeholder=''
                            value={currentPass}
                            onChange={(e) => setCurrentPass(e.target.value)}
                            dark={darkMode}
                        />

                        <TextField
                            autocomplete='new-password'
                            type='password'
                            label='New Password'
                            placeholder=''
                            value={newPass1}
                            onChange={(e) => setNewPass1(e.target.value)}
                            dark={darkMode}
                        />

                        <TextField
                            autocomplete='new-password'
                            type='password'
                            label='Confirm New Password'
                            placeholder=''
                            value={newPass2}
                            onChange={(e) => setNewPass2(e.target.value)}
                            dark={darkMode}
                        />

                        <ChunkyButton
                            onPress={() => updatePassword()}
                            text='Update Password'
                            type={darkMode ? 'primaryDark' : 'primary'}
                        />

                    </form>


                    <div className={'deleteWrapperUser ' + (darkMode && 'darkUserForm')}>
                        <ChunkyButton
                            onPress={() => logout()}
                            text='Log Out'
                            type={darkMode ? 'redDark' : 'red'} />
                    </div>

                    <div className="footer">
                        <p><a
                            className={'footerLink ' + (darkMode && 'darkLink')}
                            rel='noopener noreferrer'
                            target='_blank'
                            href='https://addons.mozilla.org/en-US/firefox/addon/astrostore/'>
                            Firefox Extension
		                    </a>
                        </p>

                        <p><a
                            className={'footerLink ' + (darkMode && 'darkLink')}
                            rel='noopener noreferrer'
                            target='_blank'
                            href='https://chrome.google.com/webstore/detail/astrostore-quick-add/papafaajgpnblabjapiibkhdfjaghnhg'>
                            Chrome Extension
                            </a>
                        </p>

                        <p><a
                            className={'footerLink ' + (darkMode && 'darkLink')}
                            rel='noopener noreferrer'
                            target='_blank'
                            href='https://github.com/tggir1/astrostore'>
                            View Source Code on Github
                            </a>
                        </p>

                        <p className={darkMode ? 'darkText' : null}>
                            I hope you're enjoying the app! If you have any questions, comments, or issues please feel free to reach out on
                            <span> </span>
                            <a
                                href='https://twitter.com/tggir1'
                                className={'footerLink ' + (darkMode && 'darkLink')}
                                rel="noopener noreferrer"
                                target="_blank">
                                Twitter
                            </a>
                            <span> </span>
                            or
                            <span> </span>
                            <a
                                href='https://github.com/tggir1'
                                className={'footerLink ' + (darkMode && 'darkLink')}
                                rel="noopener noreferrer"
                                target="_blank">
                                Github
                            </a>.
                        </p>
                    </div>
                </div>
            </Drawer>
        </div>
    );
}


export default EditUser;