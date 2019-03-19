export default (state = {
  waitingForData: true,
  errorDialog: false,
  errorDialogMsg: '',
  confirmTransactionDialog: false,
  selectedUser: undefined,
  txSuccessDialog: false,
  txHash: '',
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
    case 'SHOW_TX_SUCCESS_DIALOG':
      return {
        ...state,
        txSuccessDialog: true,
        txHash: action.txHash,
      };
    case 'HIDE_TX_SUCCESS_DIALOG':
      return {
        ...state,
        txSuccessDialog: false,
        txHash: '',
      };
    default:
      return state;
  }
};
