import {web3} from './web3';

export default class UserManagment {
    constructor(store) {
        this.store = store;
    }

    getAccount = () => {
        web3.eth.getAccounts((error, result) => {
            let publicKey = result[0];
            this.store.dispatch({
                type: "SET_USER_PK",
                userPK: publicKey
            });
        });
    }
};