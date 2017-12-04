import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { DatePickerModule } from "angular-io-datepicker";
import { OverlayModule } from "angular-io-overlay";

import { FacebookModule } from 'ngx-facebook';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { AgmCoreModule } from '@agm/core';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { Uploader }      from 'angular2-http-file-upload';

import { AppRouting } from './app.routing';
import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';

import { AuthGuard } from './login/login.gaurd';
import { AppConfigService } from "./core/app-config.service";
import { MasterResolver, UserResolver } from "./core/app-provider.service";
import { UserServiceService } from "./core/user-service.service";

import { LoginComponent } from './login/login.component';
import { FirebaseConfig, GoogleMapConfig } from "./app-config";

export const firebaseConfig = FirebaseConfig;

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,

  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpModule,
    RouterModule,
    AppRouting,
    SharedModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AgmCoreModule.forRoot(GoogleMapConfig),
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 20,
      outerStrokeWidth: 10,
      innerStrokeWidth: 8,
      outerStrokeColor: "#ff386a",
      innerStrokeColor: "rgba(255, 56, 102, 0.3)",
      animationDuration: 0,
    }),
    FacebookModule.forRoot(),
  ],
  providers: [
    AngularFireAuth,
    AuthGuard,
    UserServiceService,
    UserResolver,
    MasterResolver,
    AppConfigService,
    Uploader
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
