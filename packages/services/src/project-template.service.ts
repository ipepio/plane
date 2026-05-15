/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { API_BASE_URL } from "@plane/constants";
import type {
  TProjectTemplate,
  TProjectTemplateCreatePayload,
  TProjectTemplateInstantiatePayload,
  TProjectTemplateInstantiateResponse,
  TProjectTemplateSaveAsPayload,
} from "@plane/types";
import { APIService } from "./api.service";

export class ProjectTemplateService extends APIService {
  constructor(BASE_URL?: string) {
    super(BASE_URL || API_BASE_URL);
  }

  async list(workspaceSlug: string): Promise<TProjectTemplate[]> {
    return this.get(`/api/workspaces/${workspaceSlug}/project-templates/`)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async create(workspaceSlug: string, data: TProjectTemplateCreatePayload): Promise<TProjectTemplate> {
    return this.post(`/api/workspaces/${workspaceSlug}/project-templates/`, data)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async update(
    workspaceSlug: string,
    templateId: string,
    data: Partial<TProjectTemplateCreatePayload>
  ): Promise<TProjectTemplate> {
    return this.patch(`/api/workspaces/${workspaceSlug}/project-templates/${templateId}/`, data)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async destroy(workspaceSlug: string, templateId: string): Promise<void> {
    return this.delete(`/api/workspaces/${workspaceSlug}/project-templates/${templateId}/`)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async saveAs(workspaceSlug: string, data: TProjectTemplateSaveAsPayload): Promise<TProjectTemplate> {
    return this.post(`/api/workspaces/${workspaceSlug}/project-templates/save-as/`, data)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async instantiate(
    workspaceSlug: string,
    templateId: string,
    data: TProjectTemplateInstantiatePayload
  ): Promise<TProjectTemplateInstantiateResponse> {
    return this.post(`/api/workspaces/${workspaceSlug}/project-templates/${templateId}/instantiate/`, data)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async placeholders(workspaceSlug: string, templateId: string): Promise<string[]> {
    return this.get(`/api/workspaces/${workspaceSlug}/project-templates/${templateId}/placeholders/`)
      .then((response) => response?.data?.placeholders ?? [])
      .catch((error) => {
        throw error?.response?.data;
      });
  }
}
