import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-id-notification',
  templateUrl: './payment-id-notification.html',
  styleUrls: [
    './payment-id-notification.scss',
    '../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [CommonModule],
  providers: [DatePipe],
})
export class PaymentIdNotification {
  read: boolean = false;

  constructor(private router: Router) {}

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  onClick() {
    this.read = true;
  }
}
