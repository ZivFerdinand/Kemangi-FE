import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CapitalizePipe,
  BadgeUploadedDoc } from '../../../../../shared';
import { BadgeDownloadDoc } from '../../../../../shared/components/badge-download-doc/badge-download-doc';

import { NgSelectModule } from '@ng-select/ng-select';
import { ToggleSwitch } from '../../../../../shared';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Menu } from '../../../../../shared/interfaces';
import { DatePipe } from '@angular/common';
import { CustomTableDiffApprovalComponent } from '../custom-table-diff-approval/custom-table-diff-approval.component';
import { ThresholdIdDetailParams } from '../../interfaces';
import { thresholdScoreDetailViewListColumns } from '../../data';
import { TruncateOrDashPipe } from "../../../../../shared/pipes/truncate-or-dash.pipe";

@Component({
  selector: 'app-edit-threshold-approval',
  templateUrl: './edit-threshold-approval.html',
  styleUrls: ['./edit-threshold-approval.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    NgbModule,
    ToggleSwitch,
    CapitalizePipe,
    CustomTableDiffApprovalComponent,
    TruncateOrDashPipe,
    BadgeDownloadDoc,
],
  providers: [DatePipe],
})
export class EditThresholdApproval {
  @Input() detailData: any;

  @Input() pageType: string = '';

  @Input() back!: () => void;

  
  @Output() approve = new EventEmitter<any>();

  @Output() reject = new EventEmitter<any>();

  isDisabled = true;
  tableValueDataAfter: any[] = []; 
  tableValueDataBefore: any[] = []; 

  pageParamsThresholdIdDetailAfter: ThresholdIdDetailParams = {
    limit: 5,
    page: 1,
    sort: '',
    sort_dir: 'asc',
    id: '',
    model_id: ''
  };

  pageInfoThresholdIdDetailAfter = {
    totalElements: 31,
    totalPages: 1,
  };

  pageParamsThresholdIdDetailBefore: ThresholdIdDetailParams = {
    limit: 5,
    page: 1,
    sort: '',
    sort_dir: 'asc',
    id: '',
    model_id: ''
  };

  pageInfoThresholdIdDetailBefore = {
    totalElements: 31,
    totalPages: 1,
  };

  columnsThresholdIdDetail = thresholdScoreDetailViewListColumns;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['detailData'] && this.detailData) {
      this.tableValueDataAfter = this.detailData.thresholdDetails || [];
      this.pageParamsThresholdIdDetailAfter.page = 1; // reset to first page
      this.pageParamsThresholdIdDetailAfter.limit = 5; // set page size

      
      this.tableValueDataBefore = this.detailData.old_data.thresholdDetails || [];
      this.pageParamsThresholdIdDetailBefore.page = 1; // reset to first page
      this.pageParamsThresholdIdDetailBefore.limit = 5; // set page size

      this.updatePageInfoThresholdIdDetailAfter();
      this.updatePageInfoThresholdIdDetailBefore();
    }

    
  }
  updatePageInfoThresholdIdDetailAfter() {
    const totalElements = this.tableValueDataAfter.length;
    this.pageInfoThresholdIdDetailAfter = {
      totalElements,
      totalPages: Math.ceil(totalElements / this.pageParamsThresholdIdDetailAfter.limit) || 1,
    };
  }
  get pagedThresholdIdDetailAfter() {
    const start = (this.pageParamsThresholdIdDetailAfter.page - 1) * this.pageParamsThresholdIdDetailAfter.limit;
    const end = start + this.pageParamsThresholdIdDetailAfter.limit;
    return this.tableValueDataAfter.slice(start, end);
  }
  handlePageChangeThresholdIdAfter(e: any) {
    this.pageParamsThresholdIdDetailAfter = { ...this.pageParamsThresholdIdDetailAfter, page: e };
    this.updatePageInfoThresholdIdDetailAfter();
  }

  updatePageInfoThresholdIdDetailBefore() {
    const totalElements = this.tableValueDataBefore.length;
    this.pageInfoThresholdIdDetailBefore = {
      totalElements,
      totalPages: Math.ceil(totalElements / this.pageParamsThresholdIdDetailBefore.limit) || 1,
    };
  }
  get pagedThresholdIdDetailBefore() {
    const start = (this.pageParamsThresholdIdDetailBefore.page - 1) * this.pageParamsThresholdIdDetailBefore.limit;
    const end = start + this.pageParamsThresholdIdDetailBefore.limit;
    return this.tableValueDataBefore.slice(start, end);
  }
  handlePageChangeThresholdIdBefore(e: any) {
    this.pageParamsThresholdIdDetailBefore = { ...this.pageParamsThresholdIdDetailBefore, page: e };
    this.updatePageInfoThresholdIdDetailBefore();
  }
}
