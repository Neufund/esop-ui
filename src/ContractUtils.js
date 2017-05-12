export default class ContractUtils {
    static getESOPStateName(ESOPState) {
        switch (ESOPState) {
            case 0:
                return "New";
            case 1:
                return "Open";
            case 2:
                return "Conversion";
            default:
                throw "Unknown ESOP state";
        }
    }

    static getEmployeeStateName(EmployeeState, suspendedAt, timeToSignExpired) {
        if (suspendedAt != 0)
            return "Suspended";

        if (timeToSignExpired)
            return "Signature expired";

        return this.getEmployeeContractStateName(EmployeeState);
    }

    /**
     * Translate contract employee state from int to human readable name
     * @param EmployeeState
     * @returns {String}
     */
    static getEmployeeContractStateName(EmployeeState) {
        switch (EmployeeState) {
            case 0:
                return "Not set";
            case 1:
                return "Waiting for signature";
            case 2:
                return "Employed";
            case 3:
                return "Terminated";
            case 4:
                return "Options Exercised";
            default:
                throw "Unknown employee state";
        }
    }

    static getNetworkName(id) {
        switch (id) {
            case 1:
                return "Main network";
            case 3:
                return "Ropsten testnet";
            case 42:
                return "Kovan testnet";
            default:
                return "?";
        }
    }

    static networkIdToEtherscan(id) {
        switch (id) {
            case 1:
                return "";
            case 3:
                return "ropsten.";
            case 42:
                return "kovan.";
            default:
                return "";
        }
    }

    static isMiningNetwork(id) {
        // returns true if we know that given network is actively mining new blocks
        return [1,3,42].some(i => i == id);
    }

    static formatEtherscanUrl(address, networkId) {
        return `https://${this.networkIdToEtherscan(networkId)}etherscan.io/address/${address}`;
    }

    /**
     * Formats error string from returned transaction receipt
     * @param {string} okEvent event name on success that identifies which method was called
     * @param {tx} receipt transaction receipt containing logs
     * @returns {string}
     */
    static formatErrorFromReturnCode(funcname, tx) {
        if (tx.logs[0].event == 'ReturnCode') {
            let rc = Number(tx.logs[0].args['rc']);
            switch (funcname) {
                case 'employeeSignsToESOP':
                    if (rc == 2)
                        return `Time to sign option-offer expired. The offer is void.`
                    break;
            }
            switch (rc) {
                case 1:
                    return `ESOP Error Code: Function ${funcname} was called for employee with invalid state`;
                case 2:
                    return `ESOP Error Code: Function ${funcname} was called too late.`;
                case 3:
                    return `ESOP Error Code: Invalid parameters provided to function ${funcname}`;
                case 4:
                    return `ESOP Error Code: Function ${funcname} was called too early.`;
                default:
                    return `Unknown error ${rc} returned from function ${funcname}.`;
            }
        }
        return `Unknown error returned from ${funcname}`;
    }
}
