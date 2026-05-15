/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { action, makeObservable, observable, runInAction } from "mobx";
import { ProjectTemplateService } from "@plane/services";
import type {
  TProjectTemplate,
  TProjectTemplateCreatePayload,
  TProjectTemplateInstantiatePayload,
  TProjectTemplateSaveAsPayload,
  IProject,
} from "@plane/types";

export interface IProjectTemplateStore {
  templates: Map<string, TProjectTemplate>;
  loader: boolean;
  fetchAll: (workspaceSlug: string) => Promise<TProjectTemplate[]>;
  create: (workspaceSlug: string, data: TProjectTemplateCreatePayload) => Promise<TProjectTemplate>;
  update: (
    workspaceSlug: string,
    templateId: string,
    data: Partial<TProjectTemplateCreatePayload>
  ) => Promise<TProjectTemplate>;
  destroy: (workspaceSlug: string, templateId: string) => Promise<void>;
  saveAs: (workspaceSlug: string, data: TProjectTemplateSaveAsPayload) => Promise<TProjectTemplate>;
  instantiate: (
    workspaceSlug: string,
    templateId: string,
    data: TProjectTemplateInstantiatePayload
  ) => Promise<IProject>;
  fetchPlaceholders: (workspaceSlug: string, templateId: string) => Promise<string[]>;
}

export class ProjectTemplateStore implements IProjectTemplateStore {
  templates: Map<string, TProjectTemplate> = new Map();
  loader = false;

  private service: ProjectTemplateService;

  constructor() {
    makeObservable(this, {
      templates: observable,
      loader: observable,
      fetchAll: action,
      create: action,
      update: action,
      destroy: action,
      saveAs: action,
      instantiate: action,
      fetchPlaceholders: action,
    });
    this.service = new ProjectTemplateService();
  }

  async fetchAll(workspaceSlug: string) {
    runInAction(() => {
      this.loader = true;
    });
    try {
      const templates = await this.service.list(workspaceSlug);
      runInAction(() => {
        this.templates = new Map(templates.map((template) => [template.id, template]));
      });
      return templates;
    } finally {
      runInAction(() => {
        this.loader = false;
      });
    }
  }

  async create(workspaceSlug: string, data: TProjectTemplateCreatePayload) {
    const template = await this.service.create(workspaceSlug, data);
    runInAction(() => {
      this.templates.set(template.id, template);
    });
    return template;
  }

  async update(workspaceSlug: string, templateId: string, data: Partial<TProjectTemplateCreatePayload>) {
    const template = await this.service.update(workspaceSlug, templateId, data);
    runInAction(() => {
      this.templates.set(template.id, template);
    });
    return template;
  }

  async destroy(workspaceSlug: string, templateId: string) {
    await this.service.destroy(workspaceSlug, templateId);
    runInAction(() => {
      this.templates.delete(templateId);
    });
  }

  async saveAs(workspaceSlug: string, data: TProjectTemplateSaveAsPayload) {
    const template = await this.service.saveAs(workspaceSlug, data);
    runInAction(() => {
      this.templates.set(template.id, template);
    });
    return template;
  }

  async instantiate(workspaceSlug: string, templateId: string, data: TProjectTemplateInstantiatePayload) {
    return this.service.instantiate(workspaceSlug, templateId, data);
  }

  async fetchPlaceholders(workspaceSlug: string, templateId: string) {
    return this.service.placeholders(workspaceSlug, templateId);
  }
}
