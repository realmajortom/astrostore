import React from 'react';
import {Redirect} from 'react-router-dom';
import {ReactComponent as Logo} from '../../astronaut.svg';
import Register from './Register';
import Login from './Login';
import Nav from '../home/Nav';


function Landing() {

    const user = localStorage.getItem('user');

    const token = localStorage.getItem('JWT');

    if (user == null || token == null) {

        return (

            <div className='appContainer'>

                <Nav local='navLanding'>
	                <Register/>
	                <Login/>
                </Nav>

                <Logo className="astronaut"/>

            </div>
        );

    } else {
        return <Redirect to={`/${user}`}/>;
    }
}

export default Landing;