import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
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
  selector: 'app-edit-data-group-approval',
  templateUrl: './edit-data-group-approval.html',
  styleUrls: ['./edit-data-group-approval.scss', '../../styles/styles.scss'],
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
export class EditDataGroupApproval implements OnChanges {
  @Input() details: any;
  @Input() prevDetails: any;
  @Input() pageType: string = '';
  @Input() pageParams: any;
  @Input() pageInfo: any;
  @Input() ruleRelation: any;
  @Input() before: any;
  @Input() after: any;
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

  diff: any[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (this.details?.detail_values && this.prevDetails?.detail_values) {
      this.diff = this.details.detail_values.filter(
        (x: any) => !this.prevDetails.detail_values.includes(x)
      );
    }
  }

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
