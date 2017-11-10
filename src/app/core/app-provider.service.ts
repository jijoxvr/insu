import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { AppConfigService } from "./app-config.service";
import { UserServiceService } from "./user-service.service";

@Injectable()
export class UserResolver implements Resolve<any>{

  constructor(private userServiceService: UserServiceService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.userServiceService.setUserInfo();
  }

}

@Injectable()
export class MasterResolver implements Resolve<any>{

  constructor(private appConfigService: AppConfigService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.appConfigService.testUserInfo();
  }

}

