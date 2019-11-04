import React from 'react';
import Login from './Login';
import Nav from '../home/Nav';
import Register from './Register';
import {Redirect} from 'react-router-dom';
import {ReactComponent as Logo} from './astronaut.svg';


function Landing() {

    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (user == null || token == null) {
        return (
            <div className='appContainer'>
                <Nav local='navLanding'>
                    <Register />
                    <Login />
                </Nav>
                <Logo className="astronaut" />
            </div>
        );
    } else {
        return <Redirect to={`/${user}`} />;
    }
}

export default Landing;