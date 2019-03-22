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
import { all, call, put, takeEvery, select, take, delay } from 'redux-saga/effects'
import history from '../history';

/**
 ** Constants
 ** */
export const moduleName = 'auth'
const prefix = `${appName}/${moduleName}`

export const SIGN_IN_REQUEST = `${prefix}/SIGN_IN_REQUEST`
export const SIGN_IN_START = `${prefix}/SIGN_IN_START`
export const SIGN_IN_SUCCESS = `${prefix}/SIGN_IN_SUCCESS`
export const SIGN_IN_FAIL = `${prefix}/SIGN_IN_FAIL`
export const SIGN_IN_LIMIT_REACHED = `${prefix}/SIGN_IN_LIMIT_REACHED`

export const LOG_OUT_REQUEST = `${prefix}/LOG_OUT_REQUEST`
export const LOG_OUT_START = `${prefix}/LOG_OUT_START`
export const LOG_OUT_SUCCESS = `${prefix}/LOG_OUT_SUCCESS`
export const LOG_OUT_FAIL = `${prefix}/LOG_OUT_FAIL`

export const SIGN_UP_REQUEST = `${prefix}/SIGN_UP_REQUEST`
export const SIGN_UP_START = `${prefix}/SIGN_UP_START`
export const SIGN_UP_SUCCESS = `${prefix}/SIGN_UP_SUCCESS`
export const SIGN_UP_FAIL = `${prefix}/SIGN_UP_FAIL`


/**
 ** Reducer
 ** */
export const ReducerRecord = Record({
  loading: false,
  user: null,
  error: null
})

export default function reducer(state = new ReducerRecord(), action) {
  const {type, payload, error} = action

  switch (type) {
    case SIGN_IN_START:
      return state.set('loading', true)
    case SIGN_IN_SUCCESS:
      return state.set('user', payload.user).set('loading', false)
    case SIGN_IN_FAIL:
      return state.set('error', error).set('loading', false)

    case SIGN_UP_START:
      return state.set('loading', true)
    case SIGN_UP_SUCCESS:
      return state.set('user', payload.user).set('loading', false)
    case SIGN_UP_FAIL:
      return state.set('error', error).set('loading', false)

    case LOG_OUT_START:
      return state.set('loading', true)
    case LOG_OUT_SUCCESS:
      return state.set('user', null).set('loading', false)
    case LOG_OUT_FAIL:
      return state.set('error', error).set('loading', false)
    default: 
      return state
  }
}
/**
 ** Selectors
 ** */
export const userSelector = (state) => state[moduleName].user
export const errorSelector = (state) => state[moduleName].error
export const loadingSelector = (state) => state[moduleName].loading
export const isAuthorizedSelector = createSelector(
  userSelector,
  (user) => !!user
)
 
/**
 * Action Creators
 * */

export function signIn(email, password) {
  console.log('signIn')
  return {
    type: SIGN_IN_REQUEST,
    payload: { email, password }
  }
}

export function signUp(email, password) {
  return {
    type: SIGN_UP_REQUEST,
    payload: { email, password }
  }
}

export function logOut() {
  return {
    type: LOG_OUT_REQUEST
  }
}

 /**
 * Init logic
 */

api.onAuthStateChanged((user) => {
  window.store && window.store.dispatch({
    type: SIGN_IN_SUCCESS,
    payload: { user }
  })
})

/**
 * Sagas
 **/

export function* signInSaga() {
  yield put({
    type: SIGN_IN_START
  })

  while (true) {
    for (let i = 0; i < 3; i++) { 
      const action = yield take(SIGN_IN_REQUEST)
      const { payload: { email, password } } = action
      try {
        const user = yield call(api.signIn, email, password)

        yield put({
          type: SIGN_IN_SUCCESS,
          payload: { user }
        })

        yield call(history.push,'/admin')

        i = 0
      } catch (error) {
        yield put({
          type: SIGN_IN_FAIL,
          error
        })
        yield call(history.push, '/error')
      }
    }

    yield put({
      type: SIGN_IN_LIMIT_REACHED
    })

    yield delay(3000)
  }
}

export function* logOutSaga() {
  yield put({
    type: LOG_OUT_START
  })
  try {
    yield call(api.logOut)
    yield put({
      type: LOG_OUT_SUCCESS
    })
  } catch (error) {
    yield put({
      type: LOG_OUT_FAIL,
      error
    })
    yield call( history.push, '/error')
  }
  yield call( history.push, '/auth/sign-in')
}

export function* signUpSaga({ payload: { email, password } }) {
  if (yield select(loadingSelector)) return

  yield put({
    type: SIGN_UP_START
  })

  try {
    const user = yield call(api.signUp, email, password)
    if (user){
      yield put({
        type: SIGN_UP_SUCCESS,
        payload: { user }
      })
      yield call(history.push, '/admin')
    } else 
      yield call( history.push, '/error')
  } catch (error) {
    yield put({
      type: SIGN_UP_FAIL,
      error
    })
    yield call( history.push, '/error')
  }
}

export function* saga() {
  yield all([
    takeEvery(SIGN_UP_REQUEST, signUpSaga),
    takeEvery(LOG_OUT_REQUEST, logOutSaga),
    signInSaga()
  ])
}