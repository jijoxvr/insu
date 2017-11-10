import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Rx";
import { Subject } from 'rxjs/Subject';
import * as moment from "moment";

@Injectable()
export class UserServiceService {


  user: any;
  userObservable: Subject<any>;

  constructor() {
    this.userObservable = new Subject<any>();
  }

  setUserInfo(): Observable<any> {
    return Observable.create(observer => {
      this.user = JSON.parse(localStorage.getItem('userData'))
      observer.complete();
    })
  }

  

  subscribeUserInfo():Observable<any> {
    return this.userObservable
  }

  getUserInfo(): void {
    this.userObservable.next(this.processUserData(this.user));
  }

  updateUser(user): void {
    localStorage.setItem('userData', JSON.stringify(user));
    this.user = user;
    this.userObservable.next(this.processUserData(this.user));
  }

  private processUserData(user:any){
    user.BirthDateFormated = this.user.BirthDate ? 
     moment(this.user.BirthDate).format('DD/MM/YYYY') : "";
    return user;
  }
  

}
