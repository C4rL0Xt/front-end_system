import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  resourceUrl = environment.resource_url;

  constructor(private HttpClient: HttpClient) { }

  public user(): Observable<any> {
    return this.HttpClient.get<any>(this.resourceUrl + 'user');
  }

  public admin(): Observable<any> {
    return this.HttpClient.get<any>(this.resourceUrl + 'admin');
  }
}
