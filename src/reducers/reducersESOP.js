export default (state = {waitingForData: true, RoTAddress: "find way to write it here"}, action) => {

    switch (action.type) {
        case "SET_ESOP_DATA":
            return {
                ...state,
                waitingForData: false,
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
                ESOPAddress: action.ESOPAddress,
                employees: action.employees,
            };
            break;
        default:
            return state;
    }
};