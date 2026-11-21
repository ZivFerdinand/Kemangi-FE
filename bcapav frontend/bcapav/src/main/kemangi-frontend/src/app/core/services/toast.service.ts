import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastr: ToastrService) {}

  success(message: string) {
    this.toastr.show(
      `
        <div class="toast-custom toast-success">
          <div class="info">
            <div class="icon">
              <img src="./assets/img/ic-checked-rounded.svg" alt="success" />
            </div>
            <div class="description">
                ${message ?? 'Success'}
            </div>
          </div>
          <button class="close-btn">
            <img src="./assets/img/ic-times.svg" alt="close" />
          </button>
        </div>
      `,
      '',
      { enableHtml: true }
    );
  }

  error(message: string) {
    this.toastr.show(
      `
        <div class="toast-custom toast-failed">
          <div class="info">
            <div class="icon">
              <img src="./assets/img/ic-times-rounded.svg" alt="error" />
            </div>
            <div class="description">
              ${message ?? 'Error'}
            </div>
          </div>

          <button class="close-btn">
            <img src="./assets/img/ic-times.svg" alt="close" />
          </button>
        </div>
      `,
      '',
      { enableHtml: true }
    );
  }
}
