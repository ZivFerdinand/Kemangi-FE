import { TableQuery } from '../../../../../shared';

export interface DataGroupTableQuery extends TableQuery {
  dataGroupId: Array<string>;
  name: string;
  description: string;
  dynamicWatchList: boolean | null;
  activeStatus: boolean | null;
  requesterId: Array<string>;
  approver1Id: Array<string>;
  approver2Id: Array<string>;
  requestDateFrom: string;
  requestDateTo: string;
  approval1DateFrom: string;
  approval1DateTo: string;
  approval2DateFrom: string;
  approval2DateTo: string;
}

export interface DataGroupTableFilterQuery {
  dataGroupId: Array<string>;
  name: string;
  description: string;
  dynamicWatchList: boolean | null;
  activeStatus: boolean | null;
  requesterId: Array<string>;
  approver1Id: Array<string>;
  approver2Id: Array<string>;
  requestDateFrom: string;
  requestDateTo: string;
  approval1DateFrom: string;
  approval1DateTo: string;
  approval2DateFrom: string;
  approval2DateTo: string;
}

export interface DataGroupTaskListTableQuery extends TableQuery {
  dataGroupId: Array<string> | null;
  name: string;
  description: string;
  activeStatus: boolean | null;
  requestType: string;
  approvalStatus: string;
  requesterId: Array<string> | null;
  approver1Id: Array<string> | null;
  approver2Id: Array<string> | null;
  requestDateFrom: string | null;
  requestDateTo: string | null;
  approval1DateFrom: string | null;
  approval1DateTo: string | null;
  approval2DateFrom: string | null;
  approval2DateTo: string | null;
  dynamicWatchList: boolean | null;
  taskList: boolean | null;
  reviewer1Done: boolean | null;
}

export interface DataGroupTaskListFilterTableQuery {
  dataGroupId: Array<string> | null;
  name: string;
  description: string;
  activeStatus: boolean | null;
  requestType: string;
  requesterId: Array<string> | null;
  approvalStatus: string;
  approver1Id: Array<string> | null;
  approver2Id: Array<string> | null;
  requestDateFrom: string | null;
  requestDateTo: string | null;
  approval1DateFrom: string | null;
  approval1DateTo: string | null;
  approval2DateFrom: string | null;
  approval2DateTo: string | null;
  dynamicWatchList: boolean | null;
}
