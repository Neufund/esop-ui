import axios from 'axios'
let jQuery = require('jquery');
import Config from './config'

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

function getUserTypeName(userType) {
    switch (userType) {
        case "ceo":
            return "company management";
        case "anonymous":
            return "anonymous";
        case "employee":
            return "employee";
        default:
            throw "Unknown employee type";
    }
}

/**
 * Reuturn duration of Epoch time in years rounded into 4 digit places
 * @param {int} timeDuration - Unix time
 * @returns {String}
 */
function epochAsYears(timeDuration) {
    let year = 365 * 24 * 60 * 60;
    let ret = Math.round((timeDuration / year) * 1000) / 1000;
    return ret + (ret == 1 ? ' year' : ' years');
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

const downloadFile = function (ESOPLegalWrapperIPFSHash) {

    if (ESOPLegalWrapperIPFSHash)
        jQuery.ajax({
            type: "POST",
            url: `${Config.pdfRenderServer}?hash=${ESOPLegalWrapperIPFSHash}&type=html`,
            contentType: "application/json",
            data: JSON.stringify(Config.ipfs_tags),
            xhrFields: {
                responseType: 'blob'
            },
            success: function(blob, status){
                var link=document.createElement('a');
                link.href=window.URL.createObjectURL(blob);
                link.download="Dossier_" + new Date() + ".pdf";
                link.click();
            },
            error: function(result, status, err) {
                console.log("Error")
                console.log(result , status ,err)
            }
        });
};

export {
    getUserTypeName,
    validateDoc,
    epochAsYears,
    toPromise,
    downloadFile
}
