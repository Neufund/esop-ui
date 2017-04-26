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
                residualAmountPromille: action.residualAmountPromille,
                bonusOptionsPromille: action.bonusOptionsPromille,
                newEmployeePoolPromille: action.newEmployeePoolPromille,
                totalPoolOptions: action.totalPoolOptions,
                ESOPLegalWrapperIPFSHash: action.ESOPLegalWrapperIPFSHash,
                optionsPerShare: action.optionsPerShare,
                strikePrice: action.strikePrice,
                minimumManualSignPeriod: action.minimumManualSignPeriod,
                remainingPoolOptions: action.remainingPoolOptions,
                esopState: action.esopState,
                totalExtraOptions: action.totalExtraOptions,
                conversionOfferedAt: action.conversionOfferedAt,
                exerciseOptionsDeadline: action.exerciseOptionsDeadline,
                optionsConverter: action.optionsConverter,
                employees: action.employees,
                newEmployeePoolOption: action.newEmployeePoolOption,
                currentBlockTimestamp: action.currentBlockTimestamp
            };
            break;

        default:
            return state;
    }
};