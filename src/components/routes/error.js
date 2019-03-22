import React, { Component } from 'react'
//import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import {errorSelector} from '../../ducks/auth'

class ErrorPage extends Component {
  /*static propTypes = {

  }*/

  render() {
  const message = this.props.error ? <p>{this.props.error.message}</p> : "Unknown error"
    return (
      <div>
        <h1>Error</h1>
        {message}
      </div>
    )
  }
}

export default connect(
  (state, props) => ({
    error: errorSelector(state, props)
  }), null)(ErrorPage)