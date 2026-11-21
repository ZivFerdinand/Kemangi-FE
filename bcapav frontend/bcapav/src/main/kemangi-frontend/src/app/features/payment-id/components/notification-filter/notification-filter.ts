import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';

import { PaymentIdDetails } from '../../domain/model/payment-id.model';

@Component({
  selector: 'app-payment-id-notification-filter',
  templateUrl: './notification-filter.html',
  styleUrls: [
    './notification-filter.scss',
    '../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [CommonModule],
  providers: [DatePipe],
})
export class PaymentIdNotificationFilter {
  @Input() data: PaymentIdDetails | null = null;

  showFilter: boolean = false;

  constructor() {}

  toggleFilter() {
    this.showFilter = !this.showFilter;
  }

  resetFilter() {}

  submitFilter() {}
}
