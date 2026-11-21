import { CommonModule } from '@angular/common';
import { Component, Injectable, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';

import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastService } from '../../services/toast.service';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { SharedDataService } from '../../services/shared-data.service';

import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SidebarComponent,
    RouterOutlet,
    HeaderComponent,
  ],
})
@Injectable({
  providedIn: 'root',
})
export class HomeComponent implements OnInit, OnDestroy {
  profileUser: any;

  private idleTimeout: any;
  private idleTimeLimit: any;
  private lastActivityTime = Date.now();
  isSidebarCollapsed = true;

  constructor(
    private readonly router: Router,
    private readonly apiService: ApiService,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly toast: ToastService,
    private readonly authService: AuthService,
    private sharedData: SharedDataService,
  ) {}

  ngOnInit(): void {
    window.addEventListener('keydown', this.resetIdleTimer);
    window.addEventListener('click', this.resetIdleTimer);
    window.addEventListener('scroll', this.resetIdleTimer);

    this.startIdleCheck();

    if (localStorage.getItem(btoa('currentUser'))) {
      this.ngxLoader.start();
      this.apiService.getUserLogin().subscribe(
        (res: any) => {
          const data = res['data'];
          localStorage.setItem(btoa('profileUser'), btoa(JSON.stringify(data)));
          this.profileUser = data;
          this.sharedData.menus.set(data?.menuCode);
          this.sharedData.fullName.set(data?.fullName);
          this.sharedData.roleName.set(data?.roleName);
        },
        (error: any) => {
          this.ngxLoader.stop();
          if (error.type === 'error') {
            setTimeout(() => {
              this.toast.error('No Network Connection to Server');
            }, 100);
          } else {
            setTimeout(() => {
              this.toast.error('Internal Server Error');
            }, 100);
          }
        },
        () => {
          this.ngxLoader.stop();
        },
      );
    }
    if (this.router.url === '/home') {
      if (this.profileUser) {
        this.router.navigate(['home/dashboard']);
        this.ngxLoader.stop();
      } else {
        // this.noRoles();
        this.router.navigate(['home/dashboard']);
        this.ngxLoader.stop();
      }
    }

    const currentUser = this.authService.currentUserValue;

    if (currentUser) this.setIdleTimeLimit(currentUser['expires_in']);
  }

  private setIdleTimeLimit(expires_in: any) {
    this.idleTimeLimit = Number(expires_in) * 1000;
  }

  private resetIdleTimer = () => {
    this.lastActivityTime = Date.now();
  };

  private startIdleCheck() {
    this.idleTimeout = setInterval(() => {
      if (Date.now() - this.lastActivityTime > this.idleTimeLimit) {
        this.handleLogout();
      }
    }, 5000);
  }

  async handleLogout() {
    if (this.idleTimeout) clearInterval(this.idleTimeout);

    window.removeEventListener('keydown', this.resetIdleTimer);
    window.removeEventListener('click', this.resetIdleTimer);
    window.removeEventListener('scroll', this.resetIdleTimer);

    localStorage.removeItem(btoa('currentUser'));
    localStorage.removeItem(btoa('profileUser'));

    this.toast.error('Your session has been expired, please login again');

    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }

  ngOnDestroy(): void {
    if (this.idleTimeout) clearInterval(this.idleTimeout);

    window.removeEventListener('keydown', this.resetIdleTimer);
    window.removeEventListener('click', this.resetIdleTimer);
    window.removeEventListener('scroll', this.resetIdleTimer);
  }
}
