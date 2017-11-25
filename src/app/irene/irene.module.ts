import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";

import { SharedModule } from '../shared/shared.module';
import { ClaimWithIreneComponent } from './claim-with-irene/claim-with-irene.component';
import { DateTimePickerModule } from 'ng-pick-datetime';
import { FormsModule } from '@angular/forms';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { AssistToClaimComponent } from './assist-to-claim/assist-to-claim.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    RouterModule,
    DateTimePickerModule,
    NgCircleProgressModule
  ],
  declarations: [ClaimWithIreneComponent, AssistToClaimComponent],
  exports: [ClaimWithIreneComponent]
})
export class IreneModule { }
