import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  BreadcrumbProps,
  ContentLayout,
  CustomTabComponent,
  PAGE_INFO_INIT,
  PAGE_QUERY_INIT,
  PageInfo,
  TableQuery,
  TabProps,
} from '../../../shared';
import { paymentIdNotificationListBreadcrumb } from '../data';
import { Router } from '@angular/router';
import { paymentIdNotficationTabs } from '../data/tabs';
import { PaymentIdNotification } from '../components/payment-id-notification/payment-id-notification';
import { PaymentIdPagination } from '../components/payment-id-pagination/payment-id-pagination';
import { PaymentIdNotificationFilter } from '../components/notification-filter/notification-filter';

@Component({
  selector: 'app-payment-id-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: [
    './notifications.component.scss',
    '../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ContentLayout,
    CustomTabComponent,
    PaymentIdNotification,
    PaymentIdPagination,
    PaymentIdNotificationFilter,
  ],
  providers: [DatePipe],
})
export class PaymentIdNotifications {
  breadcrumb: BreadcrumbProps[] = paymentIdNotificationListBreadcrumb;

  pageTitle: string = 'Notification List';

  tabs: TabProps[] = paymentIdNotficationTabs;

  activeTab = 'all';

  pageQuery: TableQuery = { ...PAGE_QUERY_INIT };

  pageInfo: PageInfo = { ...PAGE_INFO_INIT };

  constructor(private router: Router) {}

  handlePageChange(e: any) {
    this.pageQuery = { ...this.pageQuery, page: e };
    // this.initData();
  }

  handleTabChange(tab: string) {
    this.activeTab = tab;

    if (tab === 'all') {
    }
    //this.navigateTo('/home/action/block-unblock-account/upload');

    if (tab === 'new') {
    }
    //this.navigateTo('/home/action/block-unblock-account/requested');
    if (tab === 'read') {
    }
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
