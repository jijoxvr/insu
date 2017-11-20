import { Injectable } from '@angular/core';
import { UploadItem }    from 'angular2-http-file-upload';
import { AppConfig } from "../../app-config"

export class UploadFileService extends UploadItem{

  constructor(file: any) {
    super();
    this.url = AppConfig.uploadFile;
    this.file = file;
  }

}
