import semver from 'semver';
import {toPromise} from './utils';
import {ledger} from './web3';
import {timeout} from 'promise-timeout';

const CHECK_INTERVAL = 1000;

class LedgerLoginProvider {
    constructor() {
        this.connected = false;
        this.version = null;
        this.versionIsSupported = null;
        this.error = null;
        this.arbitraryDataEnabled = null;
        this.onConnectedCallbacks = [];
        this.onDisconnectedCallbacks = [];
        this.intervalId = null;
        this.isStarted = false;
    }

    /**
     * Starts watching if ledger is connected/disconnected
     */
    start() {
        this.isStarted = true;
        this.intervalId = setInterval(this._checkLedgerConnected.bind(this), CHECK_INTERVAL);
    }

    /**
     * Stop watching if ledger is connected/disconnected
     */
    stop() {
        this.isStarted = false;
        clearInterval(this.intervalId);
    }

    /**
     * Waits until ledger is connected, or returns immediately if it is
     * @return {Promise}
     */
    async waitUntilConnected() {
        if (this.connected)
            return;
        return new Promise((resolve, _) => {
            this.onConnectedCallbacks.push(resolve);
        })
    }

    _checkLedgerConnected() {
        if (this.isStarted) {
            toPromise(ledger.getAppConfig, [], [CHECK_INTERVAL/2])
                .then(this._isConnected.bind(this))
                .catch(this._isDisconnected.bind(this));
        }
    }

    /**
     * The ledger is connected
     * @param config - ETH app config
     * @private
     */
    _isConnected(config) {
        this._setConfig(config);
        if (this.connected === false) {
            this._handleConnected();
        }
    }

    /**
     * The ledger is disconnected
     * @param error
     * @private
     */
    _isDisconnected(error) {
        this.error = error;
        if (this.connected === true) {
            this._handleDisconnected();
        }
    }

    /**
     * The ledger was just connected
     * @private
     */
    _handleConnected() {
        this.connected = true;
        this._executeCallbacks(this.onConnectedCallbacks);
    }

    /**
     * The ledger was just disconnected
     * @private
     */
    _handleDisconnected() {
        ledger._accounts = null;
        this.connected = false;
        this._executeCallbacks(this.onDisconnectedCallbacks);
    }

    /**
     * Executes all registered callbacks
     * @param cbs
     * @private
     */
    _executeCallbacks(cbs) {
        cbs.map(cb => cb());
        cbs.length = 0;
    }

    /**
     * Set ledger configuration
     * @param config
     * @private
     */
    _setConfig(config) {
        this.version = config.version;
        this.arbitraryDataEnabled = config.arbitraryDataEnabled;
        this.versionIsSupported = semver.lt(config.version, "1.0.8");
    }

    onConnect(cb) {
        if (this.connected) {
            cb();
        } else {
            this.onConnectedCallbacks.push(cb);
        }
    }

    onDisconnect(cb) {
        if (!this.connected) {
            cb();
        } else {
            this.onDisconnectedCallbacks.push(cb);
        }
    }
}

export default new LedgerLoginProvider();