export default (state = {waitingForData: true}, action) => {

    switch (action.type) {
        case "SET_CONTRACT_ADDRESS":
            return {
                ...state,
                ...action.address
            };
            break;

        case "SET_ESOP_DATA":
            return {
                ...state,
                waitingForData: false,
                companyAddress: action.companyAddress,
                cliffPeriod: action.cliffPeriod,
                vestingPeriod: action.vestingPeriod,
                maxFadeoutPromille: action.maxFadeoutPromille,
                bonusOptionsPromille: action.bonusOptionsPromille,
                newEmployeePoolPromille: action.newEmployeePoolPromille,
                totalPoolOptions: action.totalPoolOptions,
                ESOPLegalWrapperIPFSHash: action.ESOPLegalWrapperIPFSHash,
                strikePrice: action.strikePrice,
                waitForSignPeriod: action.waitForSignPeriod,
                remainingPoolOptions: action.remainingPoolOptions,
                esopState: action.esopState,
                totalExtraOptions: action.totalExtraOptions,
                conversionOfferedAt: action.conversionOfferedAt,
                exerciseOptionsDeadline: action.exerciseOptionsDeadline,
                optionsConverter: action.optionsConverter,
                employees: action.employees,
            };
            break;

        default:
            return state;
    }
};