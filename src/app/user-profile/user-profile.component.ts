import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UserServiceService } from "../core/user-service.service";
import { AjaxService } from "../shared/ajax-api/ajax.service";
import { AppLabels, APIUrls } from "../app-config";
import { Uploader }      from 'angular2-http-file-upload';
import { UploadModal }  from '../shared/ajax-api/upload-file.service';
declare var $: any;

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, AfterViewInit {

  public userData: any;
  public viewMode = true;
  public loading = false;
  constructor(public userServiceService: UserServiceService,
    public ajaxService: AjaxService, public uploaderService: Uploader) {
    this.userServiceService.userObservable.subscribe(user => {
      this.userData = JSON.parse(JSON.stringify(user));
    })
    this.userServiceService.getUserInfo();
    console.log(this.userData)
  }

  ngOnInit() {

  }
  ngAfterViewInit(): void {

  }

  triggerFileUpload(id) {
    $('#' + id).click();
    $('#' + id).unbind('change');
    $('#' + id).change((event)=>{
      let type = $(event.target).attr('data-type');
      this.uploadFile(id, type);
    })
  }

  editProfile() {
    this.viewMode = false;
  }

  submitProfile(){
    this.loading = true;
    this.ajaxService.execute({ url: APIUrls.updateProfile, method: 'POST', body: this.userData })
      .subscribe(response => {
        if (response.Status == 'SUCCESS' && response.Details.length > 0) {
          let user = Object.assign(this.userData, response.Details[0])
          this.userServiceService.updateUser(user);
        }
        this.loading = false;
        this.viewMode = true;
      })
  }

  uploadFile(id, type?){
      let component = this;
      
      let uploadFile = (<HTMLInputElement>window.document.getElementById(id)).files[0];
    
      
      let myUploadItem = new UploadModal(uploadFile, APIUrls.uploadUserDoc);
      myUploadItem.formData = { 
        DocumentUserId: component.userData.UserId,
        DocumentType : type,
      };  // (optional) form data can be sent with file
      
      this.uploaderService.onSuccessUpload = (item, response, status, headers) => {
          // success callback
          this.toogleLoader(id);
      };
      this.uploaderService.onErrorUpload = (item, response, status, headers) => {
          // error callback
          this.toogleLoader(id);
      };
      this.uploaderService.onCompleteUpload = (item, response, status, headers) => {
          // complete callback, called regardless of success or failure
      };
      this.uploaderService.onProgressUpload = (item, percentComplete) => {
        // progress callback
        // console.log(percentComplete)
      };
      this.toogleLoader(id);
      this.uploaderService.upload(myUploadItem);
  }

  toogleLoader(id){
    let element = $('#'+id).parent();
    console.log(element.find('button'));
    console.log(element.find('i'));
    if(element.find('i').hasClass('fa-file')){
      element.find('button').attr('disabled', true);
      element.find('i').removeClass('fa-file');
      element.find('i').addClass('fa-spinner fa-spin');
    }else{
      element.find('button').removeAttr('disabled');
      element.find('i').removeClass('fa-spinner fa-spin');
      element.find('i').addClass('fa-file');
    }
  }

}
