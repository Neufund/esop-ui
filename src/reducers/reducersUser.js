export default (state = {userType: "anonymous", userPK: undefined}, action) => {
    switch (action.type) {
        case "SET_USER_PK":
            return {
                ...state,
                userPK: action.userPK
            };
            break;
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