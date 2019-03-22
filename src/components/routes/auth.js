import React, { Component } from 'react'
//import PropTypes from 'prop-types'
import SignInForm from '../auth/sign-in-form'
import {Route} from 'react-router-dom'
import SignUpForm from '../auth/sign-up-form'
import {connect} from 'react-redux'
import {signIn, signUp} from '../../ducks/auth'

class AuthPage extends Component {
  /*static propTypes = {

  }*/

  render() {
    return (
      <div>
        <h1>Auth Page</h1>
        <Route path='/auth/sign-in' render = {() => <SignInForm onSubmit = {this.handleSignIn}/>} />
        <Route path='/auth/sign-up' render = {() => <SignUpForm onSubmit = {this.handleSignUp}/>} />
      </div>
    )
  }

  handleSignIn = ({ email, password }) => this.props.signIn(email, password)
  handleSignUp = ({ email, password }) => this.props.signUp(email, password)
}

export default connect(null, { signIn, signUp})(AuthPage)