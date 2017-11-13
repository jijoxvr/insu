import { Component, OnInit } from '@angular/core';
import { UserServiceService } from "../../core/user-service.service";
import { AppLabels } from "../../app-config";
declare var $: any;

@Component({
  selector: 'app-claim-with-irene',
  templateUrl: './claim-with-irene.component.html',
  styleUrls: ['./claim-with-irene.component.css']
})
export class ClaimWithIreneComponent implements OnInit {

  messages: Array<any> = [];
  dataToServer: any;
  userData:any;
  stageIndex = {
    stageOne : 2,
    stageTwo : 5,
  } 

  userActions = {
    'purpose': false,
    'claimType': false
  }

  constructor(public userServiceService: UserServiceService) {
    this.userServiceService.userObservable.subscribe(user => {
        this.userData = user;
    })
    this.userServiceService.getUserInfo();
    this.stageOne();
    
  }

  stageOne(){
    this.messages = []
    this.pushData('sent', AppLabels.irene.irene1.replace('USER_NAME', this.userData.FirstName));
    this.pushData('sent', AppLabels.irene.irene2);
    this.userActions.purpose = true;
    this.scrollChat(); 
  }

  onClaimChoice(){
    this.pushData('replies', AppLabels.irene.rep1, 1);
    this.userActions.purpose = false;
    this.pushData('sent', AppLabels.irene.irene3); 
    this.pushData('sent', AppLabels.irene.irene4);
    this.userActions.claimType = true;
    this.scrollChat();
  }

  onClaimTypeChoice(){
    this.pushData('replies', AppLabels.irene.rep1, 1);
  }

  ngOnInit() {
  }

  pushData(type, text, undo?){
    this.messages.push({
      'type': type,
      'text': text,
      'undo' : undo
    })
  }

  undoChat(stage){
    switch(stage){
      case 1:
        this.stageOne();return;
    }
  }

  scrollChat(){
    $(".messages").animate({ scrollTop: $(document).height() }, "fast");
  }

  makeCopy(data){
    return JSON.parse(JSON.stringify(data));
  }
}
