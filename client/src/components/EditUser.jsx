import React, {useState, useContext} from 'react';
import axios from 'axios';
import {HomeDispatch, Token} from './Home';
import Drawer from '@material-ui/core/Drawer';
import ChunkyButton from './ChunkyButton';
import {TextField} from './Inputs';


function EditUser(props) {
  const user = localStorage.getItem('user');
  const dispatch = useContext(HomeDispatch);
  const token = useContext(Token);

  const [newUser, setNewUser] = useState('');
  const [currentPass, setCurrentPass] = useState('');
  const [newPass1, setNewPass1] = useState('');
  const [newPass2, setNewPass2] = useState('');
  const [message, setMessage] = useState('Sup.')

  const logout = () => {
    axios.get('http://localhost:3999/user/logout',
      {headers: {Authorization: `JWT ${token}`}})
      .then(res => {
        if (res.data.success) {
          localStorage.removeItem('JWT');
          localStorage.removeItem('user');
          dispatch({type: 'redirect'})
        } else {
          setMessage('Yikes! Looks like there was an issue logging out.')
        };
      });
  };

  const updateUsername = () => {
    if (newUser.length < 3) {
      setMessage('Username must have at least 3 characters, P-A-L');
    } else if (newUser === user) {
      setMessage('That boring name again? Update. Failed.')
    } else {
      axios.post('http://localhost:3999/user/updateName',
        {newName: newUser},
        {headers: {Authorization: `JWT ${token}`}})
        .then(res => {
          if (res.data.success) {
            localStorage.setItem('user', newUser);
            setMessage(`Welcome, ${newUser}!`);
            setNewUser('');
          } else {
            setMessage(res.data.message);
            setNewUser('');
          }
        });
    };
  };

  const updatePassword = () => {
    if (newPass2.length < 5 || newPass2.length > 30) {
      setMessage('Password must be between 5 & 30 characters.')
    } else if (newPass1 !== newPass2) {
      setMessage('Passwords do not match.')
    } else if (currentPass === newPass2) {
      setMessage("Recycling is great...except with passwords! Please try again.")
    } else {
      axios.post('http://localhost:3999/user/updatePassword',
        {newPass: newPass2, currentPass: currentPass},
        {headers: {Authorization: `JWT ${token}`}})
        .then(res => {
          if (res.data.success === true) {
            localStorage.removeItem('JWT');
            localStorage.removeItem('user');
            window.alert(
              'Update successful! Please log in with your new credentials.'
            );
            dispatch({type: 'redirect'});
          } else {
            setMessage(res.data.message);
          };
        });
    };
  };

  return (
    <div>
      <Drawer
        anchor='right'
        open={props.isVis}
        onClose={() => dispatch({type: 'toggleSheet'})}
        classes={{paper: 'paper'}}
        elevation={24}
        transitionDuration={100}
      >

        <div className='userContainer'>

          <div className='welcomeHome'>Hello, {user}!</div>
          <div>{message}</div>

          <div className='userForm'>
            <TextField
              label='New Username'
              placeholder={user}
              value={newUser}
              onChange={(e) => setNewUser(e.target.value)}
            />
            <ChunkyButton
              onPress={() => updateUsername()}
              text="Update Username"
              type={'primary'}
            />
          </div>

          <div className='passForm'>
            <TextField
              type='password'
              label='Current Password'
              placeholder=''
              value={currentPass}
              onChange={(e) => setCurrentPass(e.target.value)}
            />
            <TextField
              type='password'
              label='New Password'
              placeholder=''
              value={newPass1}
              onChange={(e) => setNewPass1(e.target.value)}
            />
            <TextField
              type='password'
              label='Confirm New Password'
              placeholder=''
              value={newPass2}
              onChange={(e) => setNewPass2(e.target.value)}
            />
            <ChunkyButton
              onPress={() => updatePassword()}
              text='Update Password'
              type={'primary'}
            />
          </div>

          <div className='deleteWrapperUser'>
            <ChunkyButton
              onPress={() => logout()}
              text='Log Out'
              type={'red'}
            />
          </div>

          <div className="footer">
            <p>
              I hope you're enjoying the app! If you have any questions, comments, or issues please feel free to reach out on
                <span> <a href='https://twitter.com/tggir1' className='footerLink' rel="noopener noreferrer" target="_blank" >Twitter</a></span> or <a href='https://github.com/tggir1' className='footerLink' rel="noopener noreferrer" target="_blank" >Github</a>
            </p>
          </div>

        </div>

      </Drawer>
    </div>
  )
}


export default EditUser;