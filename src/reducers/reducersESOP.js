export default (state = {state: "New"}, action) => {

    switch (action.type) {
        case "SET_ESOP_DATA":
            return {
                ...state,
                cliffDuration: action.cliffDuration,
                vestingDuration: action.vestingDuration,
                maxFadeoutPromille: action.maxFadeoutPromille,
                exitBonusPromille: action.exitBonusPromille,
                totalOptions: action.totalOptions,
                remainingOptions: action.remainingOptions,
                esopState: action.esopState,
                totalExtraOptions: action.totalExtraOptions,
                conversionEventTime: action.conversionEventTime,
                employeeConversionDeadline: action.employeeConversionDeadline,
                optionsConverter: action.optionsConverter,
                poolEstablishmentDocIPFSHash: action.poolEstablishmentDocIPFSHash,
                ESOPAddress: action.ESOPAddress,
                employees: action.employees,
            };
            break;
        default:
            return state;
    }
};