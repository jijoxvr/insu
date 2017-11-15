import { Component, OnInit } from '@angular/core';
import { UserServiceService } from "../../core/user-service.service";
import { AppConfigService } from "../../core/app-config.service";
import { AjaxService } from "../../shared/ajax-api/ajax.service";
import { AppLabels, APIUrls } from "../../app-config";
import { trigger, transition, style, animate } from "@angular/animations";
import { Observable } from 'rxjs/Observable';
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
  dataToServer: any;
  userData: any;
  userPolicies: any;
  claimReason: any;
  claimConfig: any;
  helpText = '';
  disableSubmit = false;

  stageIndex = {
    stageOne: 2,
    stageTwo: 5,
  }

  userActions = {
    'purpose': false,
    'claimType': false,
    'claimReason': false,
    'confirmACDR': false,
    'selectDamageType': false,
    'selectDamageHow': false,
    'warrantyConfirm': false,
    'selectDate': false,
    'selectTime': false,
  }

  claimMainReason = [];
  claimSubReason = [];
  claimDamageType = [];
  claimDamageHow = [];
  
  claimReasonGrouped = {};
  claimDamageTypeGrouped = {};
  claimDamageSubTypeGrouped = {};
  claimIssueGrouped = {};

  constructor(public userServiceService: UserServiceService,
    public ajaxService: AjaxService, private appConfigService: AppConfigService) {
    this.userServiceService.userObservable.subscribe(user => {
      this.userData = user;
    })
    this.claimConfig = appConfigService.claimReason;
    this.userServiceService.getUserInfo();
    this.loading = true;
    this.userData.UserId = 10057;
    let serverCall = [
      this.ajaxService.execute({
        method: 'POST', url: APIUrls.insuranceList,
        body: { userId: this.userData.UserId }
      }),
      this.ajaxService.execute({ method: 'GET', url: APIUrls.claimReason }),
    ]
    Observable.forkJoin(...serverCall).subscribe(results => {
      console.log(results)
      this.userPolicies = results[0].Details ? results[0].Details : [];
      this.claimReason = results[1].Details ? results[1].Details : [];
      this.extractClaimReason(this.claimReason);
      this.loading = false;
      this.stageOne();
    });

  }

  //Welcoming user

  stageOne(time = 2000) {
    this.messages = [];
    let component = this;
    component.pushData('sent message loading new', null, true);
    setTimeout(function () {
      component.messages[component.messages.length - 1].text = AppLabels.irene.irene1.
        replace('USER_NAME', component.userData.FirstName);
      component.messages[component.messages.length - 1].loader = false;
      component.scrollChat();
      setTimeout(function () {
        component.stageOneA();
      }, 1500)
    }, 1500, this);

  }

  // Showing assistance message

  stageOneA(time = 2000) {
    let component = this;
    component.pushData('sent message loading new', null, true);
    setTimeout(function () {
      component.messages[component.messages.length - 1].text = AppLabels.irene.irene2;
      component.messages[component.messages.length - 1].loader = false;
      component.userActions.purpose = true;
      component.scrollChat();
    }, 1500);
  }

  // On choosing claim

  onClaimChoice() {
    let component = this;
    component.userActions.purpose = false;
    component.pushData('replies', AppLabels.irene.rep1, false, true);
    component.pushData('sent message loading new', null, true);
    component.scrollChat();
    setTimeout(function () {
      component.messages[component.messages.length - 1].text = AppLabels.irene.irene3;
      component.messages[component.messages.length - 1].loader = false;
      component.scrollChat();
      setTimeout(function () {
        component.helpText = 'Please select your policy';
        $('#claimSelect').addClass('open');
        component.preventDropDownClose();
        component.scrollChat();
      }, 1500);
    }, 1500);
  }

  // User selects policy for claim 

  onSelectPolicy(policy) {
    $('.messages').removeClass('messagesContainer');
    let component = this;
    component.helpText = '';
    component.pushData('replies', AppLabels.irene.rep2.replace('DEVICE_NAME', policy.Device), false, true);
    component.pushData('sent message loading new', null, true);
    component.scrollChat();
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
    component.userActions.claimType = false;
    component.pushData('replies', AppLabels.irene.rep3.replace('DAMAGE_TYPE', type.label), false, true);
    component.pushData('sent message loading new', null, true);
    component.scrollChat();
    component.claimSubReason = component.claimReasonGrouped[type.value.id];
    setTimeout(function () {
      component.messages[component.messages.length - 1].text = AppLabels.irene.irene5
      component.messages[component.messages.length - 1].loader = false;
      component.userActions.claimReason = true;
      component.scrollChat();
    }, 1500);
  }

  //On choosing Accidental damage repaire / Accidental damage replace / Liquid damage 

  claimType:any;
  onClaimReasonChoice(type){
    let component = this;
    component.claimType = type;
    component.userActions.claimReason = false;
    component.pushData('replies', AppLabels.irene.rep4.replace('REASON', type.label), false, true);
    component.pushData('sent message loading new', null, true);
    component.scrollChat();
    if(type.value.code == component.claimConfig.ACCIDENTAL_DAMAGE_REPLACE){
      component.onAccidentalDamageReplace(type);
    }else{
      component.continueWithClaim();
    }
  }

  //On choosing Accidental damage replace

  onAccidentalDamageReplace(type){
    let component = this;
    setTimeout(function () {
      component.messages[component.messages.length - 1].text = AppLabels.irene.irene6;
      component.messages[component.messages.length - 1].loader = false;
      component.userActions.confirmACDR = true;
      component.scrollChat();
    }, 1500);
  }

  //On confirming Accidental damage replace (Imei blocking)

  onAccidentalDamageReplaceConfirm(confirmed){
    let component = this;
    component.userActions.confirmACDR = false;
    if(confirmed){
      component.pushData('replies', AppLabels.irene.rep5a, false, true);
      component.pushData('sent message loading new', null, true);
      component.scrollChat();
      component.continueWithClaim();
    }
  }

  // Continue with claim after confirmation or choosing claim reason

  continueWithClaim(){
    let component = this;
    let type = component.claimDamageTypeGrouped[component.claimType.value.id];
    if(type){
      component.askAboutDamageType(type);
    }else{
      component.askMobileIsUnderWarranty();
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

  onSend(type){
    this.helpText = '';
    if(type == 'SUBMIT_DAMAGE'){
      this.onSubmitDamageType()
    }
  }

  //On user selects damage type(part) as how it occured or continue with claim
  onSubmitDamageType(){
    let component = this;
    component.userActions.selectDamageType = false;
    let text = '';
    for(let item of component.types)
      text += item.label + ', ';
    component.pushData('replies', AppLabels.irene.rep6.replace('DAMAGE_PART', text), false, true);
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
    component.userActions.selectDamageHow = false;
    component.pushData('replies', AppLabels.irene.rep7.replace('HOW', how.label), false, true);
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
    component.userActions.warrantyConfirm = false;
    component.pushData('replies', confirm ? AppLabels.irene.rep8 : AppLabels.irene.rep9, false, true);
    component.pushData('sent message loading new', null, true);
    component.scrollChat();
    component.askAboutDateOfIncident();
    
  }

  askAboutDateOfIncident(){
    let component = this;
    setTimeout(function () {
      component.messages[component.messages.length - 1].text = AppLabels.irene.irene10;
      component.messages[component.messages.length - 1].loader = false;
      component.userActions.selectDate = true;
      component.scrollChat();
    }, 1500);
  }
  occurenceDate:any;
  occurenceTime:any;
  onSelectDate(event){
    this.userActions.selectDate = false;
    this.helpText = event.value;
    this.occurenceDate = event.value;
    this.userActions.selectTime = true;
  }

  onSelectTime(event){
    this.occurenceTime = event.value;
    this.helpText = this.occurenceDate + ('-' + event.value);
  }

  ngOnInit() {}

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
      case 1:
        this.stageOne(); return;
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

  
}
