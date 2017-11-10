import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { CurrencyPipe, DatePipe } from '@angular/common';

import { VideoRecordComponent } from './video-record/video-record.component';

import { AjaxService } from "./ajax-api/ajax.service";
import { JsonApiService } from "./ajax-api/json-api.service";
import { WebStorageService } from "./ajax-api/web-storage.service";
import { ByteFormatPipe } from './pipes/byte-format.pipe';
import { TimeLineComponent } from './time-line/time-line.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    VideoRecordComponent,
    ByteFormatPipe,
    TimeLineComponent
  ],
  exports: [
    VideoRecordComponent,
    ByteFormatPipe,
    TimeLineComponent
  ],
  providers:[
    AjaxService,
    JsonApiService,
    WebStorageService,
    CookieService,
    CurrencyPipe,
    ByteFormatPipe,
    DatePipe
  ]
})
export class SharedModule { }
