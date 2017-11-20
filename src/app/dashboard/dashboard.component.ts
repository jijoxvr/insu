import { Component, OnInit, AfterViewInit } from '@angular/core';
import { APIUrls, AppConfig } from "../app-config";
import { AjaxService } from "../shared/ajax-api/ajax.service";
import { UserServiceService } from "../core/user-service.service";
import * as Chartist from 'chartist';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  public userData;
  public loading: boolean;
  public dataForDashboard: any = {};
  public defaultCurrency = AppConfig.defaultCurrency;

  constructor(public ajaxService:AjaxService,
    public userServiceService: UserServiceService) {
      this.userServiceService.userObservable.subscribe(user => {
        this.userData = user;
      })
      this.userServiceService.getUserInfo();
      this.loading = true;
      this.ajaxService.execute({ method: 'POST', body: {userId: this.userData.UserId}, url: APIUrls.dashboardInfo }).
        subscribe((data) => {
          this.loading = false;
          this.dataForDashboard = data.Details ? data.Details[0] : {}
      })
  }
  
  ngOnInit() {
    
  }

  ngAfterViewInit(){
    
  }

}
