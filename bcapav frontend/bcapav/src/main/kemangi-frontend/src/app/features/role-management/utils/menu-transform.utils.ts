// utils/menu-transform.ts

// export interface MenuRow {
//   subMenu: string;
//   position: number;

//   Requested?: boolean;
//   Task?: boolean;

//   levels: string[];
//   selectedLevel?: string; // 🔥 tambahin ini

//   // optional: kalau masih butuh dynamic
//   [key: string]: string | boolean | string[] | number | undefined;
// }

// export interface MenuSection {
//   title: string;

//   columns: MenuColumn[]; // 🔥 bukan string[]
//   rows: MenuRow[];
// }

// type MenuColumn = 'Requested' | 'Task';

// export function transformMenu(data: any[]): MenuSection[] {
//   const groupedByParent = data.reduce(
//     (acc, item) => {
//       if (!acc[item.parent]) acc[item.parent] = [];
//       acc[item.parent].push(item);
//       return acc;
//     },
//     {} as Record<number, any[]>,
//   );

//   return Object.values(groupedByParent)
//     .map((group: any) => {
//       const rows: Record<string, any> = {};
//       const columns = new Set<string>();
//       let title = '';

//       group.forEach((item: any) => {
//         const parts = item.menu_name.split(' - ').map((s: string) => s.trim());

//         const main = parts[0];
//         const subMenu = parts[1];
//         let col = parts[2] || '';

//         if (col.includes('Requested')) col = 'Requested';
//         else if (col.includes('Task')) col = 'Task';
//         else return;

//         title = main;
//         columns.add(col);

//         if (!rows[subMenu]) {
//           rows[subMenu] = {
//             subMenu,
//             Requested: false,
//             Task: false,
//             levels: new Set<string>(),
//             _positions: [],
//           };
//         }

//         rows[subMenu][col] = true;
//         rows[subMenu]._positions.push(item.position);

//         // detect level dari menu_code
//         if (item.menu_code.includes('LV1')) {
//           rows[subMenu].levels.add('1');
//         }
//         if (item.menu_code.includes('LV2')) {
//           rows[subMenu].levels.add('2');
//         }
//       });

//       if (columns.size === 0) return null;

//       const sortedRows = Object.values(rows)
//         .map((r: any) => ({
//           ...r,
//           position: Math.min(...r._positions),
//           levels: Array.from(r.levels),
//         }))
//         .sort((a, b) => a.position - b.position);

//       return {
//         title,
//         columns: Array.from(columns),
//         rows: sortedRows,
//       };
//     })
//     .filter(Boolean) as MenuSection[];
// }

// export interface MenuSection {
//   title: string;
//   type: MenuType;
//   columns: string[];
//   rows: any[];
// }

// utils/menu-transform.ts

export type MenuType = 'approval' | 'dynamic' | 'alert';

export interface MenuRow {
  subMenu: string;
  position: number;

  // checkbox state
  Requested?: boolean;
  Task?: boolean;
  checked?: boolean;

  // approval level
  lv1?: boolean;
  lv2?: boolean;
  selectedLevel?: string;

  // auto lock detail
  detailLocked?: boolean;

  // dynamic columns
  [key: string]: any;

  // important for backend
  ids: Record<string, number>;
  codes: Record<string, string>;
}

export interface MenuSection {
  title: string;
  type: MenuType;
  columns: string[];
  rows: MenuRow[];
  selectedAll: boolean;
}

export function transformMenu(data: any[]): MenuSection[] {
  const grouped = data.reduce(
    (acc, item) => {
      if (!acc[item.parent]) acc[item.parent] = [];
      acc[item.parent].push(item);
      return acc;
    },
    {} as Record<number, any[]>,
  );

  return Object.values(grouped).map((group: any) => {
    const rows: Record<string, any> = {};
    const columns = new Set<string>();

    let title = '';
    let type: MenuType = 'dynamic';

    group.forEach((item: any) => {
      const parts = item.menu_name.split(' - ').map((x: string) => x.trim());

      const main = parts[0] || '';
      const subMenu = parts[1] || 'General';
      const action = parts[2] || '';

      title = main;

      // detect type
      if (main === 'Approval') type = 'approval';
      else if (main === 'Alert Detail') type = 'alert';
      else type = 'dynamic';

      // init row
      if (!rows[subMenu]) {
        rows[subMenu] = {
          subMenu,
          position: 0,
          ids: {},
          codes: {},
          _positions: [],
        };
      }

      const row = rows[subMenu];

      // save position
      row._positions.push(item.position);

      // ==========================
      // APPROVAL
      // ==========================
      if (type === 'approval') {
        let col = '';

        if (action.includes('Requested')) col = 'Requested';
        else if (action.includes('Task')) col = 'Task';

        if (col) {
          columns.add(col);

          row[col] = false;
          row.ids[col] = item.menu_id;
          row.codes[col] = item.menu_code;
        }

        // level approval
        if (item.menu_code.includes('LV1')) {
          row.lv1 = true;
          row.ids['LV1'] = item.menu_id;
        }

        if (item.menu_code.includes('LV2')) {
          row.lv2 = true;
          row.ids['LV2'] = item.menu_id;
        }
      }

      // ==========================
      // DYNAMIC
      // ==========================
      if (type === 'dynamic') {
        if (action) {
          columns.add(action);

          row[action] = false;
          row.ids[action] = item.menu_id;
          row.codes[action] = item.menu_code;
        }
      }

      // ==========================
      // ALERT
      // ==========================
      if (type === 'alert') {
        row.checked = false;
        row.ids['checked'] = item.menu_id;
        row.codes['checked'] = item.menu_code;
      }
    });

    const sortedRows = Object.values(rows)
      .map((row: any) => ({
        ...row,
        position: Math.min(...row._positions),
      }))
      .sort((a: any, b: any) => a.position - b.position);

    return {
      title,
      type,
      columns: [...columns],
      rows: sortedRows,
      selectedAll: false,
    };
  });
}
