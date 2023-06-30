import {combineReducers, applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';

import { ProductReducer } from './Components/Reducers/ProductReducers'
const reducer = combineReducers({
    product: ProductReducer
})

let initialState = {};
const middleware = [thunk];

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));
export default store;