/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { API_BASE_URL } from "@plane/constants";
import type { TTeam, TTeamDetail, TTeamMember, TTeamMemberPayload, TTeamPayload } from "@plane/types";
import { APIService } from "./api.service";

export class TeamService extends APIService {
  constructor(BASE_URL?: string) {
    super(BASE_URL || API_BASE_URL);
  }

  async list(workspaceSlug: string): Promise<TTeam[]> {
    return this.get(`/api/workspaces/${workspaceSlug}/teams/`)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async retrieve(workspaceSlug: string, teamId: string): Promise<TTeamDetail> {
    return this.get(`/api/workspaces/${workspaceSlug}/teams/${teamId}/`)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async create(workspaceSlug: string, data: TTeamPayload): Promise<TTeamDetail> {
    return this.post(`/api/workspaces/${workspaceSlug}/teams/`, data)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async update(workspaceSlug: string, teamId: string, data: Partial<TTeamPayload>): Promise<TTeam> {
    return this.patch(`/api/workspaces/${workspaceSlug}/teams/${teamId}/`, data)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async destroy(workspaceSlug: string, teamId: string): Promise<void> {
    return this.delete(`/api/workspaces/${workspaceSlug}/teams/${teamId}/`)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async addMembers(workspaceSlug: string, teamId: string, members: TTeamMemberPayload[]): Promise<TTeamMember[]> {
    return this.post(`/api/workspaces/${workspaceSlug}/teams/${teamId}/members/`, { members })
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async updateMember(
    workspaceSlug: string,
    teamId: string,
    memberId: string,
    data: Partial<TTeamMemberPayload>
  ): Promise<TTeamMember> {
    return this.patch(`/api/workspaces/${workspaceSlug}/teams/${teamId}/members/${memberId}/`, data)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async removeMember(workspaceSlug: string, teamId: string, memberId: string): Promise<void> {
    return this.delete(`/api/workspaces/${workspaceSlug}/teams/${teamId}/members/${memberId}/`)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async search(workspaceSlug: string, query: string): Promise<TTeam[]> {
    const searchParams = new URLSearchParams({ q: query });
    return this.get(`/api/workspaces/${workspaceSlug}/teams/search/?${searchParams.toString()}`)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }
}
