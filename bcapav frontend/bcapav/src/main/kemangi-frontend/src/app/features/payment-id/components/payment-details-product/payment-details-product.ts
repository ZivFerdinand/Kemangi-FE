import {
  Component,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AccordionModule } from 'ngx-bootstrap/accordion';

//import { StickyTableComponent } from '../../../../shared/components/sticky-table/sticky-table';

import {
  PAGE_INFO_INIT,
  PAGE_QUERY_INIT,
  PageInfo,
  TableQuery,
} from '../../../../shared';
import { ColumnDef } from '@tanstack/table-core';
import { PaymentIdStickyTable } from '../payment-id-sticky-table/payment-id-sticky-table';

@Component({
  selector: 'payment-details-product',
  templateUrl: './payment-details-product.html',
  styleUrls: ['./payment-details-product.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: true,
  imports: [NgbModule, AccordionModule, PaymentIdStickyTable],
})
export class PaymentDetailsProduct<T> implements OnChanges {
  @Input() failedCount: number = 0;
  @Input() name: string | null = null;
  @Input() tableData: any[] = [];
  @Input() data: any = null;
  @Input() columnsPinned: string[] = [];
  @Input() columns: ColumnDef<T>[] = [];
  @Output() handleData = new EventEmitter<TableQuery>();

  isOpen = false;

  pageQuery: TableQuery = { ...PAGE_QUERY_INIT };
  @Input() pageInfo: PageInfo = { ...PAGE_INFO_INIT };
  resData: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    const data = changes['data'];
    if (data) {
      if (data.currentValue) {
        // resData = data.currentValue;
        // pageInfo = {}
        //this.loadDetails(initialdata.currentValue);
      }
    }
  }

  handlePageChange(e: any) {
    this.pageQuery = { ...this.pageQuery, page: e };

    this.handleData.emit(this.pageQuery);
  }

  get statusLabel(): string {
    return this.tableData?.some((item) => item.status === 'Failed')
      ? 'Failed'
      : 'Success';
  }
}

const A = [
  { name: 'AS1', highlight: false },
  { name: 'AS2', highlight: false },
  { name: 'AS3', highlight: false },
];

const B = [
  { name: 'AS1', highlight: false },
  { name: 'BS2', highlight: false },
  { name: 'AS3', highlight: false },
  { name: 'BS4', highlight: false },
];
