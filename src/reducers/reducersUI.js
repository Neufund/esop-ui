export default (state = {selectedUser: undefined, nanoConfirmAccountDialog: false}, action) => {
    switch (action.type) {
        case "SHOW_NANO_CONFIRM_ACCOUNT_DIALOG":
            return {
                ...state,
                nanoConfirmAccountDialog: action.nanoConfirmAccountDialog
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