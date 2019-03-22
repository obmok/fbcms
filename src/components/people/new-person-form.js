import React, { Component } from 'react'
import { reduxForm, Field } from 'redux-form'
import validateEmail from 'email-validator'
import ErrorField from '../common/error-field'

class NewPersonForm extends Component {
  static propTypes = {}

  render() {
    return (
      <div className='form'>
        <h3>New User Form</h3>
        <form onSubmit={this.props.handleSubmit}>
          <Field className='field' name="firstName" label="First name" component={ErrorField} />
          <Field className='field' name="lastName" label="Last name" component={ErrorField} />
          <Field className='field' name="email" label="Email" component={ErrorField} />
          <div>
            <input type="submit" />
          </div>
        </form>
      </div>
    )
  }
}

function validate({ firstName, email }) {
  const errors = {}
  if (!firstName) errors.firstName = 'first name is required'

  if (!email) errors.email = 'email is required'
  else if (!validateEmail.validate(email)) errors.email = 'email is invalid'

  return errors
}

export default reduxForm({
  form: 'person',
  validate
})(NewPersonForm)
  
