export default (state = {
    waitingForData: true,
    errorDialog: false,
    errorDialogMsg: '',
    nanoConfirmAccountDialog: false,
    confirmTransactionDialog: false,
    selectedUser: undefined,
}, action) => {
    switch (action.type) {
        case "SHOW_ERROR_DIALOG":
            return {
                ...state,
                errorDialog: action.errorDialog
            };
            break;
        case "SET_ERROR_DIALOG_MSG":
            return {
                ...state,
                errorDialogMsg: action.errorDialogMsg
            };
            break;
        case "SHOW_NANO_CONFIRM_ACCOUNT_DIALOG":
            return {
                ...state,
                nanoConfirmAccountDialog: action.nanoConfirmAccountDialog
            };
            break;
        case "SHOW_CONFIRM_TRANSACTION_DIALOG":
            return {
                ...state,
                confirmTransactionDialog: action.confirmTransactionDialog
            };
            break;
        case "SET_SELECTED_USER":
            return {
                ...state,
                selectedUser: action.selectedUser
            };
            break;
        case "SET_WAITING_FOR_DATA":
            return {
                ...state,
                waitingForData: action.waitingForData
            };
            break;
        default:
            return state;
    }
};