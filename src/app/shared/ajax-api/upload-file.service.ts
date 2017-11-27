import { Injectable } from '@angular/core';
import { UploadItem }    from 'angular2-http-file-upload';
import { AppConfig } from "../../app-config"

export class UploadModal extends UploadItem{

  constructor(file: any, url:string) {
    super();
    this.url = AppConfig.apiBaseUrl + url;
    this.file = file;
  }

}
