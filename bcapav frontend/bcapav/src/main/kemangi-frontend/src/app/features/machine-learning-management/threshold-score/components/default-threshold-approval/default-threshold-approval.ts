import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToggleSwitch, TableComponent, CapitalizePipe } from '../../../../../shared';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Menu } from '../../../../../shared/interfaces';
import { DatePipe } from '@angular/common';
import { thresholdScoreDetailViewListColumns } from '../../data';
import { ThresholdIdDetailParams } from '../../interfaces';
import { TruncateOrDashPipe } from "../../../../../shared/pipes/truncate-or-dash.pipe";
import { BadgeDownloadDoc } from "../../../../../shared/components/badge-download-doc/badge-download-doc";

@Component({
  selector: 'app-default-threshold-approval',
  templateUrl: './default-threshold-approval.html',
  styleUrls: ['./default-threshold-approval.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule, NgbModule, ToggleSwitch, TableComponent, TruncateOrDashPipe, CapitalizePipe, BadgeDownloadDoc],
  providers: [DatePipe],
})
export class DefaultThresholdApproval {
  @Input() detailData: any;

  @Input() pageType: string = '';

  @Input() back!: () => void;

  @Output() approve = new EventEmitter<any>();

  @Output() reject = new EventEmitter<any>();

  tableValueData: any[] = []; // The original data (from roleDetailData.table_value or similar)
  pagedTableValueData: any[] = []; 

  pageParamsThresholdIdDetail: ThresholdIdDetailParams = {
    limit: 5,
    page: 1,
    sort: '',
    sort_dir: 'asc',
    id: '',
    model_id: ''
  };

  pageInfoThresholdIdDetail = {
    totalElements: 31,
    totalPages: 1,
  };

  columnsThresholdIdDetail = thresholdScoreDetailViewListColumns;
  isDisabled = true;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['detailData'] && this.detailData) {
      this.tableValueData = this.detailData.thresholdDetails || [];
      this.pageParamsThresholdIdDetail.page = 1; // reset to first page
      this.pageParamsThresholdIdDetail.limit = 5; // set page size

      this.updatePageInfoThresholdIdDetail();
    }
  }
  updatePageInfoThresholdIdDetail() {
    const totalElements = this.tableValueData.length;
    this.pageInfoThresholdIdDetail = {
      totalElements,
      totalPages: Math.ceil(totalElements / this.pageParamsThresholdIdDetail.limit) || 1,
    };
  }
  get pagedThresholdIdDetail() {
    const start = (this.pageParamsThresholdIdDetail.page - 1) * this.pageParamsThresholdIdDetail.limit;
    const end = start + this.pageParamsThresholdIdDetail.limit;
    return this.tableValueData.slice(start, end);
  }
  handlePageChangeThresholdId(e: any) {
    this.pageParamsThresholdIdDetail = { ...this.pageParamsThresholdIdDetail, page: e };
    this.updatePageInfoThresholdIdDetail();
  }
}
