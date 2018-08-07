import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Constants } from '../app.constants';


@Injectable()
export class FileManagerService {

    constructor(private http: HttpClient) { }

    uploadFile(file: File, fileURL: string): Observable<HttpEvent<{}>> {
        let formdata: FormData = new FormData();
        formdata.append('file', file);

        const req = new HttpRequest('POST', fileURL, formdata, {
            reportProgress: true,
            responseType: 'text'
        });
        return this.http.request(req);
    }

    downloadFile(fileURL: string): Observable<any> {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/pdf'
        });
        return this.http.get(fileURL, { headers: headers, responseType: 'blob' })
            .map((res) => {
                let fileBlob = res;
                return new Blob([fileBlob], {
                    type: 'application/pdf' // must match the Accept type
                });
            });
    }
}