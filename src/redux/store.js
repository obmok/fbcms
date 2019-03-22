import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import reducer from './reducer'
import { routerMiddleware } from 'connected-react-router'
import history from '../history'
import createSagaMiddleware from 'redux-saga'
import rootSaga from './saga'

const sagaMiddleware = createSagaMiddleware()

const enhancer = applyMiddleware(
  thunk,
  sagaMiddleware,
  routerMiddleware(history),
  logger
)

const store = createStore(reducer, enhancer)

sagaMiddleware.run(rootSaga)

//window.store = store

export default store