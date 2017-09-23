import { applyMiddleware, createStore, combineReducers } from "redux";
import { routerMiddleware, routerReducer } from 'react-router-redux'
import { history } from './history'

// import { logger } from "redux-logger";
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";

import reducers from "./reducers";
// add these for testing: logger
let middleware = applyMiddleware(routerMiddleware(history), promise(), thunk);

export default createStore(
    combineReducers(Object.assign({}, reducers, {router: routerReducer})),
    middleware);
