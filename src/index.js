import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import App from './app/App.js';
import './index.scss';
import 'flexboxgrid'
import web3 from './web3';
import LedgerLoginProvider from './ledgerLoginProvider';
import {createStore, combineReducers} from 'redux'
import {createDevTools} from 'redux-devtools'
import reducersUser from './reducers/reducersUser';
import reducersESOP from './reducers/reducersESOP';
import ContractComService from './ContractComService';

(async function app() {
    await web3.initWeb3();
    LedgerLoginProvider.start();
    LedgerLoginProvider.onConnect(() => {
        window.web3.eth.getAccounts(console.log);
    });
    injectTapEventPlugin();

    const reducer = combineReducers({
        ESOP: reducersESOP,
        user: reducersUser
    });

    const store = createStore(reducer);

    const ESOPService = new ContractComService(store);
    ESOPService.getESOPDataFromContract();

    ReactDOM.render((
            <App store={store}/>
        ),
        document.getElementById('root')
    );
})();
