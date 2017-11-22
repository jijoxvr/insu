import { Component, OnInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { UserServiceService } from "../../core/user-service.service";
import { MapsAPILoader } from '@agm/core';
import { } from 'googlemaps';
import { AppConfigService } from "../../core/app-config.service";
import { AjaxService } from "../../shared/ajax-api/ajax.service";
import { AppLabels, APIUrls } from "../../app-config";
import { trigger, transition, style, animate } from "@angular/animations";
import { Observable } from 'rxjs/Observable';
import { Uploader }      from 'angular2-http-file-upload';
import { UploadFileService }  from '../../shared/ajax-api/upload-file.service';
import * as moment from "moment";
import 'firebase/storage';
import * as firebase from 'firebase/app';
import 'rxjs/add/observable/forkJoin';
declare var $: any;

@Component({
  selector: 'app-assist-to-claim',
  templateUrl: './assist-to-claim.component.html',
  styleUrls: ['./assist-to-claim.component.css', '../common/chat-box.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: '0' }),
        animate('.1s ease-out', style({ opacity: '1' })),
      ]),
    ]),
    trigger('zoomInUp1', [
      transition(':enter', [
        animate(0, style({ transform: 'scale3d(.1, .1, .1) translate3d(0, 1000px, 0)', opacity: '0', offset: 0 })),
        animate(500, style({ transform: 'scale3d(.475, .475, .475) translate3d(0, -60px, 0)', opacity: '1', offset: 0.6 })),
        animate(200, style({ transform: 'none', opacity: '1', offset: 1 }))
      ])
    ]),
    trigger('zoomInUp2', [
      transition(':enter', [
        animate(0, style({ transform: 'scale3d(.1, .1, .1) translate3d(0, 1000px, 0)', opacity: '0', offset: 0 })),
        animate(1000, style({ transform: 'scale3d(.475, .475, .475) translate3d(0, -60px, 0)', opacity: '1', offset: 0.6 })),
        animate(200, style({ transform: 'none', opacity: '1', offset: 1 }))
      ])
    ]),
    trigger('bounceInUp', [
      transition(':enter', [
        animate(100, style({ transform: 'translate3d(0, 3000px, 0)', opacity: '0', offset: 0 })),
        animate(100, style({ transform: 'translate3d(0, -25px, 0)', opacity: '1', offset: 0.6 })),
        animate(100, style({ transform: 'translate3d(0, 100px, 0)', offset: 0.75 })),
        animate(100, style({ transform: 'translate3d(0, -5px, 0)', offset: 0.9 })),
        animate(100, style({ transform: 'translate3d(0, 0, 0)', opacity: '1', offset: 1 }))
      ])
    ]),
  ],
})
export class AssistToClaimComponent implements OnInit {

  userData:any;
  now = new Date()
  loading: boolean;
  messages: Array<any> = [];
  dataToServer: any = {};
  userPolicies: any;
  claimReason: any;
  claimConfig: any;
  helpText = '';
  disableSubmit = false;
  disableUserInput = true;
  userInput: any;

  stageIndex = {
    stageOne: 2,
    stageTwo: 5,
  }

  userActions = {
    'purpose': false,
    'claimType': false,
    'claimReason': false,
    'confirmIMEI': false,
    'selectDamageType': false,
    'selectDamageHow': false,
    'warrantyConfirm': false,
    'selectDate': false,
    'selectTime': false,
    'confirmDeductable': false,
    'uploadSelfieVideo': false,
    'selectPlace': false,
    'policeReportConfirm': false,
    'uploadPoliceReport' : false,
  }

  claimMainReason = [];
  claimSubReason = [];
  claimDamageType = [];
  claimDamageHow = [];
  
  claimReasonGrouped = {};
  claimDamageTypeGrouped = {};
  claimDamageSubTypeGrouped = {};
  claimIssueGrouped = {};

  questionOptions = [];


  @ViewChild("search")
  public searchElementRef: ElementRef;
  
  constructor(public userServiceService: UserServiceService,
    public ajaxService: AjaxService, private appConfigService: AppConfigService,
    private mapsAPILoader: MapsAPILoader,private ngZone: NgZone,
    public uploaderService: Uploader) { 
      this.userServiceService.userObservable.subscribe(user => {
        this.userData = user;
      })
      this.userServiceService.getUserInfo();
  }

  ngOnInit() {
    this.getQuestion(0);
  }


  getQuestion(input){
    this.pushData('sent message loading new', null, true);
    let bfTime = moment();
    this.ajaxService.execute({body: {QuestionId: input}, method: 'POST', url:APIUrls.getQuestion}).
      subscribe(data => {
        let delay = moment.duration(moment().diff(bfTime)).asMilliseconds();
        delay = delay > 1500 ? 0 : (1500 - delay);
        console.log(delay)
        setTimeout(() => {
          this.processQuestion(data);
        }, delay) 
      }, error => {

      })

  }

  processQuestion(data){
    if(data && data.Status == 'SUCCESS'){
      let questionType = data.QType;
      switch(questionType){
        case 'Q':
          this.bindQuestion(data);
          return;
        case 'S':
          this.bindStatement(data);
          return;
        case 'QI':
          this.bindInput(data)
      }
    }
  }

  bindQuestion(data){
    this.setMessage(data.Message);
    this.questionOptions = data.QuestionOptions ? data.QuestionOptions : [];
    this.scrollChat();
  }

  bindStatement(data){
    this.setMessage(data.Message);
    this.getQuestion(data.NextQuestionId);
  }

  bindInput(data){
    this.setMessage(data.Message);
  }

  setMessage(msg){
    this.messages[this.messages.length - 1].text = msg;
    this.messages[this.messages.length - 1].loader = false;
  }

  onSelectQuestionOptions(data, event){
    this.questionOptions = [];
    this.getQuestion(data.QuestionOptionsId);
    console.log(data)
  }

  pushData(type, text, loader = false, undo?) {
    this.messages.push({
      'type': type,
      'text': text,
      'loader': loader,
      'undo': undo,
    })
    this.scrollChat();
  }
  dateInput = new Date();
  timeInput = new Date();
  onSelectDate(event){
    this.dateInput = event.value;
    this.userInput = moment(this.dateInput).format('DD MMMM, YYYY') + moment(this.timeInput).format(' - hh:mm A');
  }

  onSelectTime(event){
    this.timeInput = event.value;
    this.userInput = moment(this.dateInput).format('DD MMMM, YYYY') + moment(this.timeInput).format(' - hh:mm A');
  }

  scrollChat() {
    $(".messages").animate({ scrollTop: 100000 }, "fast");
  }

  checkIrene(string){
    let c = string.split(' ');
    if(c && c[0] == 'sent') return true;
    return false;
  }

}
