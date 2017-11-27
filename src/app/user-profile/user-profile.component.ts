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
    $('#' + id).change(()=>{
      this.uploadFile(id)
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

  uploadFile(id){
      let component = this;
      var reader = new FileReader();
      reader.onload = function() {
        console.log(this.result)
        let arrayBuffer = this.result;
        let array = new Uint8Array(arrayBuffer);
        let binaryString = String.fromCharCode.apply(null, array);
        console.log(binaryString);
        console.log('her')
        let data = {
          UserId: '10090',
          DocumentName : 'test',
          DocumentType : "1",
          Document: array
        }
        component.ajaxService.execute({method: 'POST', body: binaryString, url: APIUrls.uploadUserDoc})
          .subscribe(data=>{
            console.log('here')
          })
      }
      let uploadFile = (<HTMLInputElement>window.document.getElementById(id)).files[0];
      // reader.readAsArrayBuffer(uploadFile);
      
      

      let myUploadItem = new UploadModal(uploadFile, APIUrls.uploadUserDoc);
      myUploadItem.formData = { 
        UserId: '10090',
        DocumentName : 'test',
        DocumentType : "1",
      };  // (optional) form data can be sent with file

      this.uploaderService.onSuccessUpload = (item, response, status, headers) => {
          // success callback
          console.log('here')
      };
      this.uploaderService.onErrorUpload = (item, response, status, headers) => {
          // error callback
          console.log('h1')
      };
      this.uploaderService.onCompleteUpload = (item, response, status, headers) => {
          // complete callback, called regardless of success or failure
          console.log('h2')
      };

      this.uploaderService.upload(myUploadItem);
  }


}
