export class APIError {
    // Http status code
    status: string;

    // Application specific error code
    errorCode: string;

    // Detailed error message
    errorMessages: string[];

    constructor(errorMessage: string, status: string = null, errorCode: string = null) {
        this.errorMessages = [];
        this.errorMessages.push(errorMessage);
        this.status = status;
        this.errorCode = errorCode;
    }
}