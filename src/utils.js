import moment from 'moment'

const failableCallback = (resolve, reject) => {
    return (error, data) => {
        if (error) {
            reject(error);
        }
        else {
            resolve(data);
        }
    }
};

const noErrorCallback = resolve => {
    return () => {
        resolve();
    }
};

const toPromiseFactory = (cb) => {
    return (f, args, postCbArgs = []) => {
        return new Promise((resolve, reject) => {
            let cb = failableCallback(resolve, reject);
            if (Array.isArray(args)) {
                f(...args, cb, ...postCbArgs);
            } else {
                if (args === undefined) {
                    f(cb, ...postCbArgs);
                } else {
                    f(args, cb, ...postCbArgs);
                }
            }
        });
    };
};

const toPromise = toPromiseFactory(failableCallback);

const makeCancelable = (promise) => {
    let hasCanceled_ = false;

    const wrappedPromise = new Promise((resolve, reject) => {
        promise.then((val) =>
            hasCanceled_ ? reject({isCanceled: true}) : resolve(val)
        );
        promise.catch((error) =>
            hasCanceled_ ? reject({isCanceled: true}) : reject(error)
        );
    });

    return {
        promise: wrappedPromise,
        cancel() {
            hasCanceled_ = true;
        },
    };
};

/**
 * Reuturn duration of Epoch time in years rounded into 4 digit places
 * @param {int} timeDuration - Unix time
 * @returns {String}
 */
function epochAsYears(timeDuration) {
    let duration = moment.duration(timeDuration * 1000);
    let ret = duration.asYears();
    return (Math.round(ret * 1000) / 1000) + (ret == 1 ? ' year' : ' years');
}

export {
    epochAsYears,
    toPromise
}