export interface BreadcrumbProps {
  label: string;
  url?: string;
}

export interface TabProps {
  label: string;
  value: string;
}

export interface FiltersDisplayStruct {
  label: string;
  value: string | null;
}

export interface FileProps {
  extension: string | null;
  generatedName: string | null;
  originalName: string | null;
  url?: string | null;
}

export interface FilePropsApi {
  extension: string | null;
  generated_name: string | null;
  original_name: string | null;
  url?: string | null;
}

export interface ResponseUploadFileApi {
  status: true;
  original_name: string;
  extension: string;
  generated_name: string;
  msg: string;
  url: string;
}

export interface ResponseUploadFile {
  status: true;
  originalName: string;
  extension: string;
  generatedName: string;
  msg: string;
  url: string;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface ApprovalPayload {
  apprId: number | null;
  approvalStatus: string;
  note: string;
}

export interface ApprovalPayloadApi {
  appr_id: number | null;
  approval_status: string;
  note: string;
}

export interface BackPage<T> {
  initValue: T;
  currentValue: T;
}

export interface UserProfile {
  userId: string | null;
  roleId: string | null;
  roleName: string | null;
  groupId: string | null;
  fullName: string | null;
  email: string | null;
  phoneNumber: string | null;
  branchCode: string | null;
  branchName: string | null;
  menuCode: string[] | null;
}
