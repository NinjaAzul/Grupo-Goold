export interface IUpdateUserPermissionRequest {
  userId: number;
  permissionId: number;
  granted: boolean;
}

export interface IUpdateUserPermissionResponse {
  success: boolean;
  message: string;
}
