import { JsonApiService } from "./json-api.service";
import { WebStorageService } from "./web-storage.service";
import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Rx";
import { CustomRequestOptions } from "./interfaces";

@Injectable()
export class AjaxService{

	constructor(private webStorageService: WebStorageService, private jsonApiService: JsonApiService){}

	execute(config: CustomRequestOptions): Observable<any>{
		let method = config.method ? config.method: 'GET';
		if(method == 'GET' && config.keepInLocalStorage){
			return this.webStorageService.getItemFromLocalStorage(config.keyForWebStorage, config.url, config.time);
		}else if(method == 'GET' && config.keepInSessionStorage){
			return this.webStorageService.getItemFromSessionStorage(config.keyForWebStorage, config.url, config.time);
		}
		return this.jsonApiService.request(config)
	}
}