import {web3} from './web3';

export default class UserManagment {
    constructor(store) {
        this.store = store;
    }

    getAccount = () => new Promise((resolve, reject) => {
        web3.eth.getAccounts((error, result) => {
            if(error) {
                reject(error);
            }
            let publicKey = result[0];
            this.store.dispatch({
                type: "SET_USER_PK",
                userPK: publicKey
            });
            let esopState = this.store.getState().ESOP;
            this.store.dispatch({
                type: "SET_USER_TYPE",
                userPK: publicKey,
                companyAddress: esopState.companyAddress,
                employees: esopState.employees
            });
            resolve();
        })
    });
};