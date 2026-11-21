import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-preview-excel',
  templateUrl: './preview-excel.component.html',
  styleUrls: ['./preview-excel.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class PreviewExcelComponent implements OnInit {
  allSheets: any = {};
  sheetNames: string[] = [];
  activeSheet: string = '';
  reference: any;
  fileName: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const ref = params['ref'];
      if (!ref) return;

      const decodedUrl = decodeURIComponent(ref);
      const fileName = this.getFileName(decodedUrl);
      this.fileName = fileName;

      this.reference = decodedUrl;
      this.initData(decodedUrl);
    });
  }

  initData(url: string) {
    this.http
      .get(url, {
        responseType: 'blob',
      })
      .subscribe((res) => {
        if (res) {
          this.previewExcel(res);
        }
      });
  }

  previewExcel(blob: Blob) {
    blob.arrayBuffer().then((buffer) => {
      const workbook = XLSX.read(buffer, { type: 'array' });

      this.sheetNames = workbook.SheetNames || [];
      this.allSheets = {};

      if (!this.sheetNames.length) {
        console.error('❌ No sheets found. Probably not a valid Excel file.');
        return;
      }

      this.sheetNames.forEach((name) => {
        const worksheet = workbook.Sheets[name];

        this.allSheets[name] = XLSX.utils
          .sheet_to_json(worksheet, { header: 1 })
          .slice(0, 50);
      });

      this.activeSheet = this.sheetNames[0];
    });
  }

  handleDownload() {
    this.http
      .get(this.reference, {
        responseType: 'blob',
      })
      .subscribe((res) => {
        if (res) {
          this.downloadFile(res);
        }
      });
  }

  downloadFile(res: Blob) {
    const blob = new Blob([res]);
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = this.fileName;
    link.click();
  }

  getFileName(url: string): string {
    return url.split('/').pop() || '';
  }
}
