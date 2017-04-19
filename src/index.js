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
import reducersUI from './reducers/reducersUI';

import ContractComService from './ContractComService';
import UserManagment from './UserManagment'

(async function app() {
    injectTapEventPlugin();
    const reducer = combineReducers({
        ESOP: reducersESOP,
        user: reducersUser,
        UI: reducersUI
    });

    const store = createStore(reducer);
    const services = {};

    ReactDOM.render((
            <App store={store} services={services}/>
        ),
        document.getElementById('root')
    );

    await initWeb3();
    services.userManagment = new UserManagment(store);
    services.ESOPService = new ContractComService(store);
    await services.ESOPService.obtainContractAddreses();
    services.ESOPService.getESOPDataFromContract();

    if (externalWeb3) {
        services.userManagment.getAccount()
    } else {
        LedgerLoginProvider.start();
        LedgerLoginProvider.onConnect(() => {
            LedgerLoginProvider.stop();
            store.dispatch({
                type: "SHOW_NANO_CONFIRM_ACCOUNT_DIALOG",
                nanoConfirmAccountDialog: true
            });
            services.userManagment.getAccount().then(() => store.dispatch({
                type: "SHOW_NANO_CONFIRM_ACCOUNT_DIALOG",
                nanoConfirmAccountDialog: false
            }));
        });
    }

})();
