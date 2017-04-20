export default (state = {
    selectedUser: undefined,
    nanoConfirmAccountDialog: false,
    nanoConfirmTransactionDialog: false,
    errorDialog: false
}, action) => {
    switch (action.type) {
        case "SHOW_ERROR_DIALOG":
            return {
                ...state,
                errorDialog: action.errorDialog
            };
            break;
        case "SHOW_NANO_CONFIRM_ACCOUNT_DIALOG":
            return {
                ...state,
                nanoConfirmAccountDialog: action.nanoConfirmAccountDialog
            };
            break;
        case "SHOW_NANO_CONFIRM_TRANSACTION_DIALOG":
            return {
                ...state,
                nanoConfirmTransactionDialog: action.nanoConfirmTransactionDialog
            };
            break;
        case "SET_SELECTED_USER":
            return {
                ...state,
                selectedUser: action.selectedUser
            };
            break;
        default:
            return state;
    }
};