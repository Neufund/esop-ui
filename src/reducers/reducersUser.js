export default (state = { userType: 'anonymous', userPK: undefined, userETH: undefined }, action) => {
  switch (action.type) {
    case 'SET_USER_PK':
      return {
        ...state,
        userPK: action.userPK,
      };
    case 'SET_USER_ETH':
      return {
        ...state,
        userETH: action.userETH,
      };
    case 'SET_USER_TYPE':
      const userPublicKey = action.userPK !== undefined ? action.userPK : state.userPK;

      if (userPublicKey === undefined) {
        return { ...state, userType: 'anonymous' };
      }

      const companyAddress = action.companyAddress;
      const employees = action.employees;

      if (companyAddress !== undefined && companyAddress.toUpperCase() === userPublicKey.toUpperCase()) {
        return { ...state, userType: 'ceo' };
      }

      if (employees !== undefined) {
        for (const employee of employees) {
          if (userPublicKey.toUpperCase() === employee.address.toUpperCase()) {
            return { ...state, userType: 'employee' };
          }
        }
      }
      return { ...state, userType: 'anonymous' };
    default:
      return state;
  }
};
