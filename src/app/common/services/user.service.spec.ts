import { TestBed, getTestBed, inject } from '@angular/core/testing';

import {MockBackend, MockConnection} from '@angular/http/testing';
import { UserService } from './user.service';
import { HttpService } from './http.service';
import { HttpModule, BaseRequestOptions,Http,XHRBackend,Response,ResponseOptions } from '@angular/http';

describe('UserService', () => {
  
  let mockBackend: MockBackend;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ 
        HttpModule   
       ],
      providers: [
        UserService,
        HttpService,
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          deps: [MockBackend, BaseRequestOptions],
          useFactory:
            (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
              return new Http(backend, defaultOptions);
            }
       }
      ]
    });
    mockBackend = getTestBed().get(MockBackend);    
  });

  it('should be created', inject([UserService], (service: UserService) => {
    expect(service).toBeTruthy();
  }));

  it('should log in and get the users', () => {
    let userService: UserService;

    getTestBed().compileComponents().then(() => {
      mockBackend.connections.subscribe(
        (connection: MockConnection) => {
          connection.mockRespond(new Response(
            new ResponseOptions({
                body: [{"userName":"testUser"}]
              }
            )));
        });

        userService = getTestBed().get(UserService);
        expect(userService).toBeDefined();
        let loginData = null;

        userService.login(loginData).subscribe(response => {
            window.console.log(response);
            expect(response.length).toBeDefined();
            expect(response.length).toEqual(1);
            expect(response[0].userName).toEqual("testUser");
        });
    });
  });
});
