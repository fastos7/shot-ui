import { BatchProduct } from './batch-product.model';
export class BatchOrder {
    batchId: number;
    customerKey: string;

    batchProduct: BatchProduct;
}