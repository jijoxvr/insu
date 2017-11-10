import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";

import { LayoutRouting } from "./layout.routing"
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LayoutContainerComponent } from './layout-container/layout-container.component';
import { DashboardModule } from "../dashboard/dashboard.module";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    DashboardModule,
    LayoutRouting
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    LayoutContainerComponent
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent
  ]
})
export class LayoutModule { }
