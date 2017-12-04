import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from '../dashboard/dashboard.component';
import { ClaimWithIreneComponent } from '../irene/claim-with-irene/claim-with-irene.component';
import { AssistToClaimComponent } from '../irene/assist-to-claim/assist-to-claim.component';
import { UserProfileComponent } from '../user-profile/user-profile.component';

import {LayoutContainerComponent} from "./layout-container/layout-container.component";

const routesTest:Routes = [{
    path: '', component: LayoutContainerComponent,
    children: [
        { path: 'irene',      component: AssistToClaimComponent },
        { path: 'dashboard',      component: DashboardComponent },
        { path: 'user-profile',   component: UserProfileComponent },
        { path: '',               redirectTo: 'dashboard', pathMatch: 'full' },
        
    ]}
]

const routes: Routes =[
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: '',               redirectTo: 'dashboard', pathMatch: 'full' }
];

export const LayoutRouting = RouterModule.forChild(routesTest)

