import Web3 from 'web3';
import ProviderEngine from 'web3-provider-engine';
import RpcSubprovider from 'web3-provider-engine/subproviders/rpc';
import LedgerWalletSubproviderFactory from 'ledger-wallet-provider';

import Config from './config';

let externalWeb3 = null;
let ledger = null;
const NODE_URL = Config.ethEndpoint;

const initWeb3 = async function () {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask/Parity)
  if (typeof window.web3 !== 'undefined') {
    console.info('web3 already exists');
    externalWeb3 = true;
  } else {
    const engine = new ProviderEngine();
    let ledgerWalletSubProvider;

    if (Config.derivationPath !== undefined && Config.derivationPath !== '') {
      ledgerWalletSubProvider = await LedgerWalletSubproviderFactory(Config.derivationPath);
    } else {
      ledgerWalletSubProvider = await LedgerWalletSubproviderFactory();
    }
    ledger = ledgerWalletSubProvider.ledger;
    engine.addProvider(ledgerWalletSubProvider);
    engine.addProvider(new RpcSubprovider({
      rpcUrl: NODE_URL,
    }));
    engine.start();
    window.web3 = new Web3(engine);
    externalWeb3 = false;
  }
};

const exportObject = {
  get ledger() {
    return ledger;
  },
  get externalWeb3() {
    return externalWeb3;
  },
  initWeb3,
  get web3() {
    return window.web3;
  },
};

module.exports = exportObject;
