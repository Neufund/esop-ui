# Neufund Employee Stock Options Plan UI 
ESOP-ui is frontend application that allows you to view and manipulate [Neufund ESOP smart contract](https://github.com/Neufund/ESOP).  
  
This README is meant to provide technical information how to run and connect UI to existing smartcontract. For
introduction and information what ESOP is visit [https://github.com/Neufund/ESOP](https://github.com/Neufund/ESOP) where
you will find exhaustive information. 

## Prerequisites
There are following prerequisites to compile, run and use this application:
  * [Neufund ESOP smart contract](https://github.com/Neufund/ESOP)  
  * [Node.js](https://nodejs.org/) (we didn't test it on Windows)
  * web browser Chrome, Opera, Firefox with [U2F extension](https://addons.mozilla.org/en-US/firefox/addon/u2f-support-add-on/)
  * Ethereum wallet / signer [Ledger Nano S](https://www.ledgerwallet.com/products/ledger-nano-s), [Metamask](https://metamask.io/)
or [Parity Ethereum Integration](https://chrome.google.com/webstore/detail/parity-ethereum-integrati/himekenlppkgeaoeddcliojfddemadig?)

## How to run
At this moment ESOP-ui project depends on compiled contracts that you will find in ESOP repository so clone both
repositories into same directory so you have following project structure
    
    .
    |-- ESOP
    |-- ESOP-ui

<sup>you can have different structure -> see config file</sup>

commands to do it

    git clone git@github.com:Neufund/ESOP.git
    git clone git@github.com:Neufund/ESOP-ui.git
    
switch into ESOP-ui directory, download dependencies and run webpack in development mode.

    cd ESOP-ui
    npm i  
    npm run dev

This will fire local development webserver that will compile and display DAPP connected to Neufund ESOP demo contract.    

## Configuration
Two important things UI depends on: truffle contract artifacts and Ethereum endpoint, both are defined through
 ```./src/config.js```. 
   
* ```truffleArtifacts``` key store absolute or relative path to directory where truffle artifacts are located.
Those are used by [truffle-contract](https://github.com/trufflesuite/truffle-contract) library which is wrapper to
standard [web3 library](https://github.com/ethereum/wiki/wiki/JavaScript-API). You need to provide them for every
deployment of UI. More information here   
* ```ethEndpoint``` url of Ethereum node. Dapps (abbr decentralized application) are not using typical backend
which provides API. Instead you can connect to any (all are sharing same network) eth node that provides json
RPC api. You can use existing public ones ex. [Infura](https://infura.io/) or you can host your own (that can be a bit
tricky) 

## Build
Just issue ```npm run build``` and Webpack will compile standalone build into ```./ESOP-ui/build``` directory. 

## Deployment
Just put contents of ```./ESOP-ui/build``` directory on any https capable webserver. Github pages etc. are also good.
    
At Neufund we use [Docker](https://www.docker.com/) to host our code. So you can also use our compose / docker files.
As compiled app is so simple also docker files are trivial. Just issue ```docker-compose up``` command after building app
and you will have running nginx container with ESOP-ui listening on port 8080.

## Implementation details
Project is not very complicated. We use standard standard JS frameworks [React](https://facebook.github.io/react/),
[Redux](http://redux.js.org/) and [Material-UI](http://www.material-ui.com/) and [Webpack](https://webpack.js.org/)
as module bundler. To communicate with Ethereum network we use [truffle-contract](https://github.com/trufflesuite/truffle-contract)
library. Still there are few interesting points worth mentioning:

### Ledger Nano S / web3 injection
We decided to allow your users to use [Ledger Nano S](https://www.ledgerwallet.com/products/ledger-nano-s) which is cool
security device. Since its hardware it introduces some complications into usage flow and code.
We managed to resolve most of problems by creating neat library which expose standard web3 object that underneath
communicate with device and use it to sign transactions. After experiences we got with this project we will improve
it a bit, but it's already pretty interesting - [ledger-wallet-provider](https://github.com/Neufund/ledger-wallet-provider).

Then ended with need to dynamically choose which web3 we gonna use: one provided by browser (Metamask / Parity) or own
with Nano support. We do it in typical way proposed in web3 manual:  

    if (typeof window.web3 !== 'undefined') {
        //"web3 already exists" it means Metamask / Parity are beeing used.
    } else {
        // use own web3 that can use Nano
        let engine = new ProviderEngine();
        let ledgerWalletSubProvider = await LedgerWalletSubproviderFactory();
        ...
        window.web3 = new Web3(engine);
    }

### transaction confirmation
One thing that was unpleasant surprise is way that truffle-contract handles sending transactions to eth network.
Returned Promise is resolved not when transaction is mined but when transaction is accepted by node. Because of that you 
still need to manually check when transaction is visible on network. Also it turns out some public nodes like Infura are
not suporting [web3.eth.filter](https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethfilter). We had to
introduce not very elegant solution where we pool network every second to check if transaction is mined.

### truffle artifacts
describe truffle artifacts used, how we get addresses of the contracts


## Dev Tips
When developing UI you need to deploy and use contracts locally. Some tips how to do it - it's not
complete "how to" but it might me useful. Anyway you should start in our main ESOP repo and read and understand
at least [development](https://github.com/Neufund/ESOP#development) part.
  
* run [Parity](https://parity.io/) in dev mode - example command line ```parity ui --chain dev --jsonrpc-cors "http://localhost:8081" --jsonrpc-hosts="all" --jsonrpc-port 8444 ```
* migrate contracts to local development chain ```cd ESOP; truffle migrate --networks paritydev```
* edit ```ESOP-ui/config.js``` and set keys to local values - we provided commented correct ones
* **after** that compile and run app ```npm run dev``` - you need to restart webpack run dev after every contract deployment
* have fun

## Contact
If you have any problems join our [slack channel](https://neufundorg.signup.team) we will be happy to help you.