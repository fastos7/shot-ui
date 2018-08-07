import { SubmitOrderPatientBatchRequestPayload } from "./submit-order-patient-batch-request-payload.model";

export class SubmitOrderPatientRequestPayload {

    patientFirstName    : string;
    patientLastName     : string;
    patientDob          : string;
    patientUr           : string;
    patientId           : number;   
    batches             : SubmitOrderPatientBatchRequestPayload[]

    constructor() {}
}
