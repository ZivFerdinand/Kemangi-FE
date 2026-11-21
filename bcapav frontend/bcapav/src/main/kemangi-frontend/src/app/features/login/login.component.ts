import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../core/models/user';
import { AuthService } from '../../core/services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../core/services/api.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isSubmitted = false;
  error = '';
  show = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly service: AuthService,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly toastr: ToastrService,
    private readonly apiService: ApiService
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    let parsedUser: User | null = null;
    const encodedUser = localStorage.getItem(btoa('currentUser'));
    if (encodedUser) {
      try {
        parsedUser = JSON.parse(atob(encodedUser));
      } catch (e) {
        parsedUser = null;
      }
    }

    if (parsedUser) {
      this.router.navigate(['/home']);
    }
  }

  get formControls() {
    return this.loginForm.controls;
  }

  login() {
    this.isSubmitted = true;

    if (this.loginForm.invalid) {
      this.error = 'Username or Password Invalid';
      return;
    }

    const data = this.loginForm.value;
    if (data.username && data.password) {
      this.ngxLoader.start();
      this.service
        .obtainAccessToken(data)
        .pipe()
        .subscribe(
          (response: any) => {
            this.ngxLoader.stop();
            if (response.access_token) {
              if (localStorage.getItem(btoa('currentUser'))) {
                this.ngxLoader.start();
                this.apiService.getUserLogin().subscribe(
                  (res: any) => {
                    localStorage.setItem(
                      btoa('profileUser'),
                      btoa(JSON.stringify(res['data']))
                    );
                    this.router.navigate(['/home']);
                  },
                  (error: any) => {
                    this.ngxLoader.stop();
                    
                  },
                  () => {
                    this.ngxLoader.stop();
                  }
                );
              }
            }
          },
          (error) => {
            this.ngxLoader.stop();
            if (error.status === 401) {
              this.error = 'Username or Password Invalid';
              setTimeout(() => {}, 500);
            } else {
            }
          }
        );
    }
  }

  password() {
    this.show = !this.show;
  }
}
