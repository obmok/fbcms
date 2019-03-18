import React, { Component, Fragment } from 'react';
import { NavLink, Route } from 'react-router-dom';
import './App.css';
import AdminPage from './components/routes/admin'
import AuthPage from './components/routes/auth'


class App extends Component {
  render() {
    return (
      <Fragment>
        <div>
          <NavLink to = "/auth/sign-up">Sign Up</NavLink>
        </div>
        <div>
          <NavLink to = "/auth/sign-in">Sign In</NavLink>
        </div>
        <div>
          <NavLink to = "/admin">Admin</NavLink>
        </div>
        <div>
          <Route path = "/admin" component = {AdminPage}/>
          <Route path = "/auth" component = {AuthPage}/>
        </div>
      </Fragment>
    )
  }
}

export default App;
