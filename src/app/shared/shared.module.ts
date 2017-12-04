import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { TooltipModule } from "ngx-tooltip";
import { VideoRecordComponent } from './video-record/video-record.component';

import { AjaxService } from "./ajax-api/ajax.service";
import { WebSocketService } from "./socket/web-socket.service";
import { ChatService } from "./socket/chat.service";
import { JsonApiService } from "./ajax-api/json-api.service";
import { WebStorageService } from "./ajax-api/web-storage.service";
import { ByteFormatPipe } from './pipes/byte-format.pipe';
import { TimeLineComponent } from './time-line/time-line.component';
import { LoaderComponent } from './loader/loader.component';

@NgModule({
  imports: [
    CommonModule,
    TooltipModule
  ],
  declarations: [
    VideoRecordComponent,
    ByteFormatPipe,
    TimeLineComponent,
    LoaderComponent
  ],
  exports: [
    VideoRecordComponent,
    ByteFormatPipe,
    TimeLineComponent,
    LoaderComponent
  ],
  providers:[
    AjaxService,
    JsonApiService,
    WebSocketService,
    ChatService,
    WebStorageService,
    CookieService,
    CurrencyPipe,
    ByteFormatPipe,
    DatePipe,
  ]
})
export class SharedModule { }
