import { Component, OnInit, TemplateRef, ViewChild, Inject, AfterViewInit, ElementRef } from '@angular/core';
import {
  PolicyStatus, AppConfig, APIUrls,
  AppLabels, SvgIcons
} from "../../app-config";
import { AjaxService } from '../../shared/ajax-api/ajax.service';
import { UserServiceService } from '../../core/user-service.service';
import { AppConfigService } from '../../core/app-config.service';
import * as moment from "moment";
import { Subject } from "rxjs/Rx";
//configuration for claim form
declare var $: any;
@Component({
  selector: 'user-polices',
  templateUrl: './user-polices.component.html',
  styleUrls: ['./user-polices.component.scss']
})
export class UserPolicesComponent implements OnInit {


  public appLabel = AppLabels;
  public isLoading: boolean;
  public isResolved: boolean;
  public policies: Array<any>;
  public morePolicies: Array<any>;
  public defaultCurrency = AppConfig.defaultCurrency;
  public userData: any;
  public insuranceStatus: any;
  public observer: Subject<any>

  @ViewChild('claimConfirmationDialogRef') template: TemplateRef<any>;

  constructor(private ajaxService: AjaxService,
    private userServiceService: UserServiceService, 
    private appConfigService: AppConfigService) {
      this.insuranceStatus = appConfigService.insuranceStatus;
      this.userServiceService.userObservable.subscribe(user => {
        this.userData = user;
        console.log()
      })
      this.userServiceService.getUserInfo();
      this.isLoading = true;
  }

  ngOnInit() {
    this.isLoading = true;
    this.isResolved = false;
    // this.userData.UserId = '10034';
    this.ajaxService.execute({ url: APIUrls.insuranceList, method: 'POST', body: { UserId: this.userData.UserId } }).
      subscribe(response => {
        this.isLoading = false;
        this.isResolved = true;
        this.policies = response.Details ? response.Details : [];
        this.morePolicies = [];
        if(this.policies.length > 2){
          this.morePolicies = JSON.parse(JSON.stringify(this.policies)).
                slice(2, this.policies.length)
        } 
      }, error => {
        this.isLoading = false;
        this.isResolved = true;
        let response = {
          "Status": "SUCCESS",
          "Message": "Hello Test , Here are your existing policies. Which product would you like to claim?",
          "Details": [
            {
              "Insurance_Id": 1,
              "PremiumAmount": 600,
              "InsuranceDate": "2017-12-12T00:00:00",
              "Device": "Google Pixel  XL",
              "StatusId": 4,
              "StartDate": "2017-10-09T00:00:00",
              "EndDate": "2018-10-09T00:00:00",
              "StatusName": "Activated",
              "StatusCode": 'ACTV',
              "StatusMessage": "From X to Y"
            },
            {
              "Insurance_Id": 2,
              "PremiumAmount": 600,
              "InsuranceDate": "2017-12-12T00:00:00",
              "Device": "Google Nexus",
              "StatusId": 5,
              "StartDate": "2017-11-08T00:00:00",
              "EndDate": "2018-10-09T00:00:00",
              "StatusName": "Claimed",
              "StatusCode": 'CLM',
              "StatusMessage": "You have made claim"
            },
            {
              "Insurance_Id": 3,
              "PremiumAmount": 600,
              "InsuranceDate": "2017-12-12T00:00:00",
              "Device": "One plus",
              "StatusId": 4,
              "StartDate": "2017-05-09T00:00:00",
              "EndDate": "2018-10-09T00:00:00",
              "StatusName": "Activated",
              "StatusCode": 'ACTV',
              "StatusMessage": "From X to Y"
            }
          ]
        }
        this.policies = response.Details ? response.Details : [];
        this.morePolicies = [];
        if(this.policies.length > 2){
          this.morePolicies = JSON.parse(JSON.stringify(this.policies)).
                slice(2, this.policies.length)
        } 
      })



  }

}
