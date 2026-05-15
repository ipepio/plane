/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { API_BASE_URL } from "@plane/constants";
import type { TWorkspaceSSOConfig, TWorkspaceSSOConfigPayload } from "@plane/types";
import { APIService } from "./api.service";

export class WorkspaceSSOService extends APIService {
  constructor(BASE_URL?: string) {
    super(BASE_URL || API_BASE_URL);
  }

  async retrieve(workspaceSlug: string): Promise<TWorkspaceSSOConfig | undefined> {
    return this.get(`/api/workspaces/${workspaceSlug}/sso/`)
      .then((response) => response?.data)
      .catch((error) => {
        if (error?.response?.status === 404) return undefined;
        throw error?.response?.data;
      });
  }

  async upsert(workspaceSlug: string, data: TWorkspaceSSOConfigPayload): Promise<TWorkspaceSSOConfig> {
    return this.put(`/api/workspaces/${workspaceSlug}/sso/`, data)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async disable(workspaceSlug: string): Promise<TWorkspaceSSOConfig | undefined> {
    return this.delete(`/api/workspaces/${workspaceSlug}/sso/`)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }
}
