export default {
    derivationPath: "44'/60'/104'/0",
    gasPriceLimit: 20 * 1000000000, // in gwei you can use http://ethgasstation.info/json/ethgasAPI.json
    numberOfConfirmations: 2, // number of blocks that need to be mined so we assume transaction is mined
    maxNumberOfBlocksToWait: 30, // maximum number of blocks for waiting to transaction to be mined
    dateFormat: 'YY-MM-DD',
    //ethEndpoint: '/api/',
    // ethEndpoint: 'https://neufund.org/nodes/ropsten/',
    ethEndpoint: 'https://ropsten.infura.io/',
    truffleArtifacts: '../../ESOP/deployed_artifacts/ropsten', // where ABIs and addresses of smart contracts are, used by webpack
    //truffleArtifacts: '../../ESOP/build/contracts',

    pdfRenderServer:'',
    //pdfRenderServer:'https://neufund.org/pdfrender/api/document',
    //pdfRenderServer:'/pdfrender/',

    ipfs_tags: {
        "company": "Fifth Force GmbH",
        "country": "Germany",
        "hrb-clause": "the commercial register of the local court of Berlin under HRB 179357 B",
        "repo-url": "git@github.com:Neufund/ESOP.git",
        "commit-id": "962acdce986897c39677a2293e03dd7e54ee5394",
        "court-city": "Berlin"
    }
}