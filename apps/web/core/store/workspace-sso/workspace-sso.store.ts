/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { action, makeObservable, observable, runInAction } from "mobx";
import { WorkspaceSSOService } from "@plane/services";
import type { TWorkspaceSSOConfig, TWorkspaceSSOConfigPayload } from "@plane/types";

export interface IWorkspaceSSOStore {
  configs: Map<string, TWorkspaceSSOConfig>;
  loader: boolean;
  fetch: (workspaceSlug: string) => Promise<TWorkspaceSSOConfig | undefined>;
  save: (workspaceSlug: string, data: TWorkspaceSSOConfigPayload) => Promise<TWorkspaceSSOConfig>;
  disable: (workspaceSlug: string) => Promise<TWorkspaceSSOConfig | undefined>;
  config: (workspaceSlug: string) => TWorkspaceSSOConfig | undefined;
}

export class WorkspaceSSOStore implements IWorkspaceSSOStore {
  configs: Map<string, TWorkspaceSSOConfig> = new Map();
  loader = false;

  private service: WorkspaceSSOService;

  constructor() {
    makeObservable(this, {
      configs: observable,
      loader: observable,
      fetch: action,
      save: action,
      disable: action,
    });
    this.service = new WorkspaceSSOService();
  }

  config(workspaceSlug: string): TWorkspaceSSOConfig | undefined {
    return this.configs.get(workspaceSlug);
  }

  async fetch(workspaceSlug: string): Promise<TWorkspaceSSOConfig | undefined> {
    runInAction(() => {
      this.loader = true;
    });
    try {
      const config = await this.service.retrieve(workspaceSlug);
      runInAction(() => {
        if (config) this.configs.set(workspaceSlug, config);
        else this.configs.delete(workspaceSlug);
      });
      return config;
    } finally {
      runInAction(() => {
        this.loader = false;
      });
    }
  }

  async save(workspaceSlug: string, data: TWorkspaceSSOConfigPayload): Promise<TWorkspaceSSOConfig> {
    const config = await this.service.upsert(workspaceSlug, data);
    runInAction(() => {
      this.configs.set(workspaceSlug, config);
    });
    return config;
  }

  async disable(workspaceSlug: string): Promise<TWorkspaceSSOConfig | undefined> {
    const config = await this.service.disable(workspaceSlug);
    runInAction(() => {
      if (config) this.configs.set(workspaceSlug, config);
      else this.configs.delete(workspaceSlug);
    });
    return config;
  }
}
