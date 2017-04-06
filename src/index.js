import "babel-polyfill";
import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRedirect} from 'react-router';

import injectTapEventPlugin from 'react-tap-event-plugin';

import history from './history';
import App from './app/App.js';
import Esop from './app/Esop.js';
import Init from './app/Init.js';

import './index.scss';
import 'flexboxgrid'
import {createStore, combineReducers, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import {createDevTools} from 'redux-devtools'
import {routerReducer, routerMiddleware, syncHistoryWithStore} from 'react-router-redux'
import reducersUser from './reducers/reducersUser';
import reducersESOP from './reducers/reducersESOP';

import ContractComService from './ContractComService';

injectTapEventPlugin();

// Build the middleware for intercepting and dispatching navigation actions
const middleware = routerMiddleware(history);

// Configure reducer to store state at state.router
// You can store it elsewhere by specifying a custom `routerStateSelector`
// in the store enhancer below
const reducer = combineReducers({
    ESOP: reducersESOP,
    user: reducersUser,
    routing: routerReducer
});

const store = createStore(reducer, applyMiddleware(middleware));
const syncedHistory = syncHistoryWithStore(history, store);

const ESOPService = new ContractComService(store);
ESOPService.getESOPDataFromContract();

ReactDOM.render((
        <Provider store={store}>
            <Router history={syncedHistory}>
                <Route path="/" component={App} store={store}>
                    <IndexRedirect to="/esop"/>
                    <Route path="/init" component={Init}/>
                    <Route path="/esop" component={Esop} store={store}/>
                </Route>
            </Router>
        </Provider>
    ),
    document.getElementById('root')
);
