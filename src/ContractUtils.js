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

    static getEmployeeStateName(EmployeeState) {
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
                return "Dev chain";
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

    static formatEtherscanUrl(address, networkId) {
        return `https://${this.networkIdToEtherscan(networkId)}etherscan.io/address/${address}`;
    }
}
