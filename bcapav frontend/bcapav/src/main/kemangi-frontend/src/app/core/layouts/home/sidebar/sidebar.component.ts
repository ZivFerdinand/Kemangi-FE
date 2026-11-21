import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { SharedDataService } from '../../../services/shared-data.service';

declare var $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [CommonModule, RouterModule],
})
export class SidebarComponent implements OnInit {
  @Input() listMenu: string[] = [];
  activeRoute: any;
  redirectRoute: any;
  target: any;
  str: any;
  popupSubMenu: string | null = null;
  popupMenuTop: number = 0;
  popupMenuLeft: number = 0;

  @Input() isCollapsed = true;
  @Output() isCollapsedChange = new EventEmitter<boolean>();


  collapseClicked() {
    if (this.isCollapsed) this.onMouseOver();
    else {
      this.onMouseOut();
      this.closeAllSubmenus();
    }
  }

  openPopupSubMenu(id: string, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (this.popupSubMenu === id) {
      this.closePopupSubMenu();
      return;
    }
    this.popupSubMenu = id;

    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.popupMenuTop = rect.top;
    this.popupMenuLeft = rect.right;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.popupSubMenu) {
      this.closePopupSubMenu();
    }
  }


  closePopupSubMenu() {
    this.popupSubMenu = null;
  }

  closeAllSubmenus() {
    setTimeout(() => {
      $('.sub-menu').removeClass('show');
      $('.nav-link[data-bs-toggle="collapse"]').attr('aria-expanded', 'false');
    }, 0);
  }
  onMouseOver() {
    this.isCollapsed = false;
    this.isCollapsedChange.emit(this.isCollapsed);
  }

  onMouseOut() {
    this.isCollapsed = true;
    this.isCollapsedChange.emit(this.isCollapsed);
  }
  constructor(
    private readonly service: ApiService,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly sharedData: SharedDataService,
  ) {
    this.listMenu = this.sharedData.menus() || [];
  }

  ngOnInit() {
    setTimeout(() => {
      $('#metismenu').metisMenu();
    }, 10);

    setTimeout(() => {
      let str = window.location.href;
      this.str = str.slice(str.lastIndexOf('#') + 1);

      let questionMarkIndex = this.str.indexOf('?');
      if (questionMarkIndex !== -1)
        this.str = this.str.substring(0, questionMarkIndex);

      // if (this.str === '/home/case-inventory/create' || this.str === '/home/case-inventory/edit' || this.str === '/home/case-inventory/detail') {
      //   this.target = '/home/case-inventory';
      // } else if (this.str === '/home/case-list/filter' || this.str === '/home/case-list/detail-task') {
      //   this.target = '/home/case-list';
      // } else if (this.str === '/home/dispute/request-dispute') {
      //   this.target = '/home/dispute'
      // } else if (this.str === '/home/approval/roles-approval/view') {
      //   this.target = '/home/approval/roles-approval'
      // } else if (this.str === '/home/roles/view' || this.str === '/home/roles/view-requested' || this.str === '/home/roles/edit' || this.str === '/home/roles/add'
      // ) {
      //   this.target = '/home/roles'
      // }
      // else {
      //   this.target = str.slice(str.lastIndexOf('#') + 1);
      // }
    }, 5);
  }

  checkMenu = (code: any) => {
    return this.listMenu.indexOf(code) !== -1;
  };

  clickMenu(event: any, href: any) {
    this.activeRoute = this.router.url;
    this.redirectRoute = href;

    event.preventDefault();

    sessionStorage.setItem('redirect-url', JSON.stringify(this.redirectRoute));

    if (this.activeRoute === '/home/case-inventory/create') {
      if (this.redirectRoute !== '/home/case-inventory/create') {
        setTimeout(() => {
          this.target = null;
          $('#back-create-case-inventory').modal({
            backdrop: 'static',
            keyboard: false,
          });
        });
      }
    } else if (this.activeRoute === '/home/case-inventory/edit') {
      if (this.redirectRoute !== '/home/case-inventory/edit') {
        this.target = null;
        setTimeout(() => {
          $('#back-create-case-inventory-edit').modal({
            backdrop: 'static',
            keyboard: false,
          });
        });
      }
    } else if (this.activeRoute === '/home/case-list/detail-task') {
      if (this.redirectRoute !== '/home/case-list/detail-task') {
        this.target = null;
        setTimeout(() => {
          $('#back-case-list-detail').modal({
            backdrop: 'static',
            keyboard: false,
          });
        });
      }
    } else if (this.activeRoute === '/home/task-list/detail-task') {
      if (this.redirectRoute !== '/home/task-list/detail-task') {
        this.target = null;
        setTimeout(() => {
          $('#back-task-list-detail').modal({
            backdrop: 'static',
            keyboard: false,
          });
        });
      }
    } else {
      let str = event.target.href;
      this.target = str.slice(str.lastIndexOf('#') + 1);

      if (sessionStorage.getItem('redirect-url')) {
        sessionStorage.removeItem('redirect-url');
      }
      this.router.navigate([this.redirectRoute]);
    }
  }

  async logout() {
    await this.authService.logout();

    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }
}
