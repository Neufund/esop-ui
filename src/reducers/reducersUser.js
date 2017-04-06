export default (state = {userType: "anonymous"}, action) => {
    switch (action.type) {
        case "SET_USER_TYPE":
            console.log("SET_USER_TYPE: " + action.userType);
            return {
                ...state,
                userType: action.userType
            };
            break;
        default:
            return state;
    }
};