import React, { Component, Fragment } from 'react';
import { Redirect, NavLink, Route, Switch } from 'react-router-dom';
import './index.css';
import AdminPage from './components/routes/admin'
import AuthPage from './components/routes/auth'
import AboutPage from './components/routes/about'
import ErrorPage from './components/routes/error'
import ProtectedRoute from './components/common/protected-route'
import {connect} from 'react-redux'
import {userSelector} from './ducks/auth'
import {logOut} from './ducks/auth'

class App extends Component {
  
  handleLogOutClick = () => {
    this.props.store.dispatch(logOut())
  }
  
  get menu() {
    const signUp = !this.props.user ? <div className="links">
      <NavLink to="/auth/sign-up" activeClassName="linksActive">
        Sign Up
      </NavLink>
      </div> : undefined
    const signIn = !this.props.user ? <div className="links">
      <NavLink to="/auth/sign-in" activeClassName="linksActive">
        Sign In
      </NavLink>
      </div> : undefined
    const logOut = this.props.user ? <div className="links">
      <a href="" onClick={this.props.handlelogOut}>Log Out</a>
      </div> : undefined
    const admin = this.props.user ? <div className="links">
      <NavLink to="/admin" activeClassName="linksActive">
        Admin
      </NavLink>
      </div> : undefined
    return (
      <nav>
        <div className="links">
          <NavLink to="/about" activeClassName="linksActive">
            Home
          </NavLink>
        </div>
        {signUp}
        {signIn}
        {admin}
        {logOut}
      </nav>
    )
  }

  render() {
    return (
      <Fragment>
        {this.menu}
        <div>
          <Switch>
            <Redirect from="/" to="/about" exact />
            <ProtectedRoute path="/admin" component={AdminPage} />
            <Route path="/auth" component={AuthPage} />
            <Route path="/about" component={AboutPage} />
            <Route path="/error" component={ErrorPage} />
          </Switch>
        </div>
      </Fragment>
    )
  }
}

export default connect((state, props) => ({
  user: userSelector(state, props)
}),
(dispatch, props) => ({
  handlelogOut: (e) => {e.preventDefault(); dispatch(logOut())},
  }
))(App)
