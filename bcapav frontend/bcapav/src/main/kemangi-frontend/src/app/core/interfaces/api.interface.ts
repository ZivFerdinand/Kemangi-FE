export interface DropdownListParams {
  limit: number;
  query: string;
}

export interface UserListResponse {
  statusCode: string;
  message: string | null;
  errorMessages: [];
  data: UserList[];
}

export interface UserList {
  userId: string;
  roleId: string;
  roleGroup: string;
  fullName: string;
}
