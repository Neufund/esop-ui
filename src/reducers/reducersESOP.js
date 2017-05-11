export default (state = {}, action) => {

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
                STRIKE_PRICE: action.STRIKE_PRICE,
                MINIMUM_MANUAL_SIGN_PERIOD: action.MINIMUM_MANUAL_SIGN_PERIOD,
                remainingPoolOptions: action.remainingPoolOptions,
                esopState: action.esopState,
                totalExtraOptions: action.totalExtraOptions,
                conversionOfferedAt: action.conversionOfferedAt,
                exerciseOptionsDeadline: action.exerciseOptionsDeadline,
                optionsConverter: action.optionsConverter,
                employees: action.employees,
                newEmployeePoolOption: action.newEmployeePoolOption,
                currentBlockTimestamp: action.currentBlockTimestamp,
                currentBlockHash: action.currentBlockHash,
                networkId: action.networkId
            };
            break;

        default:
            return state;
    }
};