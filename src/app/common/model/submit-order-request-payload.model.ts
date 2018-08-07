import { SubmitOrderPatientRequestPayload } from "./submit-order-patient-request-payload.model";

export class SubmitOrderRequestPayload {

    ordNo                   : string;
    ordCusKey               : string;
    ordLastUpdAction        : string;
    ordStatus               : string;
    ordSendDate             : string;
    ordDeliveryDate         : string;
    createdBy               : number;
    ordDeliveryLocation     : string;
    ordDeliveryLocationName : string;
    ordBillTo               : string;
    ordEntity               : string;
	patients                : SubmitOrderPatientRequestPayload[];

    constructor() {}
}
