import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';

import { PaymentIdDetails } from '../../domain/model/payment-id.model';

@Component({
  selector: 'app-payment-id-details-info',
  templateUrl: './payment-details-info.html',
  styleUrls: [
    './payment-details-info.scss',
    '../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [CommonModule],
  providers: [DatePipe],
})
export class PaymentIdDetailsInfo {
  @Input() data: PaymentIdDetails | null = null;

  constructor() {}
}
