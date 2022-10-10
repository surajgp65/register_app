import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIResponse } from '../models/api-model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class HttpRequestService {
  constructor( private http: HttpClient ) { }
  baseURL = environment.DEV.BASE_URL;
  // function for CRUD
  request(requestType: string, requestURL: string, requestBody: any): Observable<APIResponse> {

    // for get request..
    if (requestType === 'get') {
      return this.http.get<APIResponse>(this.baseURL + requestURL);
    }

    // for post request(adding)..
    if (requestType === 'post') {
      return this.http.post<APIResponse>(this.baseURL + requestURL, requestBody);
    }

    // for put request(updating with all required values)..        
    if (requestType === 'put') {
      return this.http.put<APIResponse>(this.baseURL + requestURL, requestBody);
    }

    // for patch request(updating with specific values)..
    if (requestType === 'patch') {
      return this.http.patch<APIResponse>(this.baseURL + requestURL, requestBody);
    }

    // for delete request..
    if (requestType === 'delete') {
      return this.http.delete<APIResponse>(this.baseURL + requestURL);
    }

  }
}
