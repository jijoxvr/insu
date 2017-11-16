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

import { AppRouting } from './app.routing';
import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';

import { AuthGuard } from './login/login.gaurd';
import { AppConfigService } from "./core/app-config.service";
import { MasterResolver, UserResolver } from "./core/app-provider.service";
import { UserServiceService } from "./core/user-service.service";

import { LoginComponent } from './login/login.component';

export const firebaseConfig = {
  apiKey: "AIzaSyDJDnfIoQlMg-IBn_m5wA_5QHcejP2Bszg",
  authDomain: "insureturn-1509529454175.firebaseapp.com",
  databaseURL: "https://insureturn-1509529454175.firebaseio.com",
  projectId: "insureturn-1509529454175",
  storageBucket: "insureturn-1509529454175.appspot.com",
  messagingSenderId: "21098362152"
};

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
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyCA0wo7qYwenWNCWUsBhkmWGRQBI2CiqoM",
      libraries: ["places"]
    }),
    FacebookModule.forRoot(),
  ],
  providers: [
    AngularFireAuth,
    AuthGuard,
    UserServiceService,
    UserResolver,
    MasterResolver,
    AppConfigService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
