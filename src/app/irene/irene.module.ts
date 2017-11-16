import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ClaimWithIreneComponent } from './claim-with-irene/claim-with-irene.component';
import { DateTimePickerModule } from 'ng-pick-datetime';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    DateTimePickerModule
  ],
  declarations: [ClaimWithIreneComponent],
  exports: [ClaimWithIreneComponent]
})
export class IreneModule { }
