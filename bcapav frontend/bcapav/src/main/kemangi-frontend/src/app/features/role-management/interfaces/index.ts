export interface RolePayload {
  role_id: string;
  role_name: string;
  role_group: string;
  role_description: string;
  is_reviewer: Boolean;
  active_status: Boolean;
  menu_ids: Number[] | [];
}

export interface RolesTable {
  id: number;
  roleId: string;
  roleName: string;
  roleGroup: string;
  roleDescription: string;
  createdBy: string | null;
  createdDt: string;
  lastUpdatedBy: string;
  lastUpdatedDt: string;
  lastApprovalId: string;
  lastApprovalDt: string;
  activeStatus: boolean;
  hasPendingRequest: true;
  hasUserRelation: false;
}
