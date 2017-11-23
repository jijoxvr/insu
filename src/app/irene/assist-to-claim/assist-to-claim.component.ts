import { Component, OnInit, ElementRef, AfterViewInit, ViewChild, NgZone } from '@angular/core';
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
export class AssistToClaimComponent implements OnInit, AfterViewInit {

  userData:any;
  now = new Date()
  loading: boolean;
  messages: Array<any> = [];
  dataToServer: any = {};
  userPolicies: any;
  claimReason: any;
  claimConfig: any;
  helpText = '';
  disableSubmit = true;
  disableUserInput = true;
  userInput: any;

  stageIndex = {
    stageOne: 2,
    stageTwo: 5,
  }

  userActions = {
    'selectDate': false,
    'selectPlace': false,
    'dropDown': false,
    'multiSelect' : false,
    'cameraButton': false,
    'fileUpload': false,
  }

  activeInput = '';

  claimMainReason = [];
  claimSubReason = [];
  claimDamageType = [];
  claimDamageHow = [];
  
  claimReasonGrouped = {};
  claimDamageTypeGrouped = {};
  claimDamageSubTypeGrouped = {};
  claimIssueGrouped = {};

  questionOptions = [];
  questionOptionsList = [];
  uploadProgress = 0;
  submitId = 0;


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

  ngAfterViewInit(): void{
    $('[data-toggle="tooltip"]').tooltip();
  }


  getQuestion(input){
    this.pushData('sent message loading new', null, true);
    let bfTime = moment();
    this.ajaxService.execute({body: {QuestionId: input}, method: 'POST', url:APIUrls.getQuestion}).
      subscribe(data => {
        let delay = moment.duration(moment().diff(bfTime)).asMilliseconds();
        delay = delay > 1500 ? 0 : (1500 - delay);
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
        case 'L':
          this.submitId = data.NextQuestionId;
          this.bindQuestionList(data)
          return;
        case 'S':
          this.bindStatement(data);
          return;
        case 'QI':
          this.submitId = data.NextQuestionId;
          this.bindInput(data);
          this.scrollChat();
          return;
      }
    }
  }

  bindQuestion(data){
    this.setMessage(data.Message);
    this.questionOptions = data.QuestionOptions ? data.QuestionOptions : [];
    this.scrollChat();
  }

  bindQuestionList(data){
    this.setMessage(data.Message);
    switch(data.UIControlType){
      case 'multiselect':
        this.listSubmit = true;
        this.optList = [];
        this.activeInput = 'multiSelect';
        this.userActions.multiSelect = true;
        this.questionOptionsList = data.QuestionList ? data.QuestionList : [];
        break;
      case 'dropdown':
        this.activeInput = 'dropDown';
        this.userActions.dropDown = true;
        this.questionOptionsList = data.QuestionList ? data.QuestionList : [];
        this.openDropDown();
        break;
    }
    this.scrollChat();
  }

  bindStatement(data){
    this.setMessage(data.Message);
    this.getQuestion(data.NextQuestionId);
  }

  bindInput(data){
    this.disableUserInput = false;
    this.disableSubmit = false;
    this.setMessage(data.Message);
    switch(data.UIControlType){
      case 'datetime':
        this.activeInput = 'selectDate';
        this.bindDateTime();
        return;
      case 'location-auto':
        this.activeInput = 'selectPlace';
        this.bindLocationAutoComplete();
        return;
      case 'camera':
        this.activeInput = 'cameraButton';
        this.userActions.cameraButton = true
        return;
      case 'file':
        this.activeInput = 'fileUpload';
        this.userActions.fileUpload = true;

    }
  }

  bindDateTime(){
    this.userActions.selectDate = true;
    this.userInput = moment(this.dateInput).format('DD MMMM, YYYY') + moment(this.timeInput).format(' - hh:mm A');
  }

