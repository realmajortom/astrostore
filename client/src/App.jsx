import React from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import Landing from './components/Landing';
import Login from './components/Login';
import Home from './components/Home';

const App = () => (
  <div className="App">
    <Router>
      <Switch>
        <Route exact path='/' component={Landing} />
        <Route exact path='/login' component={Login} />
        <Route exact path="/:username" component={Home} />
      </Switch>
    </Router>
  </div>
);

export default App;