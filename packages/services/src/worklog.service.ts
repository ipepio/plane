/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { API_BASE_URL } from "@plane/constants";
import type {
  TIssueWorklog,
  TIssueWorklogPayload,
  TWorkspaceWorklog,
  TWorkspaceWorklogFilters,
  TWorkspaceWorklogGroup,
} from "@plane/types";
import { APIService } from "./api.service";

type TPaginatedResponse<T> = {
  results: T[];
};

const buildWorklogSearchParams = (filters: TWorkspaceWorklogFilters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    params.set(key, String(value));
  });
  return params.toString();
};

export class WorklogService extends APIService {
  constructor(BASE_URL?: string) {
    super(BASE_URL || API_BASE_URL);
  }

  async listByIssue(workspaceSlug: string, projectId: string, issueId: string): Promise<TIssueWorklog[]> {
    return this.get(`/api/workspaces/${workspaceSlug}/projects/${projectId}/issues/${issueId}/worklogs/`)
      .then((response) => {
        const data = response?.data as TIssueWorklog[] | TPaginatedResponse<TIssueWorklog>;
        return Array.isArray(data) ? data : data.results;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async create(
    workspaceSlug: string,
    projectId: string,
    issueId: string,
    data: TIssueWorklogPayload
  ): Promise<TIssueWorklog> {
    return this.post(`/api/workspaces/${workspaceSlug}/projects/${projectId}/issues/${issueId}/worklogs/`, data)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async update(
    workspaceSlug: string,
    projectId: string,
    issueId: string,
    worklogId: string,
    data: Partial<TIssueWorklogPayload>
  ): Promise<TIssueWorklog> {
    return this.patch(
      `/api/workspaces/${workspaceSlug}/projects/${projectId}/issues/${issueId}/worklogs/${worklogId}/`,
      data
    )
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async destroy(workspaceSlug: string, projectId: string, issueId: string, worklogId: string): Promise<void> {
    return this.delete(
      `/api/workspaces/${workspaceSlug}/projects/${projectId}/issues/${issueId}/worklogs/${worklogId}/`
    )
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async report(
    workspaceSlug: string,
    filters: TWorkspaceWorklogFilters = {}
  ): Promise<TWorkspaceWorklog[] | TWorkspaceWorklogGroup[]> {
    const params = buildWorklogSearchParams(filters);
    return this.get(`/api/workspaces/${workspaceSlug}/worklogs/${params ? `?${params}` : ""}`)
      .then((response) => {
        const data = response?.data as
          | TWorkspaceWorklog[]
          | TWorkspaceWorklogGroup[]
          | TPaginatedResponse<TWorkspaceWorklog>;
        return Array.isArray(data) ? data : data.results;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async exportCSV(workspaceSlug: string, filters: TWorkspaceWorklogFilters = {}): Promise<Blob> {
    const params = buildWorklogSearchParams(filters);
    return this.get(
      `/api/workspaces/${workspaceSlug}/worklogs/export/${params ? `?${params}` : ""}`,
      {},
      { responseType: "blob" }
    )
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }
}
