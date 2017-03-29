import "babel-polyfill";
import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route} from 'react-router';
import history from './history';
import App from './app/App.js';
import Index from './app/Index.js';
import './index.scss';
import 'flexboxgrid'
import {createStore, combineReducers, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import {createDevTools} from 'redux-devtools'
import {routerReducer, routerMiddleware, syncHistoryWithStore} from 'react-router-redux'
import reducers from './reducers';

(function app() {
    // Build the middleware for intercepting and dispatching navigation actions
    const middleware = routerMiddleware(history);

    // Configure reducer to store state at state.router
    // You can store it elsewhere by specifying a custom `routerStateSelector`
    // in the store enhancer below
    const reducer = combineReducers({
        ...reducers,
        routing: routerReducer
    });

    const store = createStore(reducer, applyMiddleware(middleware));

    const syncedHistory = syncHistoryWithStore(history, store);

    ReactDOM.render((
            <Provider store={store}>
                <Router history={syncedHistory}>
                    <Route component={App}>
                        <Route path="/" component={Index}/>
                    </Route>
                </Router>
            </Provider>
        ),
        document.getElementById('root')
    );
})();
