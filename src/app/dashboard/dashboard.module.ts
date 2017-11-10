import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// import { SharedModule } from "../shared/shared.module";
import { DashboardComponent } from "./dashboard.component";
import { PoliciesModule } from "../policies/policies.module";
import { ClaimsModule } from "../claims/claims.module";

@NgModule({
  imports: [
    CommonModule,
    PoliciesModule,
    ClaimsModule
    
  ],
  declarations: [
    DashboardComponent,
  ],
  exports: [
      DashboardComponent,
  ]
})
export class DashboardModule { }
