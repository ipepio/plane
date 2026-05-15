/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { IProject } from "./projects";

export type TProjectTemplatePayload = Record<string, unknown>;

export type TProjectTemplate = {
  id: string;
  name: string;
  description: string;
  icon_props: Record<string, unknown>;
  payload: TProjectTemplatePayload;
  workspace: string;
  project: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
};

export type TProjectTemplateCreatePayload = {
  name: string;
  description?: string;
  icon_props?: Record<string, unknown>;
  payload: TProjectTemplatePayload;
};

export type TProjectTemplateSaveAsPayload = {
  project_id: string;
  name: string;
  description?: string;
  icon_props?: Record<string, unknown>;
};

export type TProjectTemplateInstantiatePayload = {
  name?: string;
  identifier: string;
  variables?: Record<string, string>;
};

export type TProjectTemplateInstantiateResponse = IProject;
