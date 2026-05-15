/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { action, makeObservable, observable, runInAction } from "mobx";
import type { TPermission, TRole, TRolePayload } from "@plane/types";
import { RoleService } from "@plane/services";

export interface IRoleStore {
  roles: Map<string, TRole>;
  permissions: TPermission[];
  loader: boolean;
  fetchAll: (workspaceSlug: string) => Promise<void>;
  fetchPermissions: (workspaceSlug: string) => Promise<void>;
  create: (workspaceSlug: string, data: TRolePayload) => Promise<TRole>;
  update: (workspaceSlug: string, roleId: string, data: Partial<TRolePayload>) => Promise<TRole>;
  destroy: (workspaceSlug: string, roleId: string) => Promise<void>;
  getRolePermissions: (workspaceSlug: string, roleId: string) => Promise<string[]>;
  setRolePermissions: (workspaceSlug: string, roleId: string, codes: string[]) => Promise<string[]>;
}

export class RoleStore implements IRoleStore {
  roles: Map<string, TRole> = new Map();
  permissions: TPermission[] = [];
  loader = false;

  private roleService: RoleService;

  constructor() {
    makeObservable(this, {
      roles: observable,
      permissions: observable,
      loader: observable,
      fetchAll: action,
      fetchPermissions: action,
      create: action,
      update: action,
      destroy: action,
    });
    this.roleService = new RoleService();
  }

  async fetchAll(workspaceSlug: string): Promise<void> {
    runInAction(() => {
      this.loader = true;
    });
    try {
      const data = await this.roleService.list(workspaceSlug);
      runInAction(() => {
        this.roles.clear();
        data.forEach((role) => this.roles.set(role.id, role));
      });
    } finally {
      runInAction(() => {
        this.loader = false;
      });
    }
  }

  async fetchPermissions(workspaceSlug: string): Promise<void> {
    const data = await this.roleService.listPermissions(workspaceSlug);
    runInAction(() => {
      this.permissions = data;
    });
  }

  async create(workspaceSlug: string, data: TRolePayload): Promise<TRole> {
    const role = await this.roleService.create(workspaceSlug, data);
    runInAction(() => {
      this.roles.set(role.id, role);
    });
    return role;
  }

  async update(workspaceSlug: string, roleId: string, data: Partial<TRolePayload>): Promise<TRole> {
    const role = await this.roleService.update(workspaceSlug, roleId, data);
    runInAction(() => {
      this.roles.set(role.id, role);
    });
    return role;
  }

  async destroy(workspaceSlug: string, roleId: string): Promise<void> {
    await this.roleService.destroy(workspaceSlug, roleId);
    runInAction(() => {
      this.roles.delete(roleId);
    });
  }

  async getRolePermissions(workspaceSlug: string, roleId: string): Promise<string[]> {
    const result = await this.roleService.getRolePermissions(workspaceSlug, roleId);
    return result.permission_codes;
  }

  async setRolePermissions(workspaceSlug: string, roleId: string, codes: string[]): Promise<string[]> {
    const result = await this.roleService.setRolePermissions(workspaceSlug, roleId, codes);
    runInAction(() => {
      const role = this.roles.get(roleId);
      if (role) {
        this.roles.set(roleId, { ...role, permission_codes: result.permission_codes });
      }
    });
    return result.permission_codes;
  }
}
