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

import platform from 'platform';

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

    try {
        await initWeb3();
        services.userManagment = new UserManagment(store);
        services.ESOPService = new ContractComService(store);
        await services.ESOPService.obtainContractAddresses();
        services.ESOPService.getESOPDataFromContract();
    } catch (exception) {

        store.dispatch({
            type: "SET_ERROR_DIALOG_MSG",
            errorDialogMsg: exception.toString()
        });

        store.dispatch({
            type: "SHOW_ERROR_DIALOG",
            errorDialog: true
        });

        store.dispatch({
            type: "SET_WAITING_FOR_DATA",
            waitingForData: false
        });
        throw exception
    }

    // TODO: we need real feature / browser detection.
    if (platform.os.toString() !== "iOS 10.0") {
        if (externalWeb3) {
            services.userManagment.getAccount()
        } else {
            ///TODO: here we handle nano - it should be moved to separate place
            LedgerLoginProvider.start();
            LedgerLoginProvider.onConnect(() => {
                LedgerLoginProvider.stop();
                store.dispatch({
                    type: "SHOW_NANO_CONFIRM_ACCOUNT_DIALOG",
                    nanoConfirmAccountDialog: true
                });

                services.userManagment.getAccount()
                    .then(
                        null,
                        error => {
                            if (error === 'Invalid status 6985')
                                console.log('Rejected account confirmation on Nano');
                            else if (error.errorCode !== undefined && error.errorCode === 5) {
                                let msg = <div>
                                    <p>There is timeout on your Nano.</p>
                                    <p>Please reconnect it and reload ESOP page.</p>
                                </div>;
                                store.dispatch({
                                    type: "SET_ERROR_DIALOG_MSG",
                                    errorDialogMsg: msg
                                });
                                store.dispatch({
                                    type: "SHOW_ERROR_DIALOG",
                                    errorDialog: true
                                });
                            }
                            else
                                throw (error);
                        }
                    )
                    .then(
                        () => store.dispatch({
                            type: "SHOW_NANO_CONFIRM_ACCOUNT_DIALOG",
                            nanoConfirmAccountDialog: false
                        })
                    );
            });
        }
    }
})();
