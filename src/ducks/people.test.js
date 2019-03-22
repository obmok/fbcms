import { call, put } from 'redux-saga/effects'
import { reset } from 'redux-form'
import { addPersonSaga, addPerson, ADD_PERSON_START, ADD_PERSON_SUCCESS, FETCH_ALL_SUCCESS, FETCH_ALL_START, fetchAllPeople, fetchAllSaga } from './people'
import api from '../services/api'

describe('People Duck', () => {
  it('should add a person', () => {
    const person = {
      firstName: 'Tim',
      lastName: 'Apple',
      email: 'tim@apple.com'
    }
    const action = addPerson(person)
    const addPersonProcess = addPersonSaga(action)
    expect(addPersonProcess.next().value).toEqual(
      put({
        type: ADD_PERSON_START,
        payload: {
          ...person
        }
      })
    )
    expect(addPersonProcess.next().value).toEqual(call(api.addPerson, person))
    expect(addPersonProcess.next().value).toEqual(
      put({
        type: ADD_PERSON_SUCCESS,
        payload: {
           ...person
        }
      })
    )
    expect(addPersonProcess.next().value).toEqual(put(reset('person')))
    expect(addPersonProcess.next().done).toEqual(true)
  })

  it('should fetch data', () => {
    const action = fetchAllPeople()
    const fetchAllProcess = fetchAllSaga(action)

    expect(fetchAllProcess.next().value).toEqual(put({
      type: FETCH_ALL_START
    }))

    expect(fetchAllProcess.next().value).toEqual(call(api.loadAllPeople))

    expect(fetchAllProcess.next().value).toEqual(put({
      type: FETCH_ALL_SUCCESS
    }))
  })
})