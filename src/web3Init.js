import TransportU2F from '@ledgerhq/hw-transport-u2f';
import createLedgerSubprovider from '@ledgerhq/web3-subprovider';
import Web3 from 'web3';
import Web3ProviderEngine from 'web3-provider-engine';
import RpcSubprovider from 'web3-provider-engine/subproviders/rpc';
import { promisify } from 'bluebird';

import Config from './config';

const NODE_URL = Config.ethEndpoint;

export const web3Init = async () => {
  const dummyWeb3 = new Web3(new Web3.providers.HttpProvider(NODE_URL));
  const getNetworkId = promisify(dummyWeb3.version.getNetwork);
  const networkId = await getNetworkId();

  const engine = new Web3ProviderEngine();
  const getTransport = () => TransportU2F.create();
  const ledgerProvider = createLedgerSubprovider(getTransport, {
    networkId,
    accountsLength: 1,
    path: Config.derivationPath,
  });
  engine.addProvider(ledgerProvider);
  engine.addProvider(
    new RpcSubprovider({
      rpcUrl: NODE_URL,
    })
  );
  engine.start();
  window.web3 = new Web3(engine);
};
