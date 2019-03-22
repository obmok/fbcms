import reducer, {
  signUpSaga,
  signInSaga,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
  SIGN_IN_REQUEST,
  SIGN_IN_START,
  SIGN_IN_SUCCESS,
  ReducerRecord,
  loadingSelector,
  SIGN_UP_START,
  SIGN_UP_FAIL
} from './auth'
import { call, put, select, take } from 'redux-saga/effects'
import api from '../services/api'

/**
 * Saga tests
 * */

it('should sign up', () => {
  const authData = {
    email: 'tim@apple.com',
    password: '12345678'
  }

  const user = {
    email: authData.email,
    uid: Math.random().toString()
  }

  const requestAction = {
    type: SIGN_UP_REQUEST,
    payload: authData
  }

  const saga = signUpSaga(requestAction)

  expect(saga.next().value).toEqual(select(loadingSelector))

  expect(saga.next(false).value).toEqual(put({ type: SIGN_UP_START }))

  expect(saga.next().value).toEqual(
    call(api.signUp, authData.email, authData.password)
  )

  expect(saga.next(user).value).toEqual(
    put({ type: SIGN_UP_SUCCESS, payload: { user } })
  )
})

it('should not sign up while request is active', () => {
  const authData = {
    email: 'tim@apple.com',
    password: '12345678'
  }

  const requestAction = {
    type: SIGN_UP_REQUEST,
    payload: authData
  }

  const saga = signUpSaga(requestAction)

  expect(saga.next().value).toEqual(select(loadingSelector))

  expect(saga.next(true).done).toBe(true)
})

it('should dispatch an error on sign up', () => {
  const authData = {
    email: 'tim@apple.com',
    password: '12345678'
  }

  const user = {
    email: authData.email,
    uid: Math.random().toString()
  }

  const requestAction = {
    type: SIGN_UP_REQUEST,
    payload: authData
  }

  const saga = signUpSaga(requestAction)

  expect(saga.next().value).toEqual(select(loadingSelector))

  expect(saga.next(false).value).toEqual(put({ type: SIGN_UP_START }))

  expect(saga.next().value).toEqual(
    call(api.signUp, authData.email, authData.password)
  )

  const error = new Error('some err')

  expect(saga.throw(error).value).toEqual(put({ type: SIGN_UP_FAIL, error }))
})

it('should sign in', () => {
  const authData = {
    email: 'tim@apple.com',
    password: '12345678'
  }

  const requestAction = {
    type: SIGN_IN_REQUEST,
    payload: authData
  }

  const saga = signInSaga({ payload: authData })
  expect(saga.next().value).toEqual(put({
    type: SIGN_IN_START
  }))
  expect(saga.next().value).toEqual(take(SIGN_IN_REQUEST))

  expect(saga.next(requestAction).value).toEqual(
    call(api.signIn, authData.email, authData.password)
  )
  const user = {};
  expect(saga.next().value).toEqual(put({
    type: SIGN_IN_SUCCESS,
    payload: user
  }))
})

/**
 * Reducer Tests
 * */

it('should sign in', () => {
  const state = new ReducerRecord()
  const user = {
    email: 'tim@apple.com',
    uid: Math.random().toString()
  }

  const newState = reducer(state, {
    type: SIGN_IN_SUCCESS,
    payload: { user }
  })

  expect(newState).toEqual(new ReducerRecord({ user }))
})