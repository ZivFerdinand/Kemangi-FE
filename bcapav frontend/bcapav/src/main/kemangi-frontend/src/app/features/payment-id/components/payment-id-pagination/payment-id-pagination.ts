import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-payment-id-pagination',
  templateUrl: './payment-id-pagination.html',
  styleUrls: [
    './payment-id-pagination.scss',
    '../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [CommonModule, NgbPaginationModule],
  providers: [DatePipe],
})
export class PaymentIdPagination {
  @Input() pageInfo: any;
  @Input() pageParams: any;
  @Input() data: any[] = [];
  @Output() pageChange = new EventEmitter<any>();

  read: boolean = false;

  constructor(private router: Router) {}

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  onClick() {
    this.read = true;
  }

  get startIndex() {
    return (this.pageParams.page - 1) * this.pageParams.limit;
  }

  get endIndex() {
    const end = this.startIndex + this.data?.length;
    return end > this.pageInfo.totalElements
      ? this.pageInfo.totalElements
      : end;
  }

  onPageChange(page: number) {
    this.pageChange.emit(page);
  }
}
