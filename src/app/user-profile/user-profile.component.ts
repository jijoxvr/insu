import { Component, OnInit } from '@angular/core';
import { UserServiceService } from "../core/user-service.service";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  public userData:any;
  constructor(public userServiceService: UserServiceService) {
    this.userServiceService.userObservable.subscribe(user => {
      this.userData = user;
    })
    this.userServiceService.getUserInfo();
    console.log(this.userData)
  }

  ngOnInit() {
  
  }

}
