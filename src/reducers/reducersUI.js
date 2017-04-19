export default (state = {selectedUser: undefined}, action) => {

    switch (action.type) {
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