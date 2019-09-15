/* eslint-disable no-unused-vars */
import React from 'react';
import {Switch, Route, BrowserRouter as Router} from 'react-router-dom';
import Landing from './components/landing/Landing';
import ShareBookmark from './components/share/ShareBookmark';
import Home from './components/home/Home';
import './dark.css';

const App = () => (
    <div className={localStorage.getItem('darkMode' ? 'darkApp' : null)}>
        <Router>
            <Switch>
	            <Route exact path="/share" component={ShareBookmark}/>
                <Route exact path='/' component={Landing}/>
                <Route exact path="/:username" component={Home}/>
            </Switch>
        </Router>
    </div>
);

export default App;