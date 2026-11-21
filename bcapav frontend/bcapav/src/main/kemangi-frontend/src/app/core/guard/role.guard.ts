import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authService.currentUserValue;
    let profileUser: User | null = null;
    const localStorageItem = localStorage.getItem(btoa('profileUser'));
    if (localStorageItem) {
      try {
        profileUser = JSON.parse(atob(localStorageItem));
      } catch (e) {
        profileUser = null;
      }
    }
    if (currentUser) {
      if (profileUser) {
        if (
          route.data['menuCode'] &&
          profileUser.menuCode.indexOf(route.data['menuCode']) === -1
        ) {
          if (profileUser.menuCode.includes('USER')) {
            this.router.navigate(['home/users']);
          } else {
            this.router.navigate(['home']);
          }

          return false;
        }
      }
      return true;
    }
    return false;
  }
}
