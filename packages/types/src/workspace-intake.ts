/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { TPaginatedResponse } from "./pagination";

export enum EWorkspaceIntakeIssueStatus {
  PENDING = -2,
  REJECTED = -1,
  SNOOZED = 0,
  ACCEPTED = 1,
  DUPLICATE = 2,
}

export type TWorkspaceIntakeIssuePriority = "urgent" | "high" | "medium" | "low" | "none";
export type TIntakeFormFieldType =
  | "short_text"
  | "long_text"
  | "number"
  | "date"
  | "boolean"
  | "select"
  | "multi_select"
  | "file"
  | "user";

export type TIntakeFormFieldOption = {
  id: string;
  field: string;
  label: string;
  value: string;
  relative_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type TIntakeFormField = {
  id: string;
  workspace: string;
  project: string | null;
  workspace_intake: string | null;
  intake: string | null;
  label: string;
  placeholder: string;
  help_text: string;
  type: TIntakeFormFieldType;
  config: Record<string, unknown>;
  is_required: boolean;
  relative_order: number;
  is_active: boolean;
  options: TIntakeFormFieldOption[];
  created_at: string;
  updated_at: string;
};

export type TIntakeFormFieldPayload = {
  label: string;
  placeholder?: string;
  help_text?: string;
  type: TIntakeFormFieldType;
  config?: Record<string, unknown>;
  is_required?: boolean;
  relative_order?: number;
  is_active?: boolean;
};

export type TIntakeFormFieldOptionPayload = {
  label: string;
  value: string;
  relative_order?: number;
  is_active?: boolean;
};

export type TIntakeFormValuePayload = {
  field: string;
  value: string | number | boolean | string[] | null;
};

export type TIntakeFormFieldValue = {
  id: string;
  field: string;
  field_detail?: TIntakeFormField;
  value_text: string;
  value_number: string | null;
  value_datetime: string | null;
  value_boolean: boolean | null;
  value_option: string | null;
  selected_options_detail?: TIntakeFormFieldOption[];
  value_file_url: string;
  value_user: string | null;
  created_at: string;
  updated_at: string;
};

export type TWorkspaceIntake = {
  id: string;
  workspace: string;
  name: string;
  description: string;
  is_default: boolean;
  view_props: Record<string, unknown>;
  logo_props: Record<string, unknown>;
  pending_issue_count?: number;
  created_at: string;
  updated_at: string;
};

export type TWorkspaceIntakePayload = {
  name: string;
  description?: string;
  is_default?: boolean;
  view_props?: Record<string, unknown>;
  logo_props?: Record<string, unknown>;
};

export type TWorkspaceIntakeIssue = {
  id: string;
  workspace: string;
  intake: string;
  intake_detail?: TWorkspaceIntake;
  issue: string | null;
  issue_detail?: {
    id: string;
    name: string;
    sequence_id?: number;
    project_id?: string;
  } | null;
  name: string;
  description_json: Record<string, unknown>;
  description_html: string;
  priority: TWorkspaceIntakeIssuePriority;
  status: EWorkspaceIntakeIssueStatus;
  snoozed_till: string | null;
  duplicate_to: string | null;
  duplicate_issue_detail?: {
    id: string;
    name: string;
    status: EWorkspaceIntakeIssueStatus;
  } | null;
  decision_note: string;
  source: string | null;
  source_email: string | null;
  external_source: string | null;
  external_id: string | null;
  extra: Record<string, unknown>;
  form_values?: TIntakeFormFieldValue[];
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
};

export type TWorkspaceIntakeIssuePayload = {
  intake?: string;
  name: string;
  description_json?: Record<string, unknown>;
  description_html?: string;
  priority?: TWorkspaceIntakeIssuePriority;
  extra?: Record<string, unknown>;
  form_values?: TIntakeFormValuePayload[];
};

export type TWorkspaceIntakeIssueAcceptPayload = {
  project: string;
  intake?: string | null;
  state?: string | null;
  assignee_ids?: string[];
};

export type TWorkspaceIntakeIssueRejectPayload = {
  decision_note: string;
};

export type TWorkspaceIntakeIssueSnoozePayload = {
  snoozed_till: string;
};

export type TWorkspaceIntakeIssueDuplicatePayload = {
  duplicate_to: string;
  decision_note?: string;
};

export type TWorkspaceIntakeIssueListResponse = TPaginatedResponse<TWorkspaceIntakeIssue[]>;
