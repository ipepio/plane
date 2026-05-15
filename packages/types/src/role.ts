/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

export type TPermission = {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
};

export type TRole = {
  id: string;
  workspace: string;
  name: string;
  description: string;
  is_system: boolean;
  level: number | null;
  members_count: number;
  permission_codes: string[];
  created_at: string;
  updated_at: string;
};

export type TRolePayload = {
  name: string;
  description?: string;
};
