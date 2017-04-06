export default (state = {waitingForData: true}, action) => {

    switch (action.type) {
        case "SET_ESOP_DATA":
            return {
                ...state,
                waitingForData: false,
                cliffDuration: action.cliffDuration,
                vestingDuration: action.vestingDuration,
                maxFadeoutPromille: action.maxFadeoutPromille,
                exitBonusPromille: action.exitBonusPromille,
                totalOptions: action.totalOptions,
                remainingOptions: action.remainingOptions,
                ESOPState: action.ESOPState,
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