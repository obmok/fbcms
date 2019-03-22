import React, { Component } from 'react'
import { connect } from 'react-redux'
import { peopleSelector, fetchAllPeople, loadingSelector  } from '../../ducks/people'
import Loader from '../common/loader'

class PeopleList extends Component {
  static propTypes = {}

  render() {
    if (this.props.loading) return <Loader />
    return (
      <div className='list'>
        <table><tbody>
          {this.props.people.map((person) => (
            <tr className="person" key={person.id}><td>{person.firstName}</td><td>{person.lastName}</td><td>{person.email}</td></tr>
          ))}
        </tbody></table>
      </div>
    )
  }
}

export default connect(
  (state) => ({
    people: peopleSelector(state),
    loading: loadingSelector(state)
  }),
  { fetchAllPeople }
)(PeopleList)