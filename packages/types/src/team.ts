/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { IUserLite } from "./users";

export type TTeamRole = "lead" | "member";

export type TTeam = {
  id: string;
  name: string;
  description: string;
  logo_props: Record<string, unknown>;
  member_count: number;
  workspace: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
};

export type TTeamPayload = {
  name: string;
  description?: string;
  logo_props?: Record<string, unknown>;
};

export type TTeamMember = {
  id: string;
  team: string;
  workspace: string;
  member: string;
  member_detail: IUserLite;
  role: TTeamRole;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
};

export type TTeamMemberPayload = {
  member: string;
  role?: TTeamRole;
};

export type TTeamDetail = TTeam & {
  members: TTeamMember[];
};
