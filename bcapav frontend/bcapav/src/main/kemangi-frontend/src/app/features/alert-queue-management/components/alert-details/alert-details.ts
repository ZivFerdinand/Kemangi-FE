import { Component, Input } from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ToggleSwitch } from '../../../../shared/components/';
import { CapitalizePipe } from '../../../../shared';

import { AlertQueueDetailsUI } from '../../domain/alert-queue.model';
import { ALERT_QUEQUE_DETAILS_INIT } from '../../data';

@Component({
  selector: 'app-alert-details',
  templateUrl: './alert-details.html',
  styleUrls: ['./alert-details.scss', '../../../../shared/styles/index.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, CapitalizePipe, ToggleSwitch],
  providers: [DatePipe],
})
export class AlertDetails {
  @Input() type: 'requested' | 'task' | 'current' = 'requested';
  @Input() taskLevel: '1' | '2' = '1';
  @Input() ref: string = '';
  @Input() data: AlertQueueDetailsUI = { ...ALERT_QUEQUE_DETAILS_INIT };
  @Input() prevData: AlertQueueDetailsUI = { ...ALERT_QUEQUE_DETAILS_INIT };
}
