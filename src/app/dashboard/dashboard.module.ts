import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyPipe, DatePipe } from '@angular/common';

import { SharedModule } from "../shared/shared.module";
import { DashboardComponent } from "./dashboard.component";
import { PoliciesModule } from "../policies/policies.module";
import { ClaimsModule } from "../claims/claims.module";

@NgModule({
  imports: [
    CommonModule,
    PoliciesModule,
    ClaimsModule,
    SharedModule
  ],
  declarations: [
    DashboardComponent,
  ],
  providers: [
    CurrencyPipe, DatePipe
  ],
  exports: [
      DashboardComponent,
  ]
})
export class DashboardModule { }
