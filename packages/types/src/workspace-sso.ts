/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

export type TWorkspaceSSOConfig = {
  id: string;
  enabled: boolean;
  allowed_domains: string[];
  auto_provision_role: number;
  created_at: string;
  updated_at: string;
};

export type TWorkspaceSSOConfigPayload = {
  enabled: boolean;
  allowed_domains: string[];
  auto_provision_role: number;
};
