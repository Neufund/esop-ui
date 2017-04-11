import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import App from './app/App.js';
import './index.scss';
import 'flexboxgrid'
import {web3, externalWeb3, initWeb3} from './web3';
import LedgerLoginProvider from './ledgerLoginProvider';
import {createStore, combineReducers} from 'redux'
import {createDevTools} from 'redux-devtools'
import reducersUser from './reducers/reducersUser';
import reducersESOP from './reducers/reducersESOP';
import ContractComService from './ContractComService';
import UserManagment from './UserManagment'

(async function app() {
    injectTapEventPlugin();
    const reducer = combineReducers({
        ESOP: reducersESOP,
        user: reducersUser
    });

    const store = createStore(reducer);

    ReactDOM.render((
            <App store={store}/>
        ),
        document.getElementById('root')
    );

    let userManagment = new UserManagment(store);
    await initWeb3();

    const ESOPService = new ContractComService(store);
    ESOPService.getESOPDataFromContract();

    if (externalWeb3) {
        userManagment.getAccount()
    } else {
        LedgerLoginProvider.start();
        LedgerLoginProvider.onConnect(() => {
            LedgerLoginProvider.stop();
            userManagment.getAccount();
        });
    }

})();
