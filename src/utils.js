import moment from 'moment'
import axios from 'axios'

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
 * Reuturn duration in human readable format
 * @param {int} timeDuration - Unix time
 * @returns {String}
 */
function humanReadableDuration(timeDuration) {
    let duration = moment.duration(timeDuration * 1000);
    return duration.asDays() + ' days';
}
/**
 * Todo: Handle the error in IPFSHASH
 */
const validateDoc  = function (ESOPLegalWrapperIPFSHash , callback) {

    if (ESOPLegalWrapperIPFSHash)
        axios.get(`https://ipfs.io/ipfs/${ESOPLegalWrapperIPFSHash}`)
            .then((response) =>{

                let data = response.data;

                data = data.replace(new RegExp("“" , 'g') , '"');
                data = data.replace(new RegExp("’" , 'g') , `'`);
                data = data.replace(new RegExp("‘" , 'g') , `'`);
                data = data.replace(new RegExp("”" , 'g') , '"');

                callback(data)

            })
            .catch(function (error) {
                console.log(error);
            });
};

export {
    humanReadableDuration,
    validateDoc,
    toPromise
}