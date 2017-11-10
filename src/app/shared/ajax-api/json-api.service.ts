import { Injectable } from '@angular/core';
import { Http, Response, Request, RequestOptionsArgs, Headers} from "@angular/http";
import { AppConfig } from '../../app-config';
import { CookieService } from 'ngx-cookie-service';
import { CustomRequestOptions } from "./interfaces";
import { Observable } from "rxjs/Rx";

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/do';

@Injectable()
export class JsonApiService {

  constructor(private http: Http, private cookieService: CookieService) {}

  public request(config: CustomRequestOptions): Observable<any>{
    var header = new Headers({
      // 'Content-Type': "application/json; charset=UTF-8",
    })
    let requestOptionArgs : RequestOptionsArgs = {};
    requestOptionArgs.method = config.method;
    requestOptionArgs.params = config.params;
    requestOptionArgs.headers = header;
    if(config.body)
      requestOptionArgs.body = config.body;
    return this.http.request(this.getBaseUrl() + config.url, requestOptionArgs)
      .map(this.extractData)
      .catch(this.handleError)
  }

  public fetch(url, args?:RequestOptionsArgs): Observable<any>{
    var header = new Headers({'X-CSRFToken' : this.cookieService.get('csrftoken')})
    args.headers = header
    return this.http.get(this.getBaseUrl() + url, { headers: header})
      .map(this.extractData)
      .catch(this.handleError)
  }

  private getBaseUrl(){
    return AppConfig.apiBaseUrl;
    // return location.protocol + '//' + location.hostname + (location.port ? ':'+location.port : '/')
  }

  private extractData(res:Response) {
    let body = res.json();
    if (body){
      return body.data || body
    } else {
      return {}
    }
  }

  private handleError(error:any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return error._body ? Observable.throw(JSON.parse(error._body)) : Observable.throw(errMsg)
  }

}