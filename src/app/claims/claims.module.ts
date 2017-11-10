import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupClaimStatusComponent } from './group-claim-status/group-claim-status.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [GroupClaimStatusComponent],
  exports: [
    GroupClaimStatusComponent
  ]
})
export class ClaimsModule { }
