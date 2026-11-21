import {
  Component,
  Input,
  Output,
  input,
  signal,
  computed,
  EventEmitter,
} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbPaginationModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToggleSwitch, TableComponent } from '../../../../../shared';

import { DatePipe } from '@angular/common';

import { TableQuery } from '../../../../../shared';
import { RuleRelationTable } from '../../../../rule-management/data-group/domain/models/data-group.model';
import { DataGroupApprovalDetails } from '../../domain/models/data-group-approval.model';
import { DATA_GROUP_APPROVAL_DETAILS_INIT } from '../../data/init';
import { PAGE_QUERY_INIT, PAGE_INFO_INIT } from '../../../../../shared';
import { DataGroupViewApprovalDetailValueComponent } from '../data-group-view-approval-detail-value/data-group-view-approval-detail-value';
import { ruleRelationListColumns } from '../../../../rule-management/data-group/data';
import { camelToSnake } from '../../../../../shared/utils/string.util';
import { Router } from '@angular/router';

@Component({
  selector: 'app-data-group-view-task-edit-approval',
  templateUrl: './data-group-view-task-edit-approval.html',
  styleUrls: [
    './data-group-view-task-edit-approval.scss',
    '../../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    NgbModule,
    ToggleSwitch,
    DataGroupViewApprovalDetailValueComponent,
    TableComponent,
    NgbPaginationModule,
    // CapitalizePipe,
  ],
  providers: [DatePipe],
})
export class DataGroupViewTaskEditApproval {
  private _details = DATA_GROUP_APPROVAL_DETAILS_INIT;
  private _prevDetails = DATA_GROUP_APPROVAL_DETAILS_INIT;

  @Input()
  set details(value: DataGroupApprovalDetails) {
    this._details = value;
    this.detailValues.set(value.detailValues);
  }

  get details() {
    return this._details;
  }

  @Input()
  set prevDetails(value: DataGroupApprovalDetails) {
    this._prevDetails = value;
    this.prevDetailValues.set(value.detailValues);
  }

  get prevDetails() {
    return this._prevDetails;
  }

  @Input() back!: () => void;

  @Output() pageChange = new EventEmitter<any>();

  @Output() sort = new EventEmitter<{
    direction: 'asc' | 'desc';
    key: string;
  }>();

  @Output() approve = new EventEmitter<any>();

  @Output() reject = new EventEmitter<any>();

  lvl1 = input<boolean>(false);

  lvl2 = input<boolean>(false);

  ruleRelationList = input<RuleRelationTable[]>([]);

  ruleRelationPageInfo = input<any>({ ...PAGE_INFO_INIT });

  ruleRelationPageQuery = input<TableQuery>({ ...PAGE_QUERY_INIT });

  ruleRelationColumns = ruleRelationListColumns;

  detailValues = signal<string[]>([]);

  prevDetailValues = signal<string[]>([]);

  isDisabled = true;

  startIndex = computed(() => {
    const total = this.ruleRelationPageInfo()?.totalElements;
    if (total === 0) return 0;

    return (
      (this.ruleRelationPageQuery().page - 1) *
        this.ruleRelationPageQuery().limit +
      1
    );
  });

  endIndex = computed(() => {
    const total = this.ruleRelationPageInfo()?.totalElements;
    if (total === 0) return 0;

    return Math.min(
      this.ruleRelationPageQuery().page * this.ruleRelationPageQuery().limit,
      total,
    );
  });

  notInPrevValue = computed(() => {
    const current = this.detailValues();
    const prev = this.prevDetailValues();

    return current.filter((v) => !prev.includes(v));
  });

  constructor(
    private router: Router,
    private http: HttpClient,
  ) {}

  handlePageRuleRelationTable(e: any) {
    this.pageChange.emit(e);
  }

  handlePageRuleRelationSort(direction: 'asc' | 'desc', key: string) {
    this.sort.emit({
      direction,
      key: camelToSnake(key),
    });
  }

  handleDownload(url: string, extension: string) {
    if (extension === '.pdf') {
      this.http
        .get(url, {
          responseType: 'blob',
        })
        .subscribe((res) => {
          const blob = new Blob([res], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(blob);
          window.open(fileURL, '_blank');
          return;
        });

      return;
    }

    const scriptUrl = this.router.serializeUrl(
      this.router.createUrlTree(['/preview-excel'], {
        queryParams: {
          ref: url,
        },
      }),
    );

    const finalUrl = scriptUrl.includes('#') ? scriptUrl : '/#' + scriptUrl;

    window.open(window.location.origin + finalUrl, '_blank');
  }
}
