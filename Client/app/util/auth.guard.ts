import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        console.log('canActivate called');

        if (localStorage.getItem('ObjectIdentifier')) {
            // logged in so return true
            console.log('Object Identifier found');
            return true;
        }

        console.log('Object Identifier not  found');
        // not logged in so redirect to login page with the return url
        
        window.location.href = 'Login';
        return false;
    }
}

