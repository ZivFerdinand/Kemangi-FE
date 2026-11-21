export interface MenuOriginList {
  menu_code: string;
  menu_id: number;
  menu_name: string;
  parent: number;
  position: number;
}

export interface SubSubMenu {
  id: number;
  name: string;
  position: number;
}

export interface SubMenu {
  sub_menu_name: string;
  sub_sub_menu: SubSubMenu[];
}

export interface Menu {
  menu_id: number;
  menu_name: string;
  sub_menu: SubMenu[];
}

export interface TempSubSubMenu {
  sub_sub_menu_id: number;
  sub_sub_menu_name: string;
  sub_sub_menu_position: number;
}

export interface TempSubMenu {
  sub_menu_name: string;
  sub_sub_menu: SubSubMenu;
}

export interface TempMenuItem {
  menu_id: number;
  menu_name: string;
  sub_menu: SubMenu;
}
