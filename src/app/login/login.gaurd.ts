import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth, } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/do';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private angularFire: AngularFireAuth, private router: Router) {}

    canActivate(): Observable<boolean> {
        return this.angularFire.authState
            .map(authState => !!authState)
            .do(authenticated => {
                if (!authenticated) {
                    this.router.navigate(['/login']);
                }
            });
    }
}