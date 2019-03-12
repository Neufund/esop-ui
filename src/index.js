import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import 'flexboxgrid';
import ReactGA from 'react-ga';
import { createStore, combineReducers } from 'redux';

import App from './app/App';
import { initWeb3 } from './web3';
import reducersUser from './reducers/reducersUser';
import reducersESOP from './reducers/reducersESOP';
import reducersUI from './reducers/reducersUI';
import ContractComService from './ContractComService';
import UserManagment from './UserManagment';
import config from './config';

import './index.scss';

(async function app() {
  ReactGA.initialize(config.GA_ID);
  ReactGA.set({ page: window.location.pathname + window.location.search });
  ReactGA.pageview(window.location.pathname + window.location.search);

  injectTapEventPlugin();
  const reducer = combineReducers({
    ESOP: reducersESOP,
    user: reducersUser,
    UI: reducersUI,
  });

  const store = createStore(reducer);
  const services = {};

  ReactDOM.render(
    <App store={store} services={services} />,
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
      type: 'SET_ERROR_DIALOG_MSG',
      errorDialogMsg: exception.toString(),
    });

    store.dispatch({
      type: 'SHOW_ERROR_DIALOG',
      errorDialog: true,
    });

    store.dispatch({
      type: 'SET_WAITING_FOR_DATA',
      waitingForData: false,
    });
    throw exception;
  }

  services.userManagment.getAccount()
    .then(
      (success) => {
        services.ESOPService.getBalance(success).then(balance =>
          store.dispatch({
            type: 'SET_USER_ETH',
            userETH: balance,
          }));
      },
      (error) => {
        const msg = (<div>
          <p>There was a problem with nano</p>
        </div>);
        store.dispatch({
          type: 'SET_ERROR_DIALOG_MSG',
          errorDialogMsg: msg,
        });
        store.dispatch({
          type: 'SHOW_ERROR_DIALOG',
          errorDialog: true,
        });
        console.log(error);
      }
    )
    .then(
      () => store.dispatch({
        type: 'SHOW_NANO_CONFIRM_ACCOUNT_DIALOG',
        nanoConfirmAccountDialog: false,
      })
    );
}());
