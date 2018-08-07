import { APIError } from './model/apiError.model';
import { User } from './model/user.model';
import { UserAuthorities } from './model/user-authorities.model';
import { NewsFeed } from './model/news-feed.model';
import { Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod, XHRBackend, RequestOptions } from '@angular/http';
import { DeliveryDateTime } from './model/delivery-datetime.model';
import { DeliveryGroup } from './model/delivery-group.model';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Batch } from './model/batch.model';
import { Product } from './model/product.model';

export function fakeBackendFactory(backend: MockBackend, options: BaseRequestOptions, realBackend: XHRBackend) {
    // array in local storage for registered users
    let users: User[] = JSON.parse(sessionStorage.getItem('users')) || [new User('osamas@es.com', 'qwer2475', 'osamas@es.com', 1, 'Osama', 'Shakeel', 'fake-jwt-token', true)];
    
    // configure fake backend
    backend.connections.subscribe((connection: MockConnection) => {
        // wrap in timeout to simulate server api call
        setTimeout(() => {

            // authenticate
            if (connection.request.url.endsWith('/api/authenticate') && connection.request.method === RequestMethod.Post) {
                // get parameters from post request
                let params = JSON.parse(connection.request.getBody());

                // find if any user matches login credentials
                let filteredUsers = users.filter(user => {
                    return user.email === params.email && user.password === params.password;
                });

                if (filteredUsers.length) {
                    // if login details are valid return 200 OK with user details and fake jwt token
                    let user: User = filteredUsers[0];
                    let userAuthorities : UserAuthorities[] = [new UserAuthorities(1,"22SYD101", "Westmead Private Hospital" ,["ORDERS"]), 
                                                 /* new UserSite(2,"144ESSQL003", "Liverpool Hospital", 1 ,"ORDERS_JUNIOR"),
                                                  new UserSite(1,"22SYD102", "Westmead Private Hospital2", 1 ,"ORDERS_READ_ONLY"), 
                                                  new UserSite(1,"22SYD103", "Westmead Private Hospital3 Westmead Private Hospital3", 1 ,"CUSTOMER_PREF_MAINTENANCE"), 
                                                  new UserSite(1,"22SYD104", "Westmead Private Hospital4", 1 ,"CUSTOMER_SUPER_USER"),
                                                  new UserSite(1,"22SYD105", "Westmead Private Hospital5", 1 ,"SLADE_ADMINISTRATOR"),
                                                  new UserSite(1,"22SYD106", "Westmead Private Hospital6", 1 ,"REPORTS"),
                new UserSite(1,"22SYD107", "Westmead Private Hospital7", 1 ,"INVOICES"), */ ];
                    
                    user.defaultSite = "22SYD106";
                    user.userAuthorities = userAuthorities;
                                                  
                    
                    connection.mockRespond(new Response(new ResponseOptions({
                        status: 200,
                        body: JSON.stringify(user)
                    })));
                } else {
                    // else return 401 bad request
                    let apiError: APIError = new APIError('Please check the email, password and make sure your account is currently active in order to login');
                    connection.mockError(new Error(JSON.stringify(apiError)));
                }

                return;
            }


            // if (connection.request.url.endsWith('/shot/api/newsfeed/') && connection.request.method === RequestMethod.Get) {
          
            //         let newsFeed: NewsFeed[] = [new NewsFeed(1,new Date(), "Heading", 
            //                                     "This is a large message . This should get truncated...This is a large message . This should get truncated This is a large message . This should get truncatedThis is a large message . This should get truncatedThis is a large message . This should get truncatedThis is a large message . This should get truncatedThis is a large message . This should get truncatedThis is a large message . This should get truncated",
            //                                     "Kranthi"),
            //                                     new NewsFeed(1,new Date(), "Heading", "Message","Kranthi"),
            //                                     new NewsFeed(2,new Date(), "Heading2", "Message2","Kranthi")];
            //         connection.mockRespond(new Response(new ResponseOptions({
            //             status: 200,
            //             body: JSON.stringify(newsFeed)
            //         })));
             
            //     return;
            // }

            if (connection.request.url.endsWith('/shot/api/customers/CUSTHOSP/logistics/?orderType=0') && connection.request.method === RequestMethod.Get) {
                let deliveryGroup: DeliveryGroup = new DeliveryGroup();
                deliveryGroup.facilityName = 'Mount Kuringaee Center';
                deliveryGroup.facilityContactNo = '02-8345646';
                let deliveryDateTimes: DeliveryDateTime[] = [
                    new DeliveryDateTime('2017-11-07T15:00:00', false),
                    new DeliveryDateTime('2017-11-08T15:00:00', true),
                    new DeliveryDateTime('2017-11-09T15:00:00', true),
                    new DeliveryDateTime('2017-11-10T15:00:00', true),
                    new DeliveryDateTime('2017-11-11T15:00:00', true),
                    new DeliveryDateTime('2017-11-12T15:00:00', true),
                    new DeliveryDateTime('2017-11-13T15:00:00', true),
                    new DeliveryDateTime('2017-11-14T15:00:00', true),
                    new DeliveryDateTime('2017-11-15T15:00:00', true),
                    new DeliveryDateTime('2017-11-16T15:00:00', true),
                    new DeliveryDateTime('2017-11-17T15:00:00', true),
                    new DeliveryDateTime('2017-11-18T15:00:00', true),
                    new DeliveryDateTime('2017-11-19T15:00:00', true),
                    new DeliveryDateTime('2017-11-20T15:00:00', true),
                    new DeliveryDateTime('2017-11-21T15:00:00', true),
                    new DeliveryDateTime('2017-11-22T15:00:00', true),
                    new DeliveryDateTime('2017-11-23T15:00:00', true),
                    new DeliveryDateTime('2017-11-24T15:00:00', true),
                    new DeliveryDateTime('2017-11-25T15:00:00', true),
                    new DeliveryDateTime('2017-11-26T15:00:00', true),
                    new DeliveryDateTime('2017-11-27T15:00:00', true)
                ];
                deliveryGroup.deliveryDateTimes = deliveryDateTimes;

                connection.mockRespond(new Response(new ResponseOptions({
                    status: 200,
                    body: JSON.stringify(deliveryGroup)
                })));
         
                return;
            }
        
            /*if (connection.request.url.endsWith('/shot/api/customers/101MEL103/orders/history/?patientKey=1') && connection.request.method === RequestMethod.Get) {
                let batch: Batch = new Batch();
                batch.product = new Product(1, 'Nivolumab', 0);
                batch.dose = '60mg';
                batch.diluent = '0.9% Sodium Chloride';
                batch.container = 'FreFlex Bag';
                batch.exact = 'No';
                batch.infusionDuration = 6;
                batch.infusionUnit = 'hours';
                batch.route = 'Intravenous';
                batch.quantity = 1;
                batch.comments = 'order placed';
                batch.batchDate = '2017-12-15T08:00:00';

                let batch2: Batch = new Batch();
                Object.assign(batch2, batch);
                batch2.quantity = 5;
                batch2.batchDate = '2017-11-15T08:00:00';

                let batches: Batch[] = [
                    batch,
                    batch2
                ];

                connection.mockRespond(new Response(new ResponseOptions({
                    status: 200,
                    body: JSON.stringify(batches)
                })));
         
                return;
            }*/
            // pass through any requests not handled above
            let realHttp = new Http(realBackend, options);
            let requestOptions = new RequestOptions({
                method: connection.request.method,
                headers: connection.request.headers,
                body: connection.request.getBody(),
                url: connection.request.url,
                withCredentials: connection.request.withCredentials,
                responseType: connection.request.responseType
            });
            realHttp.request(connection.request.url, requestOptions)
                .subscribe((response: Response) => {
                    connection.mockRespond(response);
                },
                (error: any) => {
                    connection.mockError(error);
                });
        }, 500);
    });

    return new Http(backend, options);
};

export let mockBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: Http,
    useFactory: fakeBackendFactory,
    deps: [MockBackend, BaseRequestOptions, XHRBackend]
};