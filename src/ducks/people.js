import { appName } from '../config'
import { Record, OrderedMap } from 'immutable'
import {
  put,
  call,
  all,
  takeEvery,
  fork,
  take
} from 'redux-saga/effects'
import { eventChannel } from 'redux-saga'
import { reset } from 'redux-form'
import { createSelector } from 'reselect'
import { fbToEntities } from '../services/util'
import api from '../services/api'

/**
 * Constants
 * */
export const moduleName = 'people'
const prefix = `${appName}/${moduleName}`
export const ADD_PERSON_REQUEST = `${prefix}/ADD_PERSON_REQUEST`
export const ADD_PERSON_START = `${prefix}/ADD_PERSON_START`
export const ADD_PERSON_SUCCESS = `${prefix}/ADD_PERSON_SUCCESS`

export const FETCH_ALL_REQUEST = `${prefix}/FETCH_ALL_REQUEST`
export const FETCH_ALL_START = `${prefix}/FETCH_ALL_START`
export const FETCH_ALL_SUCCESS = `${prefix}/FETCH_ALL_SUCCESS`
export const REALTIME_FETCH_ALL_SUCCESS = `${prefix}/REALTIME_FETCH_ALL_SUCCESS`

export const DELETE_PERSON_REQUEST = `${prefix}/DELETE_PERSON_REQUEST`
export const DELETE_PERSON_SUCCESS = `${prefix}/DELETE_PERSON_SUCCESS`

/**
 * Reducer
 * */
const ReducerState = Record({
  entities: new OrderedMap({}),
  loading: false
})

const PersonRecord = Record({
  id: null,
  firstName: null,
  lastName: null,
  email: null
})

export default function reducer(state = new ReducerState(), action) {
  const { type, payload } = action

  switch (type) {
    case ADD_PERSON_SUCCESS:
      return state.setIn(['entities', payload.id], new PersonRecord(payload))

    case FETCH_ALL_START:
      return state.set('loading', true)

    case REALTIME_FETCH_ALL_SUCCESS:
    case FETCH_ALL_SUCCESS:
      return state.set('entities', fbToEntities(payload, PersonRecord)).set('loading', false)

    case DELETE_PERSON_SUCCESS:
      return state.deleteIn(['entities', payload.id])

    default:
      return state
  }
}
/**
 * Selectors
 * */

export const stateSelector = (state) => state[moduleName]
export const peopleSelector = createSelector(
  stateSelector,
  (state) => state.entities.valueSeq().toArray()
)
export const idSelector = (_, props) => props.id

export const loadingSelector = createSelector(
  stateSelector,
  (state) => state.loading
)

//export const loadingSelector = (state) => state.loading

export const personSelector = createSelector(
  stateSelector,
  idSelector,
  (state, id) => state.getIn(['entities', id])
)

export const peopleByIdsSelector = (state, ids) =>
  ids.map((id) => stateSelector(state).getIn(['entities', id])).filter(Boolean)

/**
 * Action Creators
 * */
export const addPerson = (person) => ({
  type: ADD_PERSON_REQUEST,
  payload: { person }
})

export function fetchAllPeople() {
  return {
    type: FETCH_ALL_REQUEST
  }
}

export function deletePerson(id) {
  return {
    type: DELETE_PERSON_REQUEST,
    payload: { id }
  }
}

/**
 * Sagas
 **/

export function* addPersonSaga(action) {
  yield put({
    type: ADD_PERSON_START,
    payload: { ...action.payload.person }
  })

  const resp = yield call(api.addPerson, action.payload.person)
  const key = resp ? resp.key : undefined

  yield put({
    type: ADD_PERSON_SUCCESS,
    payload: { id: key, ...action.payload.person }
  })

  yield put(reset('person'))
}

export function* fetchAllSaga() {
  yield put({
    type: FETCH_ALL_START
  })

  const data = yield call(api.loadAllPeople)

  yield put({
    type: FETCH_ALL_SUCCESS,
    payload: data
  })
}

export function* deletePersonSaga({ payload }) {
  yield call(api.deletePerson, payload.id)

  yield put({
    type: DELETE_PERSON_SUCCESS,
    payload
  })
}

export const createPeopleChanel = () =>
  eventChannel((emit) => api.peopleSubscription((data) => emit({ data })))

export function* realtimePeopleSyncSaga() {
  yield put({
    type: FETCH_ALL_START
  })
  
  const chanel = yield call(createPeopleChanel)

  while (true) {
    const { data } = yield take(chanel)

    yield put({
      type: REALTIME_FETCH_ALL_SUCCESS,
      payload: data
    })
  }
}

export function* saga() {
  yield fork(realtimePeopleSyncSaga)
  yield all([
    takeEvery(ADD_PERSON_REQUEST, addPersonSaga),
    takeEvery(FETCH_ALL_REQUEST, fetchAllSaga),
    takeEvery(DELETE_PERSON_REQUEST, deletePersonSaga)
  ])
}