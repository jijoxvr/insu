import { Component, OnInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { UserServiceService } from "../../core/user-service.service";
import { MapsAPILoader } from '@agm/core';
import { } from 'googlemaps';
import { AppConfigService } from "../../core/app-config.service";
import { AjaxService } from "../../shared/ajax-api/ajax.service";
import { AppLabels, APIUrls } from "../../app-config";
import { trigger, transition, style, animate } from "@angular/animations";
import { Observable } from 'rxjs/Observable';
import * as moment from "moment";
import 'rxjs/add/observable/forkJoin';
declare var $: any;

@Component({
  selector: 'app-claim-with-irene',
  templateUrl: './claim-with-irene.component.html',
  styleUrls: ['./claim-with-irene.component.css', './chat-box.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: '0' }),
        animate('.1s ease-out', style({ opacity: '1' })),
      ]),
    ]),
    trigger('zoomInUp1', [
      transition('* => *', [
        animate(0, style({ transform: 'scale3d(.1, .1, .1) translate3d(0, 1000px, 0)', opacity: '0', offset: 0 })),
        animate(500, style({ transform: 'scale3d(.475, .475, .475) translate3d(0, -60px, 0)', opacity: '1', offset: 0.6 })),
        animate(200, style({ transform: 'none', opacity: '1', offset: 1 }))
      ])
    ]),
    trigger('zoomInUp2', [
      transition('* => *', [
        animate(0, style({ transform: 'scale3d(.1, .1, .1) translate3d(0, 1000px, 0)', opacity: '0', offset: 0 })),
        animate(1000, style({ transform: 'scale3d(.475, .475, .475) translate3d(0, -60px, 0)', opacity: '1', offset: 0.6 })),
        animate(200, style({ transform: 'none', opacity: '1', offset: 1 }))
      ])
    ]),
    trigger('bounceInUp', [
      transition('* => *', [
        animate(100, style({ transform: 'translate3d(0, 3000px, 0)', opacity: '0', offset: 0 })),
        animate(100, style({ transform: 'translate3d(0, -25px, 0)', opacity: '1', offset: 0.6 })),
        animate(100, style({ transform: 'translate3d(0, 100px, 0)', offset: 0.75 })),
        animate(100, style({ transform: 'translate3d(0, -5px, 0)', offset: 0.9 })),
        animate(100, style({ transform: 'translate3d(0, 0, 0)', opacity: '1', offset: 1 }))
      ])
    ]),
  ],
})
export class ClaimWithIreneComponent implements OnInit {

  now = new Date()
  loading: boolean;
  messages: Array<any> = [];
  dataToServer: any = {};
  userData: any;
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
    'selectPlace': false
  }

  claimMainReason = [];
  claimSubReason = [];
  claimDamageType = [];
  claimDamageHow = [];
  
  claimReasonGrouped = {};
  claimDamageTypeGrouped = {};
  claimDamageSubTypeGrouped = {};
  claimIssueGrouped = {};

  @ViewChild("search")
  public searchElementRef: ElementRef;

  constructor(public userServiceService: UserServiceService,
    public ajaxService: AjaxService, private appConfigService: AppConfigService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone) {
    this.userServiceService.userObservable.subscribe(user => {
      this.userData = user;
    })
    this.claimConfig = appConfigService.claimReason;
    this.userServiceService.getUserInfo();
    this.loading = true;
    let serverCall = [
      this.ajaxService.execute({
        method: 'POST', url: APIUrls.insuranceList,
        body: { userId: this.userData.UserId }
      }),
      this.ajaxService.execute({ method: 'GET', url: APIUrls.claimReason }),
    ]
    Observable.forkJoin(...serverCall).subscribe(results => {
      this.userPolicies = results[0].Details ? results[0].Details : [];
      this.claimReason = results[1].Details ? results[1].Details : [];
      this.extractClaimReason(this.claimReason);
      this.loading = false;
      this.welcomeUser();
    });

  }

  initMapAutoComplete(){
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
          this.onSubmitPlace(autocomplete.getPlace());
        });
      });
    });
  }

  //Welcoming user

  welcomeUser(time = 2000) {
    this.messages = [];
    let component = this;
    component.pushData('sent message loading new', null, true);
    setTimeout(function () {
      component.messages[component.messages.length - 1].text = AppLabels.irene.irene1.
        replace('USER_NAME', component.userData.FirstName);
      component.messages[component.messages.length - 1].loader = false;
      component.scrollChat();
      setTimeout(function () {
        component.askUserAboutPurpose();
      }, 1500)
    }, 1500, this);

  }

  // Showing assistance message Activate/Claim...(purpose of meeting irene)

  askUserAboutPurpose(time = 2000) {
    let component = this;
    component.pushData('sent message loading new', null, true);
    setTimeout(function () {
      component.messages[component.messages.length - 1].text = AppLabels.irene.irene2;
      component.messages[component.messages.length - 1].loader = false;
      component.userActions.purpose = true;
      component.scrollChat();
    }, 1500);
  }

  // When user select claiming as purpose of visit...
  index = 0;
  onClaimChoice() {
    let component = this;
    component.userActions.purpose = false;
    component.pushData('replies', AppLabels.irene.rep1, false, false);
    component.pushData('sent message loading new', null, true);
    component.scrollChat();
    component.index = 1
    component.askUserToSelectPolicy();
    
  }

  //Activated policies are listed and ask used to select from list...

  askUserToSelectPolicy(delay=1500){
    let component = this;
    setTimeout(function () {
      component.messages[component.messages.length - 1].text = AppLabels.irene.irene3;
      component.messages[component.messages.length - 1].loader = false;
      component.scrollChat();
      setTimeout(function () {
        component.helpText = 'Please select your policy';
        $('#claimSelect').addClass('open');
        component.preventDropDownClose();
        component.scrollChat();
      }, delay);
    }, delay);
  }

  // When user select policy for claiming

  onSelectPolicy(policy) {
    $('.messages').removeClass('messagesContainer');
    let component = this;
    component.dataToServer.policy = policy.Insurance_Id;
    component.helpText = '';
    component.pushData('replies', AppLabels.irene.rep2.replace('DEVICE_NAME', policy.Device),
                 false, 'ASK_TO_SELECT_POLICY');
    component.pushData('sent message loading new', null, true);
    component.scrollChat();
    component.askUserWhatHappened();
    
  }

  // Ask user what really happened (Damage or Loss)
  askUserWhatHappened(){
    let component = this;
    setTimeout(function () {
      component.messages[component.messages.length - 1].text = AppLabels.irene.irene4.
        replace('USER_NAME', component.userData.FirstName);
      component.messages[component.messages.length - 1].loader = false;
      component.userActions.claimType = true;
      component.scrollChat();
    }, 1500);
    
  }

  //On choosing damage/lost

  onClaimTypeChoice(type){
    let component = this;
    component.dataToServer.mainType = {id:type.value.id, code:type.value.code, label:type.label};
    component.userActions.claimType = false;
    component.pushData('replies', AppLabels.irene.rep3.replace('DAMAGE_TYPE', type.label), 
                false, 'ASK_USER_WHAT_HPND');
    component.pushData('sent message loading new', null, true);
    component.scrollChat();
    component.claimSubReason = component.claimReasonGrouped[type.value.id];
    component.askUserAboutClaimReason();
  }

  //Ask user about subIssue (Damage Sub Category and Lost Sub Category)

  askUserAboutClaimReason(){
    let component = this;
    setTimeout(function () {
      component.messages[component.messages.length - 1].text = AppLabels.irene.irene5
      component.messages[component.messages.length - 1].loader = false;
      component.userActions.claimReason = true;
      component.scrollChat();
    }, 1500);
  }

  //On choosing Damage Sub Category 
  //Or on choosing Lost Sub Category
  claimType:any;
  onClaimReasonChoice(type){
    let component = this;
    component.dataToServer.subType = {id:type.value.id, code:type.value.code, label:type.label};
    component.claimType = type;
    component.userActions.claimReason = false;
    component.pushData('replies', AppLabels.irene.rep4.replace('REASON', type.label),
         false, 'ASK_USER_CLAIM_REASON');
    component.pushData('sent message loading new', null, true);
    component.scrollChat();
    if(type.value.code == component.claimConfig.ACCIDENTAL_DAMAGE_REPLACE ||
      component.dataToServer.mainType.code == component.claimConfig.LOST){
        component.askUserToConfirmIMEIBlockage(type);
    }else{
      component.continueWithClaim();
    }
  }

  //On choosing Accidental damage replace or any type of lost

  askUserToConfirmIMEIBlockage(type){
    let component = this;
    setTimeout(function () {
      component.messages[component.messages.length - 1].text = AppLabels.irene.irene6;
      component.messages[component.messages.length - 1].loader = false;
      component.userActions.confirmIMEI = true;
      component.scrollChat();
    }, 1500);
  }

  //On confirming Imei blocking)

  onConfirmingIMEIBlockage(confirmed){
    let component = this;
    component.userActions.confirmIMEI = false;
    if(confirmed){
      component.pushData('replies', AppLabels.irene.rep5a, false, 'ASK_USER_IMEI_BLCK');
      component.pushData('sent message loading new', null, true);
      component.scrollChat();
      component.continueWithClaim();
    }else{
      component.pushData('replies', AppLabels.irene.rep5b, false, 'ASK_USER_IMEI_BLCK');
      component.pushData('sent message loading new', null, true);
      component.scrollChat();
      let message = AppLabels.irene.irene14.replace('XXXX', component.dataToServer.subType.label);
      component.askToContactCustomerCare(message);
    }
  }

  // Continue with claim after imei confirmation or choosing claim reason

  continueWithClaim(){
    let component = this;
    let type = component.claimDamageTypeGrouped[component.claimType.value.id];
    if(type){
      component.askAboutDamageType(type);
    }else{
      // Assuming that LOST category has no damage type and damage how 
      if(component.dataToServer.mainType.code != component.claimConfig.LOST)
        component.askMobileIsUnderWarranty();
      else
        component.askAboutDateOfIncident();
    }
   
  }

  askAboutDamageType(type){
    let component = this;
    setTimeout(function () {
      component.messages[component.messages.length - 1].text = AppLabels.irene.irene7;
      component.messages[component.messages.length - 1].loader = false;
      component.userActions.selectDamageType = true;
      component.claimDamageType = type;
      component.types = [];
      component.helpText = '';
      component.scrollChat();
    }, 1500);
  }

  types: Array<any>;
  submitType = '';
  onSelectDamageType(type, evt){
    this.disableSubmit = true;
    let index = this.types.indexOf(type);

    if($(evt.target).hasClass('border-button'))
      $(evt.target).removeClass('border-button');
    else
      $(evt.target).addClass('border-button');
    
    if(index > -1)
      this.types.splice(index, 1);
    else
      this.types.push(type)

    this.helpText = '';
    for(let item of this.types)
      this.helpText += item.label + ', ';
    this.disableSubmit = (this.types.length == 0);
    this.submitType = 'SUBMIT_DAMAGE';
  }

  onSend(){
    this.helpText = '';
    if(this.submitType == 'SUBMIT_DAMAGE'){
      this.onSubmitDamageType();
    }else if(this.submitType == 'SUBMIT_DATE'){
      this.onSubmitDateAndTime();
    }else if(this.submitType == 'SUBMIT_PLACE'){
      let event = $.Event('keypress');
      event.which = 13;
      $('#googleAutoComplete').trigger(event);
    }
  }

  //On user selects damage type(part) as how it occured or continue with claim
  onSubmitDamageType(){
    let component = this;
    component.userActions.selectDamageType = false;
    let text = '';
    for(let item of component.types)
      text += item.label + ', ';
    component.pushData('replies', AppLabels.irene.rep6.replace('DAMAGE_PART', text), false, 'ASK_USER_DMG_TYPE');
    component.pushData('sent message loading new', null, true);
    component.scrollChat();
    let how = component.claimDamageSubTypeGrouped[component.types[0].value.id];
    if(how){
      component.askHowDamageOccured(how);
    }else{
      component.askMobileIsUnderWarranty();
    }
  }

  askHowDamageOccured(how){
    let component = this;
    setTimeout(function () {
      component.messages[component.messages.length - 1].text = AppLabels.irene.irene8;
      component.messages[component.messages.length - 1].loader = false;
      component.userActions.selectDamageHow = true;
      component.claimDamageHow = how;
      setTimeout(function () {
        component.helpText = 'Please tell how it occures';
        $('#claimHowSelect').addClass('open');
        component.preventDropDownClose();
        component.scrollChat();
      }, 1500);
      component.scrollChat();
    }, 1500);
  }

  // On select How damage has occured
  onSelectHowDamaged(how){
    $('.messages').removeClass('messagesContainer');
    let component = this;
    component.helpText = '';
    component.dataToServer.how = {id:how.value.id, code:how.value.code};
    component.userActions.selectDamageHow = false;
    component.pushData('replies', AppLabels.irene.rep7.replace('HOW', how.label), false, 'ASK_USER_HOW_DMG');
    component.pushData('sent message loading new', null, true);
    component.scrollChat();
    component.askMobileIsUnderWarranty();
  }

  askMobileIsUnderWarranty(){
    let component = this;
    setTimeout(function () {
      component.messages[component.messages.length - 1].text = AppLabels.irene.irene9;
      component.messages[component.messages.length - 1].loader = false;
      component.userActions.warrantyConfirm = true;
      component.scrollChat();
    }, 1500);
  }

  // On warranty is confirmed
  confirmWarranty(confirm){
    let component = this;
    component.dataToServer.hasWarranty = confirm;
    component.userActions.warrantyConfirm = false;
    component.pushData('replies', confirm ? AppLabels.irene.rep8 : AppLabels.irene.rep9, false, 'ASK_USER_CNFRM_WARNTY');
    component.pushData('sent message loading new', null, true);
    component.scrollChat();
    component.askAboutDateOfIncident();
    
  }
  occurenceDate = new Date();
  occurenceTime = new Date();

  askAboutDateOfIncident(){
    let component = this;
    setTimeout(function () {
      component.messages[component.messages.length - 1].text = AppLabels.irene.irene10;
      component.messages[component.messages.length - 1].loader = false;
      component.userActions.selectDate = true;
      component.disableUserInput = false;
      component.userInput = moment(component.occurenceDate).format('DD MMMM, YYYY') + moment(component.occurenceTime).format(' - hh:mm A');
      component.scrollChat();
      component.submitType = 'SUBMIT_DATE';
    }, 1500);
  }
  
  onSelectDate(event){
    this.occurenceDate = event.value;
    this.userInput = moment(this.occurenceDate).format('DD MMMM, YYYY') + moment(this.occurenceTime).format(' - hh:mm A');
  }

  onSelectTime(event){
    this.occurenceTime = event.value;
    this.userInput = moment(this.occurenceDate).format('DD MMMM, YYYY') + moment(this.occurenceTime).format(' - hh:mm A');
  }


  onSubmitDateAndTime(){
    let component = this;
    component.disableUserInput = true;
    component.userActions.selectDate = false;
    component.pushData('replies', AppLabels.irene.rep10.replace('DATE_TIME', component.userInput), false, 'ASK_USER_DATE_TIME');
    component.pushData('sent message loading new', null, true);
    component.userInput = '';
    component.scrollChat();
    if(component.dataToServer.mainType.code == component.claimConfig.LOST)
      component.askPlaceOfIncident();
    else
      component.askConfirmationOnDeductable();
  }

  askConfirmationOnDeductable(){
    let component = this;
    setTimeout(function () {
      component.messages[component.messages.length - 1].text = AppLabels.irene.irene11.
        replace('AMOUNT', '123');
      component.messages[component.messages.length - 1].loader = false;
      component.userActions.confirmDeductable = true;
      component.scrollChat();
    }, 1500);
  }

  onConfirmDeductable(confirmed){
    let component = this;
    component.userActions.confirmDeductable = false;
    if(confirmed){
      component.pushData('replies', AppLabels.irene.rep11a, false, 'ASK_USER_CNFRM_DEDUCTABLE');
      component.pushData('sent message loading new', null, true);
      component.scrollChat();
      component.askToUploadSelfieVideo();
    }else{
      component.pushData('replies', AppLabels.irene.rep11b, false, 'ASK_USER_CNFRM_DEDUCTABLE');
      component.pushData('sent message loading new', null, true);
      component.scrollChat();
      let message = AppLabels.irene.irene15.replace('XXXX', '123');
      component.askToContactCustomerCare(message);
    }
  }

  askToUploadSelfieVideo(){
    let component = this;
    setTimeout(function () {
      component.messages[component.messages.length - 1].text = AppLabels.irene.irene12;
      component.messages[component.messages.length - 1].loader = false;
      component.userActions.uploadSelfieVideo = true;
      component.scrollChat();
    }, 1500);
  }

  askPlaceOfIncident(){
    let component = this;
    setTimeout(function () {
      component.messages[component.messages.length - 1].text = AppLabels.irene.irene13;
      component.messages[component.messages.length - 1].loader = false;
      component.initMapAutoComplete();
      component.submitType = 'SUBMIT_PLACE';
      component.scrollChat();
    }, 1500);
  }

  onSubmitPlace(place){
    let component = this;
    component.dataToServer.place = place;
    component.pushData('replies', AppLabels.irene.rep12.replace('INCCIDENT_PLACE', component.userInput), false, 'ASK_USER_PLACE_INCDNT');
    component.userActions.selectPlace = false;
    component.userInput = '';
    component.pushData('sent message loading new', null, true);
    component.scrollChat();
    component.askConfirmationOnDeductable();
  }


  showRecordingScreen(){

  }

  askToContactCustomerCare(message){
    let component = this;
    setTimeout(function () {
      component.messages[component.messages.length - 1].loader = false;
      component.messages[component.messages.length - 1].text = message;
      component.scrollChat();
    }, 1500);
  }

  ngOnInit() {
    
    
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

  undoChat(stage) {
    switch (stage) {
      case 'ASK_TO_SELECT_POLICY':
        this.pushData('sent message loading new', null, true);
        this.askUserToSelectPolicy(0);
        return;
      case 'ASK_TO_SELECT_POLICY':
        this.welcomeUser(); return;
      case 'ASK_TO_SELECT_POLICY':
        this.welcomeUser(); return;
      case 'ASK_TO_SELECT_POLICY':
        this.welcomeUser(); return;
      case 'ASK_TO_SELECT_POLICY':
        this.welcomeUser(); return;
      case 'ASK_TO_SELECT_POLICY':
        this.welcomeUser(); return;
      case 'ASK_TO_SELECT_POLICY':
        this.welcomeUser(); return;
      case 'ASK_TO_SELECT_POLICY':
        this.welcomeUser(); return;
      case 'ASK_TO_SELECT_POLICY':
        this.welcomeUser(); return;
      case 'ASK_TO_SELECT_POLICY':
        this.welcomeUser(); return;
    }
  }

  extractClaimReason(data) {

    let claimMainReasonDict = {}
    let claimSubReasonDict = {}
    let claimDamageTypeDict = {}
    let claimDamageSubTypeDict = {}
    for (let item of data) {
      if (this.claimReasonGrouped[item.Issue_Id]){
        if(!claimSubReasonDict[item.Issue_Id][item.IssueSub_Id]){
          claimSubReasonDict[item.Issue_Id][item.IssueSub_Id] = true;
          this.claimReasonGrouped[item.Issue_Id].push({ value: { id: item.IssueSub_Id, code: item.IssueSub_Code }, label: item.IssueSub_Name });
        }
      }
      else{
        claimSubReasonDict[item.Issue_Id] = {}
        claimSubReasonDict[item.Issue_Id][item.IssueSub_Id] = true;
        this.claimReasonGrouped[item.Issue_Id] = [{ value: { id: item.IssueSub_Id, code: item.IssueSub_Code }, label: item.IssueSub_Name }];
      }
      if(item.IssueDamageType_Id){
        if(this.claimDamageTypeGrouped[item.IssueSub_Id]){
          if(!claimDamageTypeDict[item.IssueSub_Id][item.IssueDamageType_Id]){
            this.claimDamageTypeGrouped[item.IssueSub_Id].
              push({ value: { id: item.IssueDamageType_Id, code: item.IssueDamageType_Code }, label: item.IssueDamageType_Name });
              claimDamageTypeDict[item.IssueSub_Id][item.IssueDamageType_Id] = true;
          }
        }else{
          claimDamageTypeDict[item.IssueSub_Id] = {};
          claimDamageTypeDict[item.IssueSub_Id][item.IssueDamageType_Id] = true;
          this.claimDamageTypeGrouped[item.IssueSub_Id] = 
            [{ value: { id: item.IssueDamageType_Id, code: item.IssueDamageType_Code }, label: item.IssueDamageType_Name }];
        }
        if(item.IssueDamageTypeSub_Id){
          if(this.claimDamageSubTypeGrouped[item.IssueDamageType_Id]){
            if(!claimDamageSubTypeDict[item.IssueDamageType_Id][item.IssueDamageTypeSub_Id]){
              this.claimDamageSubTypeGrouped[item.IssueDamageType_Id].
                push({ value: { id: item.IssueDamageTypeSub_Id, code: item.IssueDamageTypeSub_Code }, label: item.IssueDamageTypeSub_How });
              claimDamageSubTypeDict[item.IssueDamageType_Id][item.IssueDamageTypeSub_Id] = true;
            }
          }else{
            claimDamageSubTypeDict[item.IssueDamageType_Id] = {};
            claimDamageSubTypeDict[item.IssueDamageType_Id][item.IssueDamageTypeSub_Id] = true;
            this.claimDamageSubTypeGrouped[item.IssueDamageType_Id] = 
              [{ value: { id: item.IssueDamageTypeSub_Id, code: item.IssueDamageTypeSub_Code }, label: item.IssueDamageTypeSub_How }];
          }
        }
      }
      
      claimMainReasonDict[item.Issue_Id] = { label: item.Issue_Name, code: item.Issue_Code };
    }

    console.log(this.claimReasonGrouped)
    console.log(this.claimDamageTypeGrouped)
    console.log(this.claimDamageSubTypeGrouped)
    
    Object.keys(claimMainReasonDict).forEach(key => {
      this.claimMainReason.push({ value: { id: key, code: claimMainReasonDict[key].code }, label: claimMainReasonDict[key].label })
    });

  }

  scrollChat() {
    $(".messages").animate({ scrollTop: 100000 }, "fast");
  }

  makeCopy(data) {
    return JSON.parse(JSON.stringify(data));
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
  checkAnimation(a, b){
    return a==b;
  }

  checkIrene(string){
    let c = string.split(' ');
    if(c && c[0] == 'sent') return true;
    return false;
  }
}
