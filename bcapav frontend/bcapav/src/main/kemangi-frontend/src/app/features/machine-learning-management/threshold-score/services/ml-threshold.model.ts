export interface ResponseMLThresholdUploadFileApi {
  status: true;
  original_name: string;
  extension: string;
  generated_name: string;
  msg: string;
  url: string;
}

export interface MLThresholdUploadFileApi {
  original_name: string;
  extension: string;
  generated_name: string;
}
export interface DataGroupUploadFile {
  originalName: string;
  extension: string;
  generatedName: string;
}

export interface MLThresholdDeletePayloadApi {
  data_group_id: string;
  list_files: MLThresholdUploadFileApi[];
}
