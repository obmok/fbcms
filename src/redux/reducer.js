import {combineReducers} from 'redux';
import { connectRouter } from 'connected-react-router';
import history from '../history';
import {reducer as form} from 'redux-form';
import authReducer, { moduleName as authModule } from '../ducks/auth';
import peopleReducer, { moduleName as peopleModule } from '../ducks/people';

export default combineReducers({
  form,
  router: connectRouter(history),
  [authModule]: authReducer,
  [peopleModule]: peopleReducer
})