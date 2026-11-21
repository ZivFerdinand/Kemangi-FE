import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToggleSwitch, TableComponent } from '../../../../../shared';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import {
  valueListColumns,
  ruleRelationListColumns,
} from '../../../../../shared';
import { CapitalizePipe } from '../../../../../shared';

@Component({
  selector: 'app-default-data-group-approval',
  templateUrl: './default-data-group-approval.html',
  styleUrls: ['./default-data-group-approval.scss', '../../styles/styles.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    NgbModule,
    ToggleSwitch,
    TableComponent,
    CapitalizePipe,
  ],
  providers: [DatePipe],
})
export class DefaultDataGroupApproval {
  @Input() details: any;

  @Input() pageType: string = '';

  @Input() pageParams: any;

  @Input() pageInfo: any;

  @Input() ruleRelation: any;

  @Input() back!: () => void;

  @Input() reject!: () => void;

  @Input() approve!: () => void;

  @Output() pageChange = new EventEmitter<any>();

  @Output() sort = new EventEmitter<{
    direction: 'asc' | 'desc';
    key: string;
  }>();

  valueColumns = valueListColumns;

  ruleRelationColumns = ruleRelationListColumns;

  isDisabled = true;

  constructor() {}

  ngOnInit(): void {}

  sortValue(order: 'asc' | 'dsc', value: any[]) {
    value.sort((a, b) => {
      return order === 'asc' ? a.localeCompare(b) : b.localeCompare(a);
    });
  }

  onSort(order: 'asc' | 'dsc') {
    this.sortValue(order, this.details.detail_values);

    this.details.detail_values = [...this.details.detail_values];
  }
}
