/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { action, makeObservable, observable, runInAction } from "mobx";
import { IssuePropertyService } from "@plane/services";
import type { TIssuePropertyValue, TIssuePropertyValuePayload } from "@plane/types";

export interface IIssuePropertyValueStore {
  valuesByIssue: Map<string, TIssuePropertyValue[]>;
  loader: boolean;
  fetchValues: (workspaceSlug: string, projectId: string, issueId: string) => Promise<TIssuePropertyValue[]>;
  updateValues: (
    workspaceSlug: string,
    projectId: string,
    issueId: string,
    values: TIssuePropertyValuePayload[]
  ) => Promise<TIssuePropertyValue[]>;
}

export class IssuePropertyValueStore implements IIssuePropertyValueStore {
  valuesByIssue: Map<string, TIssuePropertyValue[]> = new Map();
  loader = false;

  private service: IssuePropertyService;

  constructor() {
    makeObservable(this, {
      valuesByIssue: observable,
      loader: observable,
      fetchValues: action,
      updateValues: action,
    });
    this.service = new IssuePropertyService();
  }

  async fetchValues(workspaceSlug: string, projectId: string, issueId: string) {
    runInAction(() => {
      this.loader = true;
    });
    try {
      const values = await this.service.listValues(workspaceSlug, projectId, issueId);
      runInAction(() => {
        this.valuesByIssue.set(issueId, values);
      });
      return values;
    } finally {
      runInAction(() => {
        this.loader = false;
      });
    }
  }

  async updateValues(workspaceSlug: string, projectId: string, issueId: string, values: TIssuePropertyValuePayload[]) {
    const response = await this.service.updateValues(workspaceSlug, projectId, issueId, values);
    runInAction(() => {
      this.valuesByIssue.set(issueId, response);
    });
    return response;
  }
}
