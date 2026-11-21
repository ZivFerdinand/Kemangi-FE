import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../models/user';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FailedModal } from '../../shared';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly modalService: NgbModal,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authService.currentUserValue;
    let profileUser: User | null = null;

    if (localStorage.getItem(btoa('profileUser'))) {
      const localStorageItem = localStorage.getItem(btoa('profileUser'));
      if (localStorageItem) {
        try {
          profileUser = JSON.parse(atob(localStorageItem));
        } catch (e) {
          profileUser = null;
        }
      }
    }

    if (currentUser) {
      if (profileUser) {
        const routeMenuCode = route.data['menuCode'];
        let menuCodes: string[] = [];

        if (Array.isArray(routeMenuCode)) {
          menuCodes = routeMenuCode;
        } else if (typeof routeMenuCode === 'string') {
          menuCodes = [routeMenuCode];
        }
        const hasAccess = menuCodes.some((code) =>
          profileUser.menuCode.includes(code),
        );

        if (route.data['menuCode'] && !hasAccess) {
          this.router.navigate(['home/dashboard']);
          const modalRef = this.modalService.open(FailedModal, {
            scrollable: true,
            windowClass: 'modal-holder',
            centered: true,
          });
          modalRef.componentInstance.errorCode = 403;
          modalRef.componentInstance.title = 'Sorry';
          modalRef.componentInstance.message = 'Access is denied';
          return false;
        }
      }
      return true;
    }

    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });

    return false;
  }
}
