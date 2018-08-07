import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class HelperService {

  private _changeSystemDateTimeURL = '/shot/helper/systemdate';

  constructor(private _http: HttpClient) { }

  changeDateTime(newDateTime: string): void {
    this._http.post(this._changeSystemDateTimeURL, newDateTime).subscribe();
  }

}
