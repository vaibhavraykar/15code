import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router){} 

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken && refreshToken !== '' ) {
                // authorised so return true
                return true;
            }
    
            // not logged in so redirect to login page with the return url
            this.router.navigateByUrl('auth/login');
            return false;
        }
  
}
