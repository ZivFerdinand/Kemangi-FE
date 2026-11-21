import { Injectable, signal } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private activeMenu = signal<string[] | null>(null);

  constructor(private storage: StorageService) {
    const profileUser = this.storage.get<string>(btoa('profileUser'));

    let profileUserParsed;

    if (profileUser) {
      try {
        profileUserParsed = JSON.parse(atob(profileUser));
      } catch (e) {
        profileUserParsed = null;
      }
    }

    if (profileUserParsed?.menuCode) {
      this.activeMenu.set(profileUserParsed?.menuCode);
    }
  }

  setActiveMenu(menu: string[]) {
    this.activeMenu.set(menu);
  }

  getActiveMenu() {
    return this.activeMenu();
  }

  checkMenu(menu: string): boolean {
    return this.activeMenu()?.includes(menu) ?? false;
  }
}
