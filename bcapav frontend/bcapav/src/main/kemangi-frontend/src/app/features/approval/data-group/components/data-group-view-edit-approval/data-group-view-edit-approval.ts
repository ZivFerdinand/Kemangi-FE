import {
  Component,
  Input,
  Output,
  input,
  signal,
  computed,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ToggleSwitch, TableComponent } from '../../../../../shared';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { CapitalizePipe } from '../../../../../shared';
import { TableQuery } from '../../../../../shared';
import { RuleRelationTable } from '../../../../rule-management/data-group/domain/models/data-group.model';
import { DataGroupApprovalDetails } from '../../domain/models/data-group-approval.model';
import { DATA_GROUP_APPROVAL_DETAILS_INIT } from '../../data/init';
import { PAGE_QUERY_INIT, PAGE_INFO_INIT } from '../../../../../shared';
import { DataGroupViewApprovalDetailValueComponent } from '../data-group-view-approval-detail-value/data-group-view-approval-detail-value';
import { ruleRelationListColumns } from '../../../../rule-management/data-group/data';
import { camelToSnake } from '../../../../../shared/utils/string.util';

@Component({
  selector: 'app-data-group-view-edit-approval',
  templateUrl: './data-group-view-edit-approval.html',
  styleUrls: [
    './data-group-view-edit-approval.scss',
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
    CapitalizePipe,
  ],
  providers: [DatePipe],
})
export class DataGroupViewEditApproval {
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

  handlePageRuleRelationTable(e: any) {
    this.pageChange.emit(e);
  }

  handlePageRuleRelationSort(direction: 'asc' | 'desc', key: string) {
    this.sort.emit({
      direction,
      key: camelToSnake(key),
    });
  }
}
