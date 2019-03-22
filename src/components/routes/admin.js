import React, { Component } from 'react'
//import PropTypes from 'prop-types'
import { Route, NavLink } from 'react-router-dom'
import PersonPage from './person-page'

class AdminPage extends Component {
  /*static propTypes = {

  }*/

  render() {
    return (
      <div>
        <h1>Admin Page</h1>
        <div className="links">
          <ul className="list">
            <li>
              <NavLink to="/admin/people" activeClassName="linksActive">
                People
              </NavLink>
            </li>
          </ul>
        </div>  
        <Route path="/admin/people" component={PersonPage} />
      </div>
    )
  }
}

export default AdminPage