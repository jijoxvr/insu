import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Router } from "@angular/router";
import { AjaxService } from '../shared/ajax-api/ajax.service';
import { APIUrls, FacebookConfig } from '../app-config';
import * as moment from  "moment";
import { FacebookService, InitParams, LoginOptions, LoginResponse } from 'ngx-facebook';
declare var $: any;

@Component({
  selector: 'app-login-page',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css' ]
})
export class LoginComponent implements OnInit, AfterViewInit {
  
  
  public loading:boolean = false;
  private accessToken : string;
  private photoUrl : string;
  public message:string;
  public isLogged: boolean;
  
  constructor(public angularFire: AngularFireAuth, private router: Router,
    private fb: FacebookService, private ajaxService: AjaxService) {
      
      let initParams: InitParams = FacebookConfig;
      
      fb.init(initParams);
    }
    
    ngOnInit() {
      this.isLogged = false;
      this.angularFire.authState.subscribe((authenticated)=>{
        if(authenticated && localStorage.getItem('userData')){
          this.isLogged = true;
        }
      })
     
    }
    
    loginWithTwitter() {
      alert('Twitter login is not available now')
      // this.angularFire.auth.signInWithPopup(new firebase.auth.TwitterAuthProvider()).then(success=>{
      //   this.loginSuccess(success);
      // });
    }
    
    loginWithFB(){
      let provider = new firebase.auth.FacebookAuthProvider()
      provider.addScope("public_profile,user_friends,email,pages_show_list,user_birthday,user_location,user_about_me,user_education_history,user_hometown,user_location,user_photos,user_relationship_details,user_relationships,user_work_history")
      this.angularFire.auth.signInWithPopup(provider).then(success=>{
        this.loginSuccess(success);
      },error=>{
        this.handleError(error);
      });
    }
    
    loginSuccess(success) {
      // console.log(success.credential) // access token
      // console.log(success.user.refreshToken)
      // this.angularFire.idToken.subscribe(idToken=>{
      //   console.log(idToken)
      // })
      // this.loading = true;
      this.fetchDetails(success.credential.accessToken);
      let user = JSON.parse(JSON.stringify(success.user));
      this.photoUrl = success.user.photoURL
      
    }
    
    loginDirectlyToFB(){
      const loginOptions: LoginOptions = {
        enable_profile_selector: true,
        return_scopes: true,
        scope: 'public_profile,user_friends,email,pages_show_list,user_birthday,user_location,user_about_me,user_education_history,user_hometown,user_location,user_photos,user_relationship_details,user_relationships,user_work_history'
      };
      
      this.fb.login(loginOptions)
      .then((res: LoginResponse) => {
        console.log(res)
        this.fetchDetails(res.authResponse.accessToken)
      })
      .catch(this.handleError);
    }
    
    
    private fetchDetails(accesToken?) {
      
      let params = {
        access_token: accesToken,
        format: 'json',
        fields: 'id,name,email,first_name,last_name,middle_name,cover,friends.limit(1000),'+ 
            'family{relationship},relationship_status,devices,installed,is_verified,install_type,'+
            'hometown,location,birthday,gender,work,currency',
        method: 'get'
      }
      this.fb.api('/me', 'get', params).then((res: any) => {
        this.accessToken = accesToken;
        this.getUserProfileFromServer(res)
      })
      .catch(this.handleError);
    }
    
    private getUserProfileFromServer(userDetails){
      this.loading = true;
      this.message = 'Please wait while we configure your profile';
      let dataToServer = this.processDataFromFB(userDetails);
      this.ajaxService.execute({ url: APIUrls.loginWithFB, method: 'post', body: dataToServer })
      .subscribe(data =>{
        this.loading = false;
        let response = data.Details[0];
        if(!response.ProfileLink)
          response.ProfileLink = 'https://firebasestorage.googleapis.com/v0/b/insureturn-1509529454175.appspot.com/o/girlie.png?alt=media&token=22cd090a-11d3-4ba4-b64e-5f33d1739530';
        localStorage.setItem('userData', JSON.stringify(response));
        this.router.navigate(['dashboard']);
      }, error=>{
        localStorage.clear();
        this.message = "Unable to login"
      })
      
    }
    
    private handleError(error) {
      this.loading = false;
      this.message = 'Unable to complete login process'
    }
    
    private processDataFromFB(dataToServer){
      let returnToServer = {
        Name: dataToServer.name,
        Email: dataToServer.email,
        Cover: dataToServer.cover ? dataToServer.cover.source : "",
        FirstName: dataToServer.first_name,
        LastName: dataToServer.last_name,
        MiddleName: dataToServer.middle_name,
        AccessToken: this.accessToken,
        UniqueId: dataToServer.id,
        UsersLevel_Id: "1", // hard-coded temporarly
        Facebook_Birthday: dataToServer.birthday,
        // BirthDay: dataToServer.birthday ?  moment(dataToServer.birthday, 'DD/MM/YY').date() : "",
        // BirthMonth: dataToServer.birthday ? moment(dataToServer.birthday, 'DD/MM/YY').month() + 1 : "",
        // BirthYear: dataToServer.birthday ? moment(dataToServer.birthday, 'DD/MM/YY').year() : "",
        Facebook_Gender: dataToServer.gender,
        Facebook_ProfLink: this.photoUrl,
        Facebook_InstallType : dataToServer.install_type,
        Facebook_Installed : dataToServer.installed ? 'True' : 'False',
        Facebook_IsVerified : dataToServer.is_verified ? 'True' : 'False',
        Facebook_Currency : dataToServer.currency ? dataToServer.currency.user_currency : "",
        Facebook_HomeTown : dataToServer.hometown ? dataToServer.hometown.name : "",
        Facebook_HomeTownUniqueId : dataToServer.hometown ? dataToServer.hometown.id : "",
        Location: dataToServer.location ?  {
          locationId : dataToServer.location.id,
          locationName : dataToServer.location.name
        } : {},
        Employer :dataToServer.work ?  this.extractWorkFromFBData(dataToServer.work) : [],
        FriendsData :dataToServer.friends ?  this.extractFriendsFromFBData(dataToServer.friends) : [],
        Family :dataToServer.family ?  this.extractFriendsFromFBData(dataToServer.family) : []
        
      }
      return returnToServer;
    }

    extractFriendsFromFBData(data){
      if(data.data) data = data.data
        else return []
          let returnData = data.map(item=>{
        return item ? {
          FriendsUniqueId: item.id
        } : {}
      })
      return returnData 
    }
    
    extractWorkFromFBData(data){
      let returnData = data.map(item=>{
        return item.employer ? {
          employerName : item.employer.name,
          EmployerUniqueId: item.employer.id
        } : {}
      })
      return returnData 
    }
    
    extractFamilyFromFBData(data){
      
      let returnData = data.map(item=>{
        return item.employer ? {
          FamilyUniqueId : item.family.id,
          Relationship: item.family.relation
        } : {}
      })
      return returnData 
    }
    
    ngAfterViewInit(){
      $(window).on("scroll", function () {
        if ($(this).scrollTop() > 100) {
          $("nav").addClass("not-transparent");
        }
        else {
          $("nav").removeClass("not-transparent");
        }
      });
      
      $('header').css({ 'height': $(window).height() });
      $(window).on('resize', function() {
        $('header').css({ 'height': $(window).height() });
      });
      this.scrollNav()
    }
    
    scrollNav(){
      let component = this;
      $('.nav a').click(function(){  
        //Toggle Class
        component.openSidenav();
        $(".active").removeClass("active");      
        $(this).closest('li').addClass("active");
        var theClass = $(this).attr("class");
        $('.'+theClass).parent('li').addClass('active');
        //Animate
        $('html, body').stop().animate({
          scrollTop: $( $(this).attr('href') ).offset().top - 160
        }, 1000);
        return false;
      });
      $('.scrollTop a').scrollTop();
    }
    
    openSidenav(){
      let isOpened = $('.navbar-collapse').hasClass('in');
      if(isOpened) $('.navbar-collapse').removeClass('in');
      else $('.navbar-collapse').addClass('in');
    }
    
    
  }
  