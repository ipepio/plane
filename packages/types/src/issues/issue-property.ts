/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { IUserLite } from "../users";

export type TIssuePropertyType =
  | "text"
  | "long_text"
  | "number"
  | "date"
  | "boolean"
  | "select"
  | "multi_select"
  | "user"
  | "url";

export type TIssueTypeLite = {
  id: string;
  name: string;
  description: string;
  logo_props: Record<string, unknown>;
  is_default: boolean;
  is_active: boolean;
  is_epic: boolean;
};

export type TProjectIssueType = {
  id: string;
  workspace: string;
  project: string;
  issue_type: string;
  issue_type_detail: TIssueTypeLite;
  level: number;
  is_default: boolean;
};

export type TIssuePropertyOption = {
  id: string;
  workspace: string;
  project: string;
  property: string;
  name: string;
  value: string;
  color: string;
  relative_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
};

export type TIssueProperty = {
  id: string;
  workspace: string;
  project: string;
  issue_type: string;
  name: string;
  display_name: string;
  type: TIssuePropertyType;
  config: Record<string, unknown>;
  is_required: boolean;
  is_active: boolean;
  relative_order: number;
  options: TIssuePropertyOption[];
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
};

export type TIssuePropertyPayload = {
  name: string;
  display_name: string;
  type: TIssuePropertyType;
  config?: Record<string, unknown>;
  is_required?: boolean;
  is_active?: boolean;
  relative_order?: number;
};

export type TIssuePropertyOptionPayload = {
  name: string;
  value: string;
  color?: string;
  relative_order?: number;
  is_active?: boolean;
};

export type TIssuePropertyPrimitiveValue = string | number | boolean | string[] | null;

export type TIssuePropertyValue = {
  id: string;
  workspace: string;
  project: string;
  issue: string;
  property: string;
  property_detail: TIssueProperty;
  value: TIssuePropertyPrimitiveValue;
  value_text: string | null;
  value_number: string | null;
  value_datetime: string | null;
  value_boolean: boolean | null;
  value_user: string | null;
  value_user_detail: IUserLite | null;
  value_option: string | null;
  selected_option_details: TIssuePropertyOption[];
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
};

export type TIssuePropertyValuePayload = {
  property: string;
  value: TIssuePropertyPrimitiveValue;
};
