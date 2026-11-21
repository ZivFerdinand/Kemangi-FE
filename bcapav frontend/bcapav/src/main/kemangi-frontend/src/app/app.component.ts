import { Component, HostListener } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderConfig, NgxUiLoaderModule } from 'ngx-ui-loader';
import { CustomLoader } from './shared';
import dayjs from 'dayjs/esm';
import { BnNgIdleService } from 'bn-ng-idle';
import { AuthService } from './core/services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from './core/services/api.service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxUiLoaderModule, CustomLoader],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'bcapav-frontend';

  @HostListener('window:beforeunload')
  unloadHandler() {
    const timeNow = dayjs().format();
    localStorage.setItem('closeBrowser', timeNow);
    sessionStorage.setItem('browserReload', 'true');
  }

  constructor(
    private readonly bnIdle: BnNgIdleService,
    private readonly authService: AuthService,
    private readonly apiService: ApiService,
    private readonly router: Router,
    private readonly toastr: ToastrService,
    private readonly modal: NgbModal,
  ) {
    this.bnIdle.startWatching(1000).subscribe((res) => {
      if (res) {
        if (localStorage.getItem(btoa('currentUser'))) {
          this.logout();
        }
      }
    });

    if (localStorage.getItem('closeBrowser')) {
      if (sessionStorage.getItem('browserReload')) {
        localStorage.removeItem('closeBrowser');
        sessionStorage.removeItem('browserReload');
      } else {
        const timeClose = localStorage.getItem('closeBrowser');
        const timeLogout = dayjs(timeClose).add(10, 'minute');
        if (timeLogout <= dayjs()) {
          this.logout();
        }
        localStorage.removeItem('closeBrowser');
      }
    }

    window.addEventListener(
      'storage',
      (event) => {
        if (event.storageArea == localStorage) {
          let token = localStorage.getItem(btoa('currentUser'));
          if (token == undefined) {
            this.router.navigate(['/login']).then(() => {
              window.location.reload();
            });
          }
        }
      },
      false,
    );
  }

  logout() {
    // this.apiService.getRevokeToken().subscribe((response: any) => {
    //   this.toastr.show(
    //     `<div class="toast-custom toast-success">
    //                   <div class="info">
    //                     <div class="icon">
    //                       <img src="./assets/img/ic-checked-rounded.svg" alt="success" />
    //                     </div>
    //                     <div class="description">
    //                       All activity has been successfully recorded
    //                     </div>
    //                     <div class="description">
    //                       Your session is expired.
    //                     </div>
    //                   </div>
    //                   <button class="close-btn">
    //                     <img src="./assets/img/ic-times.svg" alt="close" />
    //                   </button>
    //                 </div>`,
    //     '',
    //     { enableHtml: true }
    //   );
    // });
    // this.authService.logout();
    // this.router.navigate(['/login']);
    // this.modal.dismissAll();
  }
}
