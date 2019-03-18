/*
Ducks:
MUST export default a function called reducer()
MUST export its action creators as functions
MUST have action types in the form npm-module-or-app/reducer/ACTION_TYPE
MAY export its action types as UPPER_SNAKE_CASE, if an external reducer needs to listen for them, or if it is a published reusable library
*/
import {appName} from '../config'
import {Record} from 'immutable'
import { createSelector } from 'reselect'
import api from '../services/api'

/**
 ** Constants
 ** */
export const moduleName = 'auth'
const prefix = `${appName}/${moduleName}`

export const SIGN_IN_SUCCESS = `${prefix}/SIGN_IN_SUCCESS`
export const SIGN_UP_SUCCESS = `${prefix}/SIGN_UP_SUCCESS`

/**
 ** Reducer
 ** */
export const ReducerRecord = Record({
  user: null
})

export default function reducer(state = new ReducerRecord(), action) {
  const {type, payload} = action

  switch (type) {
    case SIGN_IN_SUCCESS:
    case SIGN_UP_SUCCESS:
        return state.set('user', payload.user)
    default: 
      return state
  }
}
/**
 ** Selectors
 ** */
export const userSelector = (state) => state[moduleName].user
export const isAuthorizedSelector = createSelector(
  userSelector,
  (user) => !!user
)
 
/**
 * Action Creators
 * */

export function signIn(email, password) {
  return (dispatch) =>
  api.signIn(email, password).then((user) =>
    dispatch({
      type: SIGN_IN_SUCCESS,
      payload: { user }
    })
  )
}

export function signUp(email, password) {
  return (dispatch) =>
  api.signUp(email, password).then((user) =>
    dispatch({
      type: SIGN_UP_SUCCESS,
      payload: { user }
    })
  )
} 

 /**
 * Init logic
 */

api.onAuthStateChanged((user) => {
  window.store.dispatch({
    type: SIGN_IN_SUCCESS,
    payload: { user }
  })
})