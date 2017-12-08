import { Component, OnInit, ElementRef, AfterViewInit, ViewChild, NgZone } from '@angular/core';
import { UserServiceService } from "../../core/user-service.service";
import { MapsAPILoader } from '@agm/core';
import { } from 'googlemaps';
import { ChatService } from '../../shared/socket/chat.service';
import { AppConfigService } from "../../core/app-config.service";
import { AjaxService } from "../../shared/ajax-api/ajax.service";
import { AppLabels, APIUrls } from "../../app-config";
import { trigger, transition, style, animate } from "@angular/animations";
import { Observable } from 'rxjs/Observable';
import { Uploader }      from 'angular2-http-file-upload';
import { UploadModal }  from '../../shared/ajax-api/upload-file.service';
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
  playRecording = false;

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
    'goToDashboard': false,
    'numericInput': false,
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

  answerId = 0;
  answerList = [];
  manualInput = "";
  claimId = 0;


  @ViewChild("search")
  public searchElementRef: ElementRef;
  
  constructor(public userServiceService: UserServiceService,
    public ajaxService: AjaxService, private appConfigService: AppConfigService,
    private mapsAPILoader: MapsAPILoader,private ngZone: NgZone,
    public uploaderService: Uploader,
    //  private chat: ChatService
    ) { 
      this.userServiceService.userObservable.subscribe(user => {
        this.userData = user;
      })
      this.userServiceService.getUserInfo();
  }

  ngOnInit() {
    this.getQuestion(0);
    // this.chat.messages.subscribe(msg => {
    //   console.log(msg);
    // })
  }

  ngAfterViewInit(): void{
    
    $('[data-toggle="tooltip"]').tooltip();
  }

  sendMessage(message) {
    // this.chat.sendMsg(message);
  }


  getQuestion(input, answer?, play?){
    if(answer) this.pushData('replies', answer, false, 'ASK_TO_UPLOAD_SELFIE_VIDEO', play);
    this.pushData('sent message loading new', null, true);
    let bfTime = moment();
    let dataToServer = {
      QuestionId: input,
      AnswerId: this.answerId,
      Claim_ManualInput: this.manualInput,
      AnswerList : this.answerList,
      Claim_Id : this.claimId,
      SqlId: this.userData.UserId
    }
    this.sendMessage(dataToServer);
    this.ajaxService.execute({body: dataToServer, method: 'POST', url:APIUrls.getQuestion}).
      subscribe(data => {
        let delay = moment.duration(moment().diff(bfTime)).asMilliseconds();
        delay = delay > 1500 ? 0 : (1500 - delay);
        setTimeout(() => {
          this.answerId = data.QuestionId;
          this.answerList = [];
          this.manualInput = "";
          this.claimId = data.Claim_Id;
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
        case 'QU':
          if(data.Message)
            this.setMessage(data.Message);
          else
            this.messages.pop();
          this.userActions.goToDashboard = true;
          this.scrollChat();
      }
    }
  }

  restrictToNumericInput(){
    $('#userInputField').unbind('keypress');
    $('#userInputField').bind('keypress', function(evt){
      var charCode = (evt.which) ? evt.which : evt.keyCode
      if (charCode > 31 && (charCode < 48 || charCode > 57))
          return false;
      return true;
    })
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
        this.openDropDown('dropMenu');
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
    if(data.Message)
      this.setMessage(data.Message);
    else
      this.messages.pop();
    switch(data.UIControlType){
      case 'datetime':
        this.activeInput = 'selectDate';
        this.bindDateTime();
        this.disableUserInput = true;
        return;
      case 'location-auto':
        this.restrictToNumericInput();
        this.activeInput = 'selectPlace';
        this.initGoogleMapAutoComplete();
        this.disableSubmit = true;
        return;
      case 'camera':
        this.activeInput = 'cameraButton';
        this.userActions.cameraButton = true
        this.disableUserInput = true;
        this.disableSubmit = true;
        return;
      case 'file':
        this.activeInput = 'fileUpload';
        this.userActions.fileUpload = true;
        this.disableUserInput = true;
        this.disableSubmit = true;
      case 'numeric':
        this.restrictToNumericInput();
    }
  }

  bindDateTime(){
    this.userActions.selectDate = true;
    this.userInput = moment(this.dateInput).format('DD MMMM, YYYY') + moment(this.timeInput).format(' - hh:mm A');
  }

  initGoogleMapAutoComplete(){
    this.userActions.selectPlace = true;
    this.mapsAPILoader.load().then(() => {
      setTimeout(()=>{
        let input = this.searchElementRef.nativeElement;
        let service = new google.maps.places.AutocompleteService();
        $(input).on('keyup', ()=> {
          var inputData = $(input).val();
          if(inputData)
            service.getPlacePredictions({input: inputData}, callBack);
          else
            callBack([], 200)
        })
      });
    });
    let component = this
    function callBack(predictions, status){
      component.locations = [];
      if(predictions){
        for(let item of predictions){
          component.locations.push(item.description)
        }
        component.openDropDown('dropMenuAutoComplete');
      }else{
        $('#dropMenuAutoComplete').removeClass('open');
        $('.messages').removeClass('messagesContainer');
      }
    }

  }

  locations = []

  onSelectLocations(data){
    $('.messages').removeClass('messagesContainer');
    this.resetInput();
    this.manualInput = data;
    this.getQuestion(this.submitId, data);
  }

  setMessage(msg){
    this.messages[this.messages.length - 1].text = msg;
    this.messages[this.messages.length - 1].loader = false;
  }

  onSelectQuestionOptions(data){
    this.questionOptions = [];
    this.answerList.push({ListId: data.QuestionOptionsId});
    this.getQuestion(data.QuestionOptionsId, data.QuestionOptionsName);
  }

  onSelectFromDropDown(value){
    $('.messages').removeClass('messagesContainer');
    this.resetInput();
    this.answerList.push({ListId: value.ListId});
    this.getQuestion(this.submitId, value.ListName);
  }

  onSubmitUserInput(data?){
    $('#userInputField').unbind('keypress');
    data = data ? data : this.userInput ? this.userInput : "";
    if(this.listSubmit){
      this.listSubmit = false;
      this.questionOptionsList = [];
      data = ''
      for(let item of this.optList){
        data += item.ListName + ', ';
        this.answerList.push({ListId: item.ListId})
      }   
    }else{
      this.manualInput = data;
    }
    this.resetInput();
    this.getQuestion(this.submitId, data);
  }

  resetInput(){
    this.userActions[this.activeInput] = false;
    this.disableUserInput = true;
    this.disableSubmit = true;
    this.userInput = '';
    this.helpText = '';
  }

  pushData(type, text, loader = false, undo?, play?) {
    this.messages.push({
      'type': type,
      'text': text,
      'loader': loader,
      'undo': undo,
      'play': play
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

  undoChat(stage, slice) {

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
    if(video){
      this.userActions.cameraButton = false;
      let path = 'claim/' + this.claimId + '/' + this.submitId + '/' + 'video.webm';
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
          this.manualInput = uploadTask.snapshot.downloadURL;
          this.scrollChat();
          this.getQuestion(this.submitId, 'video submitted', true);
        }
      );
    }
    
  }

  uploadFile(){
    this.userActions.fileUpload = false;
    let uploadFile = (<HTMLInputElement>window.document.getElementById('fileid')).files[0];
    let path = 'claim/' + this.claimId + '/' + this.submitId + '/' + uploadFile.name;
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
        this.manualInput = uploadTask.snapshot.downloadURL;
        this.scrollChat();
        this.getQuestion(this.submitId, uploadFile.name);
      }
    );
  }

  openDropDown(id){
    setTimeout(() => {
      this.helpText = 'Please select';
      $('#'+id).addClass('open');
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

  stopPlaying(){
    this.playRecording = false;
  }

}
