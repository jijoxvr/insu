import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Rx";
import * as moment from "moment";
import { JsonApiService } from "./json-api.service";

@Injectable()
export class WebStorageService {

    constructor(private jsonApiService: JsonApiService) { }

    public getItemFromLocalStorage(key: string, url: string, time: number=60): Observable<any> {
        return Observable.create(observer => {
            let data = JSON.parse(localStorage.getItem(key));
            if (this.checkDataValidity(data, time)) {
                observer.next(data[key] ? data[key] : data);
                observer.complete();
            } else {
                this.jsonApiService.fetch(url).subscribe(data => {
                    this.setItemInLocalStorage(key, data, time);
                    observer.next(data);
                    observer.complete();
                })
            }
        })
    }

    public getItemFromSessionStorage(key: string, url: string, time: number=60): Observable<any> {
        return Observable.create(observer => {
            let data = JSON.parse(sessionStorage.getItem(key));
            if (this.checkDataValidity(data, time)) {
                observer.next(data[key] ? data[key] : data);
                observer.complete();
            } else {
                this.jsonApiService.fetch(url).subscribe(data => {
                    this.setItemInSessionStorage(key, data, time);
                    observer.next(data);
                    observer.complete();
                })
            }
        })
    }

    private setItemInLocalStorage(key: string, data: any, time: number): void {
        localStorage.setItem(key, time ? this.prepareData(key, data) : JSON.stringify(data));
    }


    private setItemInSessionStorage(key: string, data: any, time: number): void {
        sessionStorage.setItem(key, time ? this.prepareData(key, data) : JSON.stringify(data))
    }

    private checkDataValidity(data, time?: number): boolean {
        if (data == null) return false;
        if (data.storageTime && time) {
            let storageTime = moment(data.storageTime)
            let duration = moment.duration(moment().diff(storageTime)).asSeconds();
            if (duration > time) return false
        }
        return true
    }

    private prepareData(key: string, data: any) {
        let dataToSet = {}
        dataToSet[key] = data;
        dataToSet['storageTime'] = moment()
        return JSON.stringify(dataToSet);
    }


}