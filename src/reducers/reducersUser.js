export default (state = {userType: "anonymous"}, action) => {
    switch (action.type) {
        case "SET_USER_TYPE":
            return {
                ...state,
                userType: action.userType
            };
            break;
        default:
            return state;
    }
};