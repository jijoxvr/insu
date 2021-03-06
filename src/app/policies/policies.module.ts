import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { UserPolicesComponent } from './user-polices/user-polices.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [UserPolicesComponent],
  exports: [
    UserPolicesComponent
  ]
})
export class PoliciesModule { }
