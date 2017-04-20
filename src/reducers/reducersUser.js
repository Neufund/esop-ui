export default (state = {userType: "anonymous", userPK: undefined}, action) => {
    switch (action.type) {
        case "SET_USER_PK":
            return {
                ...state,
                userPK: action.userPK
            };
            break;
        case "SET_USER_TYPE":
            let userPublicKey = action.userPK != undefined ? action.userPK : state.userPK;

            if (userPublicKey == undefined) {
                return {...state, userType: "anonymous"};
            }

            let companyAddress = action.companyAddress;
            let employees = action.employees;

            if (companyAddress != undefined && companyAddress.toUpperCase() === userPublicKey.toUpperCase()) {
                return {...state, userType: "ceo"};
            }

            if (employees != undefined) {
                for (let employee of employees) {
                    if (userPublicKey.toUpperCase() === employee.address.toUpperCase()) {
                        return {...state, userType: "employee"};
                    }
                }
            }
            return {...state, userType: "anonymous"};
            break;
        default:
            return state;
    }
};