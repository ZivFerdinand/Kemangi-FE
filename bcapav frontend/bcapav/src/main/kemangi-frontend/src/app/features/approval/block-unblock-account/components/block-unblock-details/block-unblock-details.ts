import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { uploadDetailsColumn } from '../../../../action/block-unblock-account/data';
import { blockUnblockDetailsDoneRequestedListColumns } from '../../data';

import {
  CapitalizePipe,
  PAGE_INFO_INIT,
  TableComponent,
} from '../../../../../shared';

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
  selector: 'app-block-unblock-details',
  templateUrl: './block-unblock-details.html',
  styleUrls: [
    './block-unblock-details.scss',
    '../../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DatePipe,
    CapitalizePipe,
    TableComponent,
    NgbTooltipModule,
  ],
  providers: [DatePipe],
})
export class BlockUnblockApprDetails implements OnChanges {
  @Input() type: 'requested' | 'task' = 'requested';

  @Input() ref: string = '';
  @Input() data: any = {};
  @Input() tableData: any[] = [];
  @Input() pageInfo: any = { ...PAGE_INFO_INIT };
  @Input() pageQuery: any = {};
  @Input() showBtnRetry: boolean = false;

  @Output() handlePage = new EventEmitter<any>();
  @Output() handleSort = new EventEmitter<HandleSortParams>();
  @Output() handleSearch = new EventEmitter<any>();
  @Output() handledownload = new EventEmitter<HandleDownloadParams>();
  @Output() handleRetry = new EventEmitter<any>();

  columns: any[] = [];

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

  retry() {
    this.handleRetry.emit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('data' in changes) {
      const value = changes['data'].currentValue;

      if (value) {
        if (value.processStatus === 'DONE') {
          this.columns = blockUnblockDetailsDoneRequestedListColumns;
        } else {
          this.columns = uploadDetailsColumn;
        }
      }
    }
  }
}
