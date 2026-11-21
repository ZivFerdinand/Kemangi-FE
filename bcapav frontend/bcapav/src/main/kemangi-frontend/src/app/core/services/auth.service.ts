import { Injectable } from "@angular/core";
import { User } from "../models/user";
import { environment } from "../../environments/environment";
import { BehaviorSubject, map, Observable } from "rxjs";
import { Router } from "@angular/router";
// import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ToastrService } from "ngx-toastr";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { HttpClient, HttpHeaders, HttpContext } from "@angular/common/http";
import { SKIP_ERROR_INTERCEPTOR } from "../helpers/skip-interceptor.token";
import { SharedDataService } from "./shared-data.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  base_URL = `${environment.API_KEY}`;
  private readonly currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(
    private readonly httpClient: HttpClient,
    private readonly router: Router,
    private readonly toastr: ToastrService,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly modal: NgbModal,
    private sharedData: SharedDataService
  ) {
    let currentUser: User | null = null;
    const localStorageItem = localStorage.getItem(btoa("currentUser"));
    if (localStorageItem) {
      try {
        currentUser = JSON.parse(atob(localStorageItem));
      } catch (e) {
        currentUser = null;
      }
    }
    this.currentUserSubject = new BehaviorSubject<User | null>(currentUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    if (this.currentUserSubject && localStorage.getItem(btoa("currentUser"))) {
      return this.currentUserSubject.value;
    } else {
      return null;
    }
  }

  public get gToastr(): ToastrService {
    return this.toastr;
  }
  public get gNgxLoader(): NgxUiLoaderService {
    return this.ngxLoader;
  }
  public get gModal(): NgbModal {
    return this.modal;
  }
  obtainAccessToken(loginData: User) {
    const body =
      `username=${encodeURIComponent(loginData.username)}&` +
      `password=${encodeURIComponent(loginData.password)}&`;

    const headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
      Authorization: "Basic " + btoa("pavo_ng_client:s3cr3t"),
    });

    return this.httpClient
      .post(`${this.base_URL}/auth/login`, body, { headers })
      .pipe(
        map((data) => {
          const user = data as User;

          localStorage.setItem(btoa("currentUser"), btoa(JSON.stringify(user)));
          this.currentUserSubject.next(user);
          return data;
        }),
      );
  }

  //ada changes disini ya
  obtainRefreshToken() {
    const body = {
      refresh_token: this.currentUserValue?.refresh_token,
    };

    const context = new HttpContext().set(SKIP_ERROR_INTERCEPTOR, true);

    return this.httpClient
      .post(`${this.base_URL}/auth/refresh`, body, { context })
      .pipe(
        map((data) => {
          const user = data as User;

          localStorage.setItem(btoa("currentUser"), btoa(JSON.stringify(user)));

          this.currentUserSubject.next(user);

          return user;
        }),
      );
  }

  async logout(alreadyUnauthorized: boolean = false) {
    this.ngxLoader.start();
    if (!alreadyUnauthorized) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.currentUserValue?.access_token}`,
      });
      this.httpClient
        .post(`${this.base_URL}/auth/logout`, { headers })
        .pipe(map((data) => { }))
        .subscribe(
          (res: any) => { },
          (err) => { },
          () => {
            this.currentUserSubject.next(null);

            this.ngxLoader.stop();
          },
        );
    } else {
      this.currentUserSubject.next(null);
      this.ngxLoader.stop();
    }
    localStorage.removeItem(btoa("currentUser"));
    localStorage.removeItem(btoa("profileUser"));
    this.sharedData.menus.set(null);
    this.sharedData.fullName.set(null);
    this.sharedData.roleName.set(null);

    this.ngxLoader.stop();
  }
}
