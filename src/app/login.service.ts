import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import {UrlService} from './url.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
     
    constructor(private _HttpClient : HttpClient, private _UrlService: UrlService) { 

  }

  validateAuth(params : any) : Observable<any> {
    return this._HttpClient.post(this._UrlService.getValidateAuthUrl(), params);
  }
}
