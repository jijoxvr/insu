import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserPolicesComponent } from './user-polices/user-polices.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [UserPolicesComponent],
  exports: [
    UserPolicesComponent
  ]
})
export class PoliciesModule { }
