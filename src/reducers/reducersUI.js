export default (state = {
  waitingForData: true,
  errorDialog: false,
  errorDialogMsg: '',
  nanoConfirmAccountDialog: false,
  confirmTransactionDialog: false,
  selectedUser: undefined,
}, action) => {
  switch (action.type) {
    case 'SHOW_ERROR_DIALOG':
      return {
        ...state,
        errorDialog: action.errorDialog,
      };
    case 'SET_ERROR_DIALOG_MSG':
      return {
        ...state,
        errorDialogMsg: action.errorDialogMsg,
      };
    case 'SHOW_NANO_CONFIRM_ACCOUNT_DIALOG':
      return {
        ...state,
        nanoConfirmAccountDialog: action.nanoConfirmAccountDialog,
      };
    case 'SHOW_CONFIRM_TRANSACTION_DIALOG':
      return {
        ...state,
        confirmTransactionDialog: action.confirmTransactionDialog,
      };
    case 'SET_SELECTED_USER':
      return {
        ...state,
        selectedUser: action.selectedUser,
      };
    case 'SET_WAITING_FOR_DATA':
      return {
        ...state,
        waitingForData: action.waitingForData,
      };
    default:
      return state;
  }
};
