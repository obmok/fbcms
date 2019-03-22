import React, { Component } from 'react'
import {reduxForm, Field} from 'redux-form'
//import PropTypes from 'prop-types'
import ErrorField from '../common/error-field' 

class SignInForm extends Component {
  /*static propTypes = {

  }*/

  render() {
    const { handleSubmit } = this.props
    return (
      <div className='form'>
        <h3>Sign In Form</h3>
        <form onSubmit={handleSubmit}>
          <Field name='email' className='field' component={ErrorField} label = 'Email:' />
          <Field name='password' className='field' component={ErrorField} label = 'Password:' type='password'/>
          <button className='control' >Sign In</button>
        </form>
      </div>
    )
  }
}

export default reduxForm({
  form: 'auth'
})(SignInForm)