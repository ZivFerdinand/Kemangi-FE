// src/app/helpers/error.interceptor.ts

import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { Observable, throwError } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { AuthService } from "../services/auth.service";
import { environment } from "../../environments/environment";
import { ToastrService } from "ngx-toastr";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FailedModal } from "../../shared";
import { SKIP_ERROR_INTERCEPTOR } from "./skip-interceptor.token";
import { FailedModalEventService } from "../../shared/services/failed-modal-event.service";
import { SKIP_GLOBAL_ERROR } from "./error-context.token";

export const errorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const service: AuthService = inject(AuthService);
  const failedModalEventService = inject(FailedModalEventService);

  const router: Router = inject(Router);

  const base_URL = `${environment.API_KEY}`;
  const modalHolder = "modal-holder";

  // Request yang secara khusus tidak ingin diproses oleh interceptor
  if (req.context.get(SKIP_ERROR_INTERCEPTOR)) {
    return next(req);
  }

  return next(req).pipe(
    catchError((err) => {
      const toastr: ToastrService = service.gToastr;
      const modalService: NgbModal = service.gModal;
      const ngxLoader: NgxUiLoaderService = service.gNgxLoader;

      let data = null;
      let errorMessage;

      errorMessage = err;

      const storedUser = localStorage.getItem(btoa("currentUser"));

      if (storedUser) {
        data = JSON.parse(atob(storedUser));
      }

      const skipGlobalHandling = req.context.get(SKIP_GLOBAL_ERROR);

      if (!skipGlobalHandling) {
        /*
         * ============================================================
         * 401 UNAUTHORIZED
         * ============================================================
         *
         * Sebelumnya:
         *
         * 401
         * -> obtainRefreshToken()
         * -> location.reload()
         *
         * Sekarang:
         *
         * 401
         * -> obtainRefreshToken()
         * -> update token
         * -> retry request sebelumnya
         *
         * Jadi halaman/modal tidak perlu di-reload.
         */
        if (err.status === 401) {
          ngxLoader.stop();

          if (data) {
            return service.obtainRefreshToken().pipe(
              switchMap((response: any) => {
                /*
                 * obtainRefreshToken() sudah menyimpan user/token baru
                 * ke localStorage dan currentUserSubject.
                 *
                 * Kita menggunakan access_token dari response
                 * untuk mengulang request yang sebelumnya 401.
                 */
                if (response?.access_token) {
                  const newReq = req.clone({
                    setHeaders: {
                      Authorization: `Bearer ${response.access_token}`,
                    },
                  });

                  // Retry request awal dengan access token baru
                  return next(newReq);
                }

                // Refresh berhasil tetapi tidak mendapatkan access token
                return throwError(() => err);
              }),

              /*
               * Kalau refresh token gagal:
               * -> logout
               * -> tutup modal
               * -> arahkan ke login
               */
              catchError((refreshError) => {
                setTimeout(() => {
                  if (service.currentUserValue) {
                    toastr.show(
                      `<div class="toast-custom toast-success">
<div class="info">
<div class="icon">
<img src="./assets/img/ic-checked-rounded.svg" alt="success" />
</div>
<div class="description">
All activity has been successfully recorded.
Your session is expired.
</div>
</div>
<button class="close-btn">
<img src="./assets/img/ic-times.svg" alt="close" />
</button>
</div>`,
                      "",
                      { enableHtml: true },
                    );
                  }

                  service.logout(true);

                  if (modalService.hasOpenModals()) {
                    modalService.dismissAll("force closed");
                  }
                }, 100);

                location.replace("/#/login");

                return throwError(() => refreshError);
              }),
            );
          } else {
            /*
             * Tidak ada current user/session.
             * Langsung arahkan ke login.
             */
            setTimeout(() => {
              if (service.currentUserValue) {
                toastr.show(
                  `<div class="toast-custom toast-success">
<div class="info">
<div class="icon">
<img src="./assets/img/ic-checked-rounded.svg" alt="success" />
</div>
<div class="description">
All activity has been successfully recorded.
Your session is expired.
</div>
</div>
<button class="close-btn">
<img src="./assets/img/ic-times.svg" alt="close" />
</button>
</div>`,
                  "",
                  { enableHtml: true },
                );
              }

              service.logout(true);

              if (modalService.hasOpenModals()) {
                modalService.dismissAll("force closed");
              }
            }, 100);

            location.replace("/#/login");

            return throwError(() => err);
          }
        } else if (err.status === 400) {

        /*
         * ============================================================
         * 400 BAD REQUEST
         * ============================================================
         */
          if (
            req.url !== `${base_URL}/workflow-sequence/check-wf-seq-name` &&
            !req.url.includes(`${base_URL}/workflow/`)
          ) {
            setTimeout(() => {
              const modalRef = modalService.open(FailedModal, {
                scrollable: true,
                windowClass: modalHolder,
                centered: true,
              });

              modalRef.componentInstance.errorCode = err.error.statusCode;

              modalRef.componentInstance.message = err.error.message;

              modalRef.result.then((result) => {
                if (result === true) {
                  failedModalEventService.emit(err.error.message);
                }
              });
            }, 100);
          }

          if (req.url.includes(`${base_URL}/workflow/`)) {
            errorMessage = err;
          }
        } else if (err.status === 403) {

        /*
         * ============================================================
         * 403 FORBIDDEN
         * ============================================================
         */
          if (!req.url.includes(`${base_URL}/workflow/`)) {
            setTimeout(() => {
              const modalRef = modalService.open(FailedModal, {
                scrollable: true,
                windowClass: modalHolder,
                centered: true,
              });

              modalRef.componentInstance.errorCode = 403;
              modalRef.componentInstance.message = "Access is denied";
              modalRef.componentInstance.title = "Sorry";
            }, 100);
          }
        } else if (err.status === 404) {

        /*
         * ============================================================
         * 404 NOT FOUND
         * ============================================================
         */
          if (!req.url.includes(`${base_URL}/workflow/`)) {
            setTimeout(() => {
              err.error.errorMessages?.forEach((element: any) => {
                toastr.show(
                  `<div class="toast-custom toast-failed">
<div class="info">
<div class="icon">
<img src="./assets/img/ic-times-rounded.svg" alt="error" />
</div>
<div class="description">
${element.message}
</div>
</div>

<button class="close-btn">
<img src="./assets/img/ic-times.svg" alt="close" />
</button>
</div>`,
                  "",
                  { enableHtml: true },
                );
              });
            }, 100);
          }

          errorMessage = err;
        } else if (err.status === 0) {

        /*
         * ============================================================
         * 0 NETWORK ERROR
         * ============================================================
         */
          ngxLoader.stop();

          setTimeout(() => {
            toastr.show(
              `<div class="toast-custom toast-failed">
<div class="info">
<div class="icon">
<img src="./assets/img/ic-times-rounded.svg" alt="error" />
</div>
<div class="description">
No Network Connection to Server
</div>
</div>

<button class="close-btn">
<img src="./assets/img/ic-times.svg" alt="close" />
</button>
</div>`,
              "",
              { enableHtml: true },
            );
          }, 100);
        } else if (err.status === 500) {

        /*
         * ============================================================
         * 500 INTERNAL SERVER ERROR
         * ============================================================
         */
          ngxLoader.stop();

          setTimeout(() => {
            toastr.show(
              `<div class="toast-custom toast-failed">
<div class="info">
<div class="icon">
<img src="./assets/img/ic-times-rounded.svg" alt="error" />
</div>
<div class="description">
Internal Server Error
</div>
</div>

<button class="close-btn">
<img src="./assets/img/ic-times.svg" alt="close" />
</button>
</div>`,
              "",
              { enableHtml: true },
            );
          }, 100);
        }
      }

      return throwError(() => errorMessage);
    }),
  );
};
