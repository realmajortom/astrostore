/* eslint-disable no-unused-vars */
import React, {useEffect} from 'react';
import {Switch, Route, BrowserRouter as Router} from 'react-router-dom';
import Landing from './components/landing/Landing';
import ShareBookmark from './components/share/ShareBookmark';
import Home from './components/home/Home';
import './dark.css';

export default function App() {

    useEffect(() => {
        if (localStorage.getItem('darkMode') === 'true') {
            document.querySelector("meta[name=theme-color]").setAttribute('content', '#121212');
        } else {
            document.querySelector("meta[name=theme-color]").setAttribute('content', '#ffffff');
        }
    })

    return (
        <div>
            <Router>
                <Switch>
                    <Route exact path="/share" component={ShareBookmark} />
                    <Route exact path='/' component={Landing} />
                    <Route exact path="/:username" component={Home} />
                </Switch>
            </Router>
        </div>
    )
}