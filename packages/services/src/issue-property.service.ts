/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { API_BASE_URL } from "@plane/constants";
import type {
  TIssueProperty,
  TIssuePropertyOption,
  TIssuePropertyOptionPayload,
  TIssuePropertyPayload,
  TIssuePropertyValue,
  TIssuePropertyValuePayload,
  TProjectIssueType,
} from "@plane/types";
import { APIService } from "./api.service";

export class IssuePropertyService extends APIService {
  constructor(BASE_URL?: string) {
    super(BASE_URL || API_BASE_URL);
  }

  async listIssueTypes(workspaceSlug: string, projectId: string): Promise<TProjectIssueType[]> {
    return this.get(`/api/workspaces/${workspaceSlug}/projects/${projectId}/issue-types/`)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async listProperties(workspaceSlug: string, projectId: string, issueTypeId: string): Promise<TIssueProperty[]> {
    return this.get(`/api/workspaces/${workspaceSlug}/projects/${projectId}/issue-types/${issueTypeId}/properties/`)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async createProperty(
    workspaceSlug: string,
    projectId: string,
    issueTypeId: string,
    data: TIssuePropertyPayload
  ): Promise<TIssueProperty> {
    return this.post(
      `/api/workspaces/${workspaceSlug}/projects/${projectId}/issue-types/${issueTypeId}/properties/`,
      data
    )
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async updateProperty(
    workspaceSlug: string,
    projectId: string,
    issueTypeId: string,
    propertyId: string,
    data: Partial<TIssuePropertyPayload>
  ): Promise<TIssueProperty> {
    return this.patch(
      `/api/workspaces/${workspaceSlug}/projects/${projectId}/issue-types/${issueTypeId}/properties/${propertyId}/`,
      data
    )
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async deleteProperty(
    workspaceSlug: string,
    projectId: string,
    issueTypeId: string,
    propertyId: string
  ): Promise<void> {
    return this.delete(
      `/api/workspaces/${workspaceSlug}/projects/${projectId}/issue-types/${issueTypeId}/properties/${propertyId}/`
    )
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async reorderProperties(
    workspaceSlug: string,
    projectId: string,
    issueTypeId: string,
    propertyIds: string[]
  ): Promise<TIssueProperty[]> {
    return this.post(
      `/api/workspaces/${workspaceSlug}/projects/${projectId}/issue-types/${issueTypeId}/properties/reorder/`,
      {
        property_ids: propertyIds,
      }
    )
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async createOption(
    workspaceSlug: string,
    projectId: string,
    issueTypeId: string,
    propertyId: string,
    data: TIssuePropertyOptionPayload
  ): Promise<TIssuePropertyOption> {
    return this.post(
      `/api/workspaces/${workspaceSlug}/projects/${projectId}/issue-types/${issueTypeId}/properties/${propertyId}/options/`,
      data
    )
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async updateOption(
    workspaceSlug: string,
    projectId: string,
    issueTypeId: string,
    propertyId: string,
    optionId: string,
    data: Partial<TIssuePropertyOptionPayload>
  ): Promise<TIssuePropertyOption> {
    return this.patch(
      `/api/workspaces/${workspaceSlug}/projects/${projectId}/issue-types/${issueTypeId}/properties/${propertyId}/options/${optionId}/`,
      data
    )
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async deleteOption(
    workspaceSlug: string,
    projectId: string,
    issueTypeId: string,
    propertyId: string,
    optionId: string
  ): Promise<void> {
    return this.delete(
      `/api/workspaces/${workspaceSlug}/projects/${projectId}/issue-types/${issueTypeId}/properties/${propertyId}/options/${optionId}/`
    )
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async listValues(workspaceSlug: string, projectId: string, issueId: string): Promise<TIssuePropertyValue[]> {
    return this.get(`/api/workspaces/${workspaceSlug}/projects/${projectId}/issues/${issueId}/property-values/`)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async updateValues(
    workspaceSlug: string,
    projectId: string,
    issueId: string,
    values: TIssuePropertyValuePayload[]
  ): Promise<TIssuePropertyValue[]> {
    return this.post(`/api/workspaces/${workspaceSlug}/projects/${projectId}/issues/${issueId}/property-values/`, {
      values,
    })
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }
}
