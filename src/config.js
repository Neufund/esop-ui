export default {
  derivationPath: "44'/60'/104'/0",
  // derivationPath: "44'/60'/0'/0",
  gas: 4300000, // close to current mainnet limit
  gasPriceLimit: 50 * 1000000000, // in gwei you can use http://ethgasstation.info/json/ethgasAPI.json
  numberOfConfirmations: 2, // number of blocks that need to be mined so we assume transaction is mined
  maxNumberOfBlocksToWait: 30, // maximum number of blocks for waiting to transaction to be mined
  dateFormat: 'YY-MM-DD',
  // ethEndpoint: '/api/',
  ethEndpoint: 'https://neufund.org/nodes/mainnet/',
  // ethEndpoint: 'https://neufund.net/nodes/mainnet/',
  // ethEndpoint: 'https://neufund.org/nodes/ropsten/',
  // ethEndpoint: 'https://neufund.net/nodes/ropsten/',
  // ethEndpoint: 'https://ropsten.infura.io/',
  // ethEndpoint: 'https://mainnet.infura.io/',
  truffleArtifacts: '../../ESOP/deployed_artifacts/mainnet', // where ABIs and addresses of smart contracts are, used by webpack
  // truffleArtifacts: '../../ESOP/deployed_artifacts/ropsten', // where ABIs and addresses of smart contracts are, used by webpack
  // truffleArtifacts: '../../ESOP/build/contracts',

  // pdfRenderServer:'',
  pdfRenderServer: 'https://neufund.org/pdfrender/api/document',
  // pdfRenderServer:'/pdfrender/',

  ipfs_tags: {
    company: 'Fifth Force GmbH',
    country: 'Germany',
    'hrb-clause': 'the commercial register of the local court of Berlin under HRB 179357 B',
    'repo-url': 'git@github.com:Neufund/ESOP.git',
    'commit-id': '962acdce986897c39677a2293e03dd7e54ee5394',
    'court-city': 'Berlin',
  },
  GA_ID: 'UA-00000000-0',
  FB_PIXEL_ID: '00000000',
  IPFS_HOST: 'https://ipfs.neufund.org',
};
