export default {
    numberOfConfirmations: 1, // number of block that need to be mined so we assume transaction is mined
    dateFormat: 'YY-MM-DD',
    //ethEndpoint: '/api/',
    ethEndpoint: 'https://ropsten.infura.io/33uWXyqdb2ZEons5VtEm',
    truffleArtifacts: '../../ESOP/deployed_artifacts/ropsten', // where ABIs and addresses of smart contracts are, used by webpack
    //truffleArtifacts: '../../ESOP/build/contracts',
    ipfs_tags: {
        "company": "Fifth Force GmbH",
        "country": "Germany",
        "hrb-clause": "the commercial register of the local court of Berlin under HRB 179357 B",
        "repo-url": "git@github.com:Neufund/ESOP.git",
        "commit-id": "962acdce986897c39677a2293e03dd7e54ee5394",
        "court-city": "Berlin"
    }
}