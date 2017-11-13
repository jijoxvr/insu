import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ClaimWithIreneComponent } from './claim-with-irene/claim-with-irene.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [ClaimWithIreneComponent],
  exports: [ClaimWithIreneComponent]
})
export class IreneModule { }
