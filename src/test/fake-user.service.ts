import { UserService } from '../app/common/services/user.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';

export class FakeUserService {

    login( loginData: any ): Observable<any> {
       return Observable.from([{"userName":"userName"}]);
      }
}    