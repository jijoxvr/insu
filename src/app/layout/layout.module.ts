import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { TooltipModule } from "ngx-tooltip";
import { SharedModule } from "../shared/shared.module";

import { LayoutRouting } from "./layout.routing"
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LayoutContainerComponent } from './layout-container/layout-container.component';
import { DashboardModule } from "../dashboard/dashboard.module";
import { UserProfileComponent } from "../user-profile/user-profile.component";
import { IreneModule } from "../irene/irene.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    DashboardModule,
    LayoutRouting,
    IreneModule,
    TooltipModule,
    SharedModule
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    LayoutContainerComponent,
    UserProfileComponent
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent
  ]
})
export class LayoutModule { }