  bindLocationAutoComplete(){
    this.userActions.selectPlace = true;
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          this.userInput = place.formatted_address;
          this.onSubmitUserInput();
        });
      });
    });
  }

  setMessage(msg){
    this.messages[this.messages.length - 1].text = msg;
    this.messages[this.messages.length - 1].loader = false;
  }

  onSelectQuestionOptions(data){
    this.questionOptions = [];
    this.getQuestion(data.QuestionOptionsId);
  }

  onSelectFromDropDown(value){
    $('.messages').removeClass('messagesContainer');
    this.onSubmitUserInput();
  }

  onSubmitUserInput(){
    if(this.listSubmit){
      this.listSubmit = false;
      this.questionOptionsList = [];
    }
    this.userActions[this.activeInput] = false;
    this.disableUserInput = true;
    this.disableSubmit = true;
    this.userInput = '';
    this.helpText = '';
    this.getQuestion(this.submitId);
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
    this.dateInput = new Date();
  }

  onSelectTime(event){
    this.timeInput = event.value;
    this.userInput = moment(this.dateInput).format('DD MMMM, YYYY') + moment(this.timeInput).format(' - hh:mm A');
    this.timeInput = new Date() 
  }

  scrollChat() {
    $(".messages").animate({ scrollTop: 100000 }, "fast");
  }

  checkIrene(string){
    let c = string.split(' ');
    if(c && c[0] == 'sent') return true;
    return false;
  }

  optList: Array<any>;
  listSubmit = false;
  onSelectOptionList(type, evt){
    this.disableSubmit = true;
    let index = this.optList.indexOf(type);
    if($(evt.target).hasClass('border-button'))
      $(evt.target).removeClass('border-button');
    else
      $(evt.target).addClass('border-button');
    
    if(index > -1)
      this.optList.splice(index, 1);
    else
      this.optList.push(type)

    this.helpText = '';
    for(let item of this.optList)
      this.helpText += item.ListName + ', ';
    this.disableSubmit = (this.optList.length == 0);
  }

  tryRecording = false;
  onSubmitVideo(video){
    this.tryRecording = false;
    $('#myModal').modal('toggle');
    this.userActions.cameraButton = false;
    let path = 'claim/' + this.dataToServer.policy + '/' + 'video' + '/' + 'video.webm';
    let storageRef = firebase.storage().ref().root.child(path);
    let uploadTask = storageRef.put(video);
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        this.uploadProgress = (uploadTask.snapshot.bytesTransferred / uploadTask.snapshot.totalBytes) * 100;
        this.scrollChat();
      }, (error) => {
        // upload failed
      }, () => {
        // upload success.
        this.dataToServer.videoUrl = uploadTask.snapshot.downloadURL;
        this.scrollChat();
        this.getQuestion(this.submitId);
      }
    );
  }

  uploadFile(){
    this.userActions.fileUpload = false;
    let uploadFile = (<HTMLInputElement>window.document.getElementById('fileid')).files[0];
    let path = 'claim/' + this.dataToServer.policy + '/police-report/' + uploadFile.name;
    let storageRef = firebase.storage().ref().root.child(path);
    let uploadTask = storageRef.put(uploadFile);
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        this.uploadProgress = (uploadTask.snapshot.bytesTransferred / uploadTask.snapshot.totalBytes) * 100;
        this.scrollChat();
      }, (error) => {
        // upload failed
          console.log('error')
      }, () => {
        // upload success
        this.dataToServer.fir = uploadTask.snapshot.downloadURL;
        this.scrollChat();
        this.getQuestion(this.submitId);
      }
    );
  }

  openDropDown(){
    setTimeout(() => {
      this.helpText = 'Please select';
      $('#dropMenu').addClass('open');
      this.preventDropDownClose();
      this.scrollChat();
    }, 500);
  }

  preventDropDownClose() {
    $('body').on('click', function (e) {
      if ($('.custom-drop').is(e.target)) {
        $('.dropup').removeClass('open');
      }
    });
    setTimeout(function(){
      $('.messages').addClass('messagesContainer');
      $(".messages").animate({ scrollTop: 100000 }, "fast");
    }, 200)
    
  }

  triggerFileUpload(){
    $('#fileid').click();
    $('#fileid').unbind('change');
    let component = this;
    $('#fileid').change(function(){
      component.uploadFile()
    })
  }

}
