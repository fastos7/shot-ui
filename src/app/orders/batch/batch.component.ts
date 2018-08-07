import { LocalStoreManager } from '../../common/local-store-manager';
import { UserAuthorities } from '../../common/model/user-authorities.model';
import { User } from '../../common/model/user.model';
import { Component, OnInit } from '@angular/core';
import { Product } from '../../common/model/product.model';
import { BatchProduct } from '../../common/model/batch-product.model';
import { BatchOrder } from '../../common/model/batch-order.model';
import { UserService } from '../../common/services/user.service';
import { Patient } from '../../common/model/patient.model';
import { DeliveryDateTime } from '../../common/model/delivery-datetime.model';
import { DeliveryLocation } from '../../common/model/delivery-location.model';

@Component({
    templateUrl: 'batch.component.html'
})
export class BatchOrderComponent implements OnInit {
    batchOrder: BatchOrder;
    customerKey: string;
    patient: Patient;

    constructor(private localStoreManager: LocalStoreManager,
        private userService: UserService) {
    }

    ngOnInit() {
        this.patient = new Patient(1, 'Tom Smith', '12121', '2017-12-15', true);
        this.batchOrder = new BatchOrder();
        this.batchOrder.batchId = 999;


        // Save as Logged in User
        let user: User = this.userService.getCurrentUser()
        this.customerKey = user.selectedUserAuthority.customerKey;
        this.batchOrder.customerKey = user.selectedUserAuthority.customerKey;

        let batchProduct = new BatchProduct();
        batchProduct.batchProductId = 222;
        batchProduct.deliveryDateTime = new DeliveryDateTime('2017-12-19T08:00:00');
        //batchProduct.product = new Product('Etopiside Phosphate', "Standard","Autobatch","4","","19ES100","","","","","mg");
        batchProduct.quantity = 5;
        batchProduct.deliveryLocation = new DeliveryLocation('139ESSQL003', 'Atherton Goods Inward');
        this.batchOrder.batchProduct = batchProduct;
        console.info(user);
        //<User> JSON.parse(this.localStoreManager.getData('currentUser'));
        //new User('kranthi', 'Bellarat Hospital Sydney');
        //let selectedAuth: UserAuthorities = user.selectedUserAuthority;
        //new UserAuthorities(1, '100MEL103', null, null);
        //selectedAuth.customerLocations = [
        //  'Bellarat Clinic NSW',
        //'Bellarat Hospital Sydney',
        //'Bellarat Hospital VIC'
        //];

        //this.localStoreManager.savePermanentData(JSON.stringify(user), 'currentUser'); 
        // If Product added
        /* let product: Product = new Product(1, '', 0);
         let batchProduct = new BatchProduct();
         batchProduct.batchProductId = 222;
         batchProduct.deliveryDateTime = '2017-11-24T08:00:00';
         batchProduct.product = product;
         batchProduct.quantity = 5;
         batchProduct.deliveryLocation = 'Gladstone Hospital Pharmacy';
         this.batchOrder.batchProduct = batchProduct;
 
         // Save as Logged in User
         let user: User = new User('kranthi', 'Bellarat Hospital Sydney');
         let selectedAuth: UserAuthorities = new UserAuthorities(1, '100MEL103', null, null);
         selectedAuth.customerLocations = [
             'Bellarat Clinic NSW',
             'Bellarat Hospital Sydney',
             'Bellarat Hospital VIC'
         ];
         user.selectedUserAuthority = selectedAuth;
 
         this.localStoreManager.savePermanentData(JSON.stringify(user), 'currentUser'); */
    }

    onSelected(patient: Patient) {
        console.log(patient);
    }
}