/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { TIssue } from "./issue";
import type { IProjectLite } from "../project";
import type { IUserLite } from "../users";

export type TIssueWorklog = {
  id: string;
  workspace: string;
  project: string;
  issue: string;
  logged_by: string;
  logged_by_detail: IUserLite;
  duration: number;
  started_at: string;
  description: string;
  is_billable: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
};

export type TWorkspaceWorklog = TIssueWorklog & {
  issue_detail: Pick<TIssue, "id" | "name" | "sequence_id" | "priority">;
  project_detail: IProjectLite;
};

export type TIssueWorklogPayload = {
  duration: number;
  started_at: string;
  description?: string;
  is_billable?: boolean;
};

export type TWorklogGroupBy = "day" | "week" | "month" | "user" | "project";

export type TWorkspaceWorklogFilters = {
  from?: string;
  to?: string;
  user?: string;
  project?: string;
  billable?: boolean;
  group_by?: TWorklogGroupBy;
};

export type TWorkspaceWorklogGroup = {
  group: string;
  label: string;
  total_seconds: number;
  billable_seconds: number;
};
