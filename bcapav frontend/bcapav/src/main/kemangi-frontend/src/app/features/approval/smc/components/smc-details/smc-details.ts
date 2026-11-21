import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DecimalPipe, registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';

import {
  CapitalizePipe,
  PAGE_INFO_INIT,
  TableComponent,
} from '../../../../../shared';
//import { TableResizableCell } from '../../../../../shared/components/resizable-table/resizable-cell';

registerLocaleData(localeDe);

interface HandleDownloadParams {
  id: number;
  fileName: string;
  validStatus: boolean | null;
  processStatus: boolean | null;
}

interface HandleSortParams {
  order: string;
  param: string;
}

@Component({
  selector: 'app-smc-details',
  templateUrl: './smc-details.html',
  styleUrls: ['./smc-details.scss', '../../../../../shared/styles/index.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DatePipe,
    CapitalizePipe,
    TableComponent,
    DecimalPipe,
  ],
  providers: [DatePipe],
})
export class SmcApprDetails {
  @Input() type: 'requested' | 'task' = 'requested';

  @Input() ref: string = '';
  @Input() data: any = {};
  @Input() tableData: any[] = [];
  @Input() pageInfo: any = { ...PAGE_INFO_INIT };
  @Input() pageQuery: any = {};
  @Input() columns: any[] = [];

  @Output() handlePage = new EventEmitter<any>();
  @Output() handleSort = new EventEmitter<HandleSortParams>();
  @Output() handleSearch = new EventEmitter<any>();
  @Output() handledownload = new EventEmitter<HandleDownloadParams>();
  @Output() handledownloadUnblock = new EventEmitter<any>();

  query: string = '';

  constructor() {}

  handleQuery() {
    this.handleSearch.emit(this.query);
  }

  handlePageChange(e: any) {
    this.handlePage.emit(e);
  }

  handleSortChange(order: string, param: string) {
    const payloadSort = {
      order: order,
      param: param,
    };
    this.handleSort.emit(payloadSort);
  }

  handleDownload(validStatus: boolean | null, processStatus: boolean | null) {
    const payloadDownload = {
      id: this.data.id,
      fileName: this.data.fileName,
      validStatus: validStatus,
      processStatus: processStatus,
    };

    this.handledownload.emit(payloadDownload);
  }
}
