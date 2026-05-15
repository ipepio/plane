/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { action, makeObservable, observable, runInAction } from "mobx";
import { WorklogService } from "@plane/services";
import type {
  TIssueWorklog,
  TIssueWorklogPayload,
  TWorkspaceWorklog,
  TWorkspaceWorklogFilters,
  TWorkspaceWorklogGroup,
} from "@plane/types";

export interface IWorklogStore {
  issueWorklogs: Map<string, TIssueWorklog[]>;
  reportRows: TWorkspaceWorklog[];
  reportGroups: TWorkspaceWorklogGroup[];
  loader: boolean;
  reportLoader: boolean;
  fetchIssueWorklogs: (workspaceSlug: string, projectId: string, issueId: string) => Promise<TIssueWorklog[]>;
  createIssueWorklog: (
    workspaceSlug: string,
    projectId: string,
    issueId: string,
    data: TIssueWorklogPayload
  ) => Promise<TIssueWorklog>;
  updateIssueWorklog: (
    workspaceSlug: string,
    projectId: string,
    issueId: string,
    worklogId: string,
    data: Partial<TIssueWorklogPayload>
  ) => Promise<TIssueWorklog>;
  deleteIssueWorklog: (workspaceSlug: string, projectId: string, issueId: string, worklogId: string) => Promise<void>;
  fetchReport: (workspaceSlug: string, filters?: TWorkspaceWorklogFilters) => Promise<void>;
  exportCSV: (workspaceSlug: string, filters?: TWorkspaceWorklogFilters) => Promise<Blob>;
}

const issueKey = (projectId: string, issueId: string) => `${projectId}:${issueId}`;

export class WorklogStore implements IWorklogStore {
  issueWorklogs: Map<string, TIssueWorklog[]> = new Map();
  reportRows: TWorkspaceWorklog[] = [];
  reportGroups: TWorkspaceWorklogGroup[] = [];
  loader = false;
  reportLoader = false;

  private service: WorklogService;

  constructor() {
    makeObservable(this, {
      issueWorklogs: observable,
      reportRows: observable,
      reportGroups: observable,
      loader: observable,
      reportLoader: observable,
      fetchIssueWorklogs: action,
      createIssueWorklog: action,
      updateIssueWorklog: action,
      deleteIssueWorklog: action,
      fetchReport: action,
      exportCSV: action,
    });
    this.service = new WorklogService();
  }

  async fetchIssueWorklogs(workspaceSlug: string, projectId: string, issueId: string) {
    runInAction(() => {
      this.loader = true;
    });
    try {
      const worklogs = await this.service.listByIssue(workspaceSlug, projectId, issueId);
      runInAction(() => {
        this.issueWorklogs.set(issueKey(projectId, issueId), worklogs);
      });
      return worklogs;
    } finally {
      runInAction(() => {
        this.loader = false;
      });
    }
  }

  async createIssueWorklog(workspaceSlug: string, projectId: string, issueId: string, data: TIssueWorklogPayload) {
    const worklog = await this.service.create(workspaceSlug, projectId, issueId, data);
    runInAction(() => {
      const key = issueKey(projectId, issueId);
      this.issueWorklogs.set(key, [worklog, ...(this.issueWorklogs.get(key) ?? [])]);
    });
    return worklog;
  }

  async updateIssueWorklog(
    workspaceSlug: string,
    projectId: string,
    issueId: string,
    worklogId: string,
    data: Partial<TIssueWorklogPayload>
  ) {
    const worklog = await this.service.update(workspaceSlug, projectId, issueId, worklogId, data);
    runInAction(() => {
      const key = issueKey(projectId, issueId);
      this.issueWorklogs.set(
        key,
        (this.issueWorklogs.get(key) ?? []).map((item) => (item.id === worklogId ? worklog : item))
      );
    });
    return worklog;
  }

  async deleteIssueWorklog(workspaceSlug: string, projectId: string, issueId: string, worklogId: string) {
    await this.service.destroy(workspaceSlug, projectId, issueId, worklogId);
    runInAction(() => {
      const key = issueKey(projectId, issueId);
      this.issueWorklogs.set(
        key,
        (this.issueWorklogs.get(key) ?? []).filter((item) => item.id !== worklogId)
      );
    });
  }

  async fetchReport(workspaceSlug: string, filters: TWorkspaceWorklogFilters = {}) {
    runInAction(() => {
      this.reportLoader = true;
    });
    try {
      const response = await this.service.report(workspaceSlug, filters);
      runInAction(() => {
        if (filters.group_by) {
          this.reportRows = [];
          this.reportGroups = response as TWorkspaceWorklogGroup[];
        } else {
          this.reportRows = response as TWorkspaceWorklog[];
          this.reportGroups = [];
        }
      });
    } finally {
      runInAction(() => {
        this.reportLoader = false;
      });
    }
  }

  async exportCSV(workspaceSlug: string, filters: TWorkspaceWorklogFilters = {}) {
    return this.service.exportCSV(workspaceSlug, filters);
  }
}
