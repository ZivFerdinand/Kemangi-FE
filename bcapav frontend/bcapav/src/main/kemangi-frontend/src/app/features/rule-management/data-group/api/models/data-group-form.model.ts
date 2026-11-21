import { DataGroupUploadFileApi } from './data-group.model';

export interface DataGroupFormApi {
  appr_id?: number | null;
  data_group_id?: string | null;
  name: string | null;
  description: string | null;
  dynamic_watch_list: boolean;
  active_status: boolean;
  detail_values: Array<string>;
  list_files: DataGroupUploadFileApi[];
}
