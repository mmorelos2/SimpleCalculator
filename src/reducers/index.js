import numReducer from './numReducer';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  num: numReducer
})

export default rootReducer;