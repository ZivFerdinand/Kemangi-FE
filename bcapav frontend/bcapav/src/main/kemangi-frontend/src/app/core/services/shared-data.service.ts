import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  private readonly initialData = this.loadState();

  private loadState() {
    try {
      const saved = localStorage.getItem(btoa('profileUser'));

      const profile = saved ? JSON.parse(atob(saved)) : null;

      return (
        profile ?? {
          menuCode: null,
          roleName: null,
          fullName: null,
        }
      );
    } catch {
      return { menuCode: null, roleName: null, fullName: null };
    }
  }

  menus = signal<string[] | null>(this.initialData.menuCode);
  roleName = signal<string | null>(this.initialData.roleName);
  fullName = signal<string | null>(this.initialData.fullName);

  checkMenu(menu: string): boolean {
    return this.menus()?.includes(menu) ?? false;
  }
}
