import { apiClient, type PageResponse } from "../api-client"

export interface RoleResponse {
  roles: Role[]
}

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
  SELLER = "SELLER",
}

export enum Status {
  ACTIVE = "ACTIVE",
  BANNED = "BANNED",
  DELETED = "DELETED",
}

export interface MemberInfoAdminResponse {
  id: string
  name: string
  email: string
  phoneNumber: string
  address: string
  roles: Role[]
  status: Status
  createdAt: string
}

export interface EndPointInfoResponse {
  id: string
  role: Role
  httpMethod: string
  pathPattern: string
}

export interface EndPointRequest {
  role: Role
  httpMethod: string
  pathPattern: string
}

export interface MemberStatusResponse {
  statuses: Status[]
}

export const adminApi = {
  getMemberRoles: () =>
    apiClient.get<RoleResponse>("/member-service/api/v1/admin/members/roles"),
  getMembers: () =>
    apiClient.get<PageResponse<MemberInfoAdminResponse>>(
      "/member-service/api/v1/admin/members"
    ),
  getMembersStatuses: () =>
    apiClient.get<MemberStatusResponse>(
      "/member-service/api/v1/admin/members/statuses"
    ),
  modifyMemberStatus: (id: string, status: Status) =>
    apiClient.patch<void>(`/member-service/api/v1/admin/members/${id}/status`, {
      status,
    }),
  getEndPoints: (params?: { page?: number; size?: number; sort?: string }) =>
    apiClient.get<PageResponse<EndPointInfoResponse>>(
      "/member-service/api/v1/admin/endpoints",
      { params }
    ),
  createEndPoint: (data: EndPointRequest) =>
    apiClient.post<void>("/member-service/api/v1/admin/endpoints", data),
  modifyEndPoint: (id: string, data: EndPointRequest) =>
    apiClient.put<void>(`/member-service/api/v1/admin/endpoints/${id}`, data),
  deleteEndPoint: (id: string) =>
    apiClient.delete<void>(`/member-service/api/v1/admin/endpoints/${id}`),
}
