import { Component, Output, EventEmitter, Input, Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderComponent, NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-badge-download-doc',
  standalone: true,
  templateUrl: './badge-download-doc.html',
  styleUrls: ['./badge-download-doc.scss'],
  imports: [],
})

@Injectable({ providedIn: 'root' })
export class BadgeDownloadDoc extends ApiService {
  constructor(
    httpClient: HttpClient,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly toastr: ToastrService
  ) {
    super(httpClient);
  }
  
  @Output() clearFile = new EventEmitter<string>();

  @Input() originalName: string = '';
  @Input() extension: string = '';
  @Input() generatedName: string = '';
  @Input() showClearBtn: boolean = true;
  @Input() resourcePathSource: string = 'ml-threshold';

  removeFile(generatedName: string) {
    this.clearFile.emit(generatedName);
  }
  viewFileBtn() {
    this.ngxLoader.start();
    const url = `${this.base_URL}/${this.resourcePathSource}/resource/temp/${this.generatedName}`;
    this.httpClient.get(url, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl;
        a.download = this.originalName || this.generatedName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(objectUrl);
      },
      error: (e) => {
        if (e) {
          this.toastr.show(
            `<div class="toast-custom toast-failed">
              <div class="info">
                <div class="icon">
                  <img src="./assets/img/ic-times-rounded.svg" alt="error" />
                </div>
                <div class="description">
                    Something went wrong while loading data.
                </div>
              </div>

              <button class="close-btn">
                <img src="./assets/img/ic-times.svg" alt="close" />
              </button>
            </div>`,
            '',
            { enableHtml: true }
          );
        }
      },
      complete: () => this.ngxLoader.stop(),
    });
  }
}
