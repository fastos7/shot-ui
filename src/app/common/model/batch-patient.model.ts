import { Batch } from "./batch.model";

export class BatchPatient {
    patientId: number;
    patientFullName: string;

    batches: Batch[];
}