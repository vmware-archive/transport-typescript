/**
 * Copyright(c) VMware Inc. 2019
 */
export class FabricUtil {

    // check if payload is a fabric request.
    public static isPayloadFabricRequest(payload: any): boolean {

        // if it is empty, exit early.
        if (!payload) {
            return false;
        }

        let commandFound = false;
        let idFound = false;
        let payloadFound = false;
        let versionFound = false;
        let createdFound = false;

        // check command exists.
        if (payload.hasOwnProperty('request')) {
            commandFound = true;
        }

        // must contain a creation timestamp.
        if (payload.hasOwnProperty('created')) {
            createdFound = true;
        }

        // must have an ID.
        if (payload.hasOwnProperty('id')) {
            idFound = true;
        }

        // must contain an actual payload for the request
        if (payload.hasOwnProperty('payload')) {
            payloadFound = true;
        }

        // must also contain a version.
        if (payload.hasOwnProperty('version')) {
            versionFound = true;
        }

        return commandFound && idFound && payloadFound && versionFound && createdFound;
    }

    // not sure there is any value in this, keeping for now.
    // // check if payload is a fabric response
    public static isPayloadFabricResponse(payload: any): boolean {

        // if it is empty, exit early.
        if (!payload) {
            return false;
        }

        let idFound = false;
        let payloadFound = false;
        let errorFound = false;
        let errorCodeFound = false;
        let errorMessageFound = false;
        let versionFound = false;
        let createdFound = false;

        // must contain a creation timestamp.
        if (payload.hasOwnProperty('created')) {
            createdFound = true;
        }

        // must have an ID.
        if (payload.hasOwnProperty('id')) {
            idFound = true;
        }

        // must contain an actual payload for the request
        if (payload.hasOwnProperty('payload')) {
            payloadFound = true;
        }

        // must also contain a version.
        if (payload.hasOwnProperty('version')) {
            versionFound = true;
        }

        // check error property exists
        if (payload.hasOwnProperty('error')) {
            errorFound = true;
        }

        // check error code property exists
        if (payload.hasOwnProperty('errorCode')) {
            errorCodeFound = true;
        }

        if (payload.hasOwnProperty('errorMessage')) {
            errorMessageFound = true;
        }

        return idFound && payloadFound
            && versionFound && createdFound && errorFound && errorCodeFound && errorMessageFound;
    }

}
