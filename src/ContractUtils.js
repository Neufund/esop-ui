export default class ContractUtils {
    static getESOPStateName(ESOPState) {
        switch (ESOPState) {
            case 0:
                return "New";
                break;
            case 1:
                return "Open";
                break;
            case 2:
                return "Conversion";
                break;
            default:
                throw "Unknown ESOP state";
        }
    }

    static getEmployeeStateName(EmployeeState) {
        switch (EmployeeState) {
            case 0:
                return "Not set";
                break;
            case 1:
                return "Waiting for signature";
                break;
            case 2:
                return "Employed";
                break;
            case 3:
                return "Terminated";
                break;
            case 4:
                return "Options Exercised";
                break;
            default:
                throw "Unknown employee state";
        }
    }
}
