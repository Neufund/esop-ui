# Neufund Employee Stock Options Plan UI 
ESOP-ui is frontend application that allows you to view and manipulate [Neufund ESOP smart contract](https://github.com/Neufund/ESOP).  
  
This README is meant to provide only technical information how to run and connect UI to existing smartcontract. For introduction and info what ESOP is visit [https://github.com/Neufund/ESOP](https://github.com/Neufund/ESOP) where you will find exhaustive information and tons of links. 

## Prerequisites
There are following prerequisites to compile, run and use this application:
  * [Neufund ESOP smart contract](https://github.com/Neufund/ESOP)  
  * [Node.js](https://nodejs.org/) (we didn't test it on Windows)
  * web browser Chrome, Opera, Firefox with [U2F extension](https://addons.mozilla.org/en-US/firefox/addon/u2f-support-add-on/)
  * Ethereum wallet / signer [Ledger Nano S](https://www.ledgerwallet.com/products/ledger-nano-s), [Metamask](https://metamask.io/) or [Parity Ethereum Integration](https://chrome.google.com/webstore/detail/parity-ethereum-integrati/himekenlppkgeaoeddcliojfddemadig?)

## How to run
At this moment ESOP-ui project depends on compiled contracts that you will find in ESOP repository so clone both repositories into same directory so you have following project structure
    
    .
    |-- ESOP
    |-- ESOP-ui

<sup>you can have different structure -> see config file</sup>

Commands to do it

    git clone git@github.com:Neufund/ESOP.git
    git clone git@github.com:Neufund/ESOP-ui.git
    
Then switch into ESOP-ui directory, download dependencies and run webpack development mode

    cd ESOP-ui
    npm i  
    npm run dev

This will fire locally development webserver that will compile and display DAPP connected to Neufund ESOP demo contract.    

## Configuration
what are truffleArtifacts  
whats inside config.js  
what is ethEndpoint  

## Build
Just issue ```npm run build``` and Webpack will compile standalone build into ```./ESOP-ui/build``` directory 

## Deployment
Just put contents of ```build``` directory on any https capable webserver. Github pages etc are also good. Since its DAPP it only requires address of Ethereum node. You can use some existing ones ex. [infura](https://infura.io/) or you can host your own (that can be a bit tricky).
    
TODO: add information about nginx files you see in repo

## Implementation details

* describe truffle artifacts used, how we get addresses of the contracts
* how we wait for transaction to be mined
* describe how we inject web3: metamask first then nano and what if nothing


## Dev Tips
Info how to deploy your own smartcontracts just general tips you should start in our main ESOP repo and read and understand at least [development/deployment part](https://github.com/Neufund/ESOP#development)  
* run [Parity](https://parity.io/) in dev mode - example command line ```parity ui --chain dev --jsonrpc-cors "http://localhost:8081" --jsonrpc-hosts="all" --jsonrpc-port 8444 ```
* migrate contracts to local development chain ```truffle migrate --networks paritydev``` more info here link
* edit ```ESOP-ui/config.js```   
* **after** that compile and run app ```npm run dev``` (if you need to redeploy contracts you need to restart webpack)
* have fun

## Contact
If you have any problems join our [slack channel](https://neufundorg.signup.team) we be happy to assist you.