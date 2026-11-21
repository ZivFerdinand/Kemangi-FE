import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [CommonModule],
  standalone: true,
})
export class HeaderComponent implements OnInit {
  isDropdownOpen = false;
  fullName: string | undefined = '';
  roleName: string | undefined = '';
  @Input() isSidebarCollapsed = true;
  constructor(
    private readonly service: AuthService,
    private readonly router: Router
  ) { }
  ngOnInit(): void {
    if (localStorage.getItem(btoa('profileUser'))) {
      const encodedUser = localStorage.getItem(btoa('profileUser'));
      let parsedUser: User | null = null;
      if (encodedUser) {
        try {
          parsedUser = JSON.parse(atob(encodedUser));
        } catch (e) {
          parsedUser = null;
        }
      }

      this.fullName = parsedUser?.fullName;
      this.roleName = parsedUser?.roleName;
    }
  }
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  closeDropdown() {
    this.isDropdownOpen = false;
  }
  async logout() {
    await this.service.logout();


    this.router.navigate(['/login'])
  }
}
