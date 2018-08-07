export class Patient {
    patientId: number;
    fullName: string;
    firstName: string;
    surName: string;
    ur: string;
    dob: string;
    mrnDob: string;
    fullNameMrn: string;
    isPatient: boolean;
    trialId: string;
    active: boolean;
    updatedBy: number;
    updatedDate: string;
    createdBy: number;
    createdDate: string;
    customerKey: string;
    mrnNo: string;

    constructor(patientId, fullName, ur, dob, isPatient= true,
                firstName?, surName?, trialId?, active?, updatedBy?, updatedDate?, createdBy?, createdDate?, customerKey?) {
        this.patientId = patientId;
        this.fullName = fullName;
        this.ur = ur;
        this.dob = dob;
        this.isPatient = isPatient;
        this.firstName = firstName;
        this.surName = surName;
        this.trialId = trialId;
        this.active = active;
        this.updatedBy = updatedBy;
        this.updatedDate = updatedDate;
        this.customerKey = customerKey;
    }
}
