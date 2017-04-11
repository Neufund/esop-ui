import Web3 from 'web3'
import ProviderEngine from 'web3-provider-engine';
import RpcSubprovider from 'web3-provider-engine/subproviders/rpc';

import LedgerWalletSubproviderFactory from 'ledger-wallet-provider';

let ledger = null;
const NODE_URL = '/api/';

let initWeb3 = async function () {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask/Parity)
    if (typeof window.web3 !== 'undefined') {
        console.warn("web3 already exists");
    } else {
        let engine = new ProviderEngine();
        let ledgerWalletSubProvider = await LedgerWalletSubproviderFactory();
        ledger = ledgerWalletSubProvider.ledger;
        engine.addProvider(ledgerWalletSubProvider);
        engine.addProvider(new RpcSubprovider({
            rpcUrl: NODE_URL,
        }));
        engine.start();
        window.web3 = new Web3(engine);
    }
};

let exportObject = {
    get ledger() {
        return ledger;
    },
    initWeb3,
    get web3() {
        return window.web3;
    }
};

module.exports = exportObject;
