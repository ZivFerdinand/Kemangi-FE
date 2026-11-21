import { DataGroupUploadFile } from './data-group.model';

export interface DataGroupForm {
  apprId?: number;
  dataGroupId?: string;
  name: string;
  description: string;
  dynamicWatchList: boolean;
  activeStatus: boolean;
  detailValues: Array<string>;
  listFiles: DataGroupUploadFile[];
}
