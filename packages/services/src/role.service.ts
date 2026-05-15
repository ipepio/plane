/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { API_BASE_URL } from "@plane/constants";
import type { TPermission, TRole, TRolePayload } from "@plane/types";
import { APIService } from "./api.service";

export class RoleService extends APIService {
  constructor(BASE_URL?: string) {
    super(BASE_URL || API_BASE_URL);
  }

  async list(workspaceSlug: string): Promise<TRole[]> {
    return this.get(`/api/workspaces/${workspaceSlug}/roles/`)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async create(workspaceSlug: string, data: TRolePayload): Promise<TRole> {
    return this.post(`/api/workspaces/${workspaceSlug}/roles/`, data)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async retrieve(workspaceSlug: string, roleId: string): Promise<TRole> {
    return this.get(`/api/workspaces/${workspaceSlug}/roles/${roleId}/`)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async update(workspaceSlug: string, roleId: string, data: Partial<TRolePayload>): Promise<TRole> {
    return this.patch(`/api/workspaces/${workspaceSlug}/roles/${roleId}/`, data)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async destroy(workspaceSlug: string, roleId: string): Promise<void> {
    return this.delete(`/api/workspaces/${workspaceSlug}/roles/${roleId}/`)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async listPermissions(workspaceSlug: string): Promise<TPermission[]> {
    return this.get(`/api/workspaces/${workspaceSlug}/roles/permissions/`)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async getRolePermissions(workspaceSlug: string, roleId: string): Promise<{ permission_codes: string[] }> {
    return this.get(`/api/workspaces/${workspaceSlug}/roles/${roleId}/permissions/`)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async setRolePermissions(
    workspaceSlug: string,
    roleId: string,
    permissionCodes: string[]
  ): Promise<{ permission_codes: string[] }> {
    return this.put(`/api/workspaces/${workspaceSlug}/roles/${roleId}/permissions/`, {
      permission_codes: permissionCodes,
    })
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }
}
