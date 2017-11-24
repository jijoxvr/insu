import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from "./login/login.component";
import { AuthGuard } from "./login/login.gaurd";
import { ModuleWithProviders } from "@angular/core";
import { MasterResolver, UserResolver } from "./core/app-provider.service";

export const routes: Routes = [{
    path: '',
    loadChildren : "./layout/layout.module#LayoutModule",
    canActivate: [AuthGuard],
    resolve: {
        user: UserResolver,
    }

    },{
      path: 'login',
      component: LoginComponent
    },{
      path: 'admin-login',
      component: LoginComponent
    }

];


export const AppRouting: ModuleWithProviders =
     RouterModule.forRoot(routes, {useHash: true});
