/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { action, makeObservable, observable, runInAction } from "mobx";
import { TeamService } from "@plane/services";
import type { TTeam, TTeamDetail, TTeamMember, TTeamMemberPayload, TTeamPayload } from "@plane/types";

export interface ITeamStore {
  teams: Map<string, TTeamDetail>;
  loader: boolean;
  fetchAll: (workspaceSlug: string) => Promise<TTeam[]>;
  retrieve: (workspaceSlug: string, teamId: string) => Promise<TTeamDetail>;
  create: (workspaceSlug: string, data: TTeamPayload) => Promise<TTeamDetail>;
  update: (workspaceSlug: string, teamId: string, data: Partial<TTeamPayload>) => Promise<TTeam>;
  destroy: (workspaceSlug: string, teamId: string) => Promise<void>;
  addMembers: (workspaceSlug: string, teamId: string, members: TTeamMemberPayload[]) => Promise<TTeamMember[]>;
  updateMember: (
    workspaceSlug: string,
    teamId: string,
    memberId: string,
    data: Partial<TTeamMemberPayload>
  ) => Promise<TTeamMember>;
  removeMember: (workspaceSlug: string, teamId: string, memberId: string) => Promise<void>;
}

export class TeamStore implements ITeamStore {
  teams: Map<string, TTeamDetail> = new Map();
  loader = false;

  private teamService: TeamService;

  constructor() {
    makeObservable(this, {
      teams: observable,
      loader: observable,
      fetchAll: action,
      retrieve: action,
      create: action,
      update: action,
      destroy: action,
      addMembers: action,
      updateMember: action,
      removeMember: action,
    });
    this.teamService = new TeamService();
  }

  async fetchAll(workspaceSlug: string): Promise<TTeam[]> {
    runInAction(() => {
      this.loader = true;
    });
    try {
      const teams = await this.teamService.list(workspaceSlug);
      runInAction(() => {
        teams.forEach((team) => {
          const existing = this.teams.get(team.id);
          this.teams.set(team.id, { ...team, members: existing?.members ?? [] });
        });
      });
      return teams;
    } finally {
      runInAction(() => {
        this.loader = false;
      });
    }
  }

  async retrieve(workspaceSlug: string, teamId: string): Promise<TTeamDetail> {
    const team = await this.teamService.retrieve(workspaceSlug, teamId);
    runInAction(() => {
      this.teams.set(team.id, team);
    });
    return team;
  }

  async create(workspaceSlug: string, data: TTeamPayload): Promise<TTeamDetail> {
    const team = await this.teamService.create(workspaceSlug, data);
    runInAction(() => {
      this.teams.set(team.id, team);
    });
    return team;
  }

  async update(workspaceSlug: string, teamId: string, data: Partial<TTeamPayload>): Promise<TTeam> {
    const team = await this.teamService.update(workspaceSlug, teamId, data);
    runInAction(() => {
      const existing = this.teams.get(teamId);
      this.teams.set(teamId, { ...team, members: existing?.members ?? [] });
    });
    return team;
  }

  async destroy(workspaceSlug: string, teamId: string): Promise<void> {
    await this.teamService.destroy(workspaceSlug, teamId);
    runInAction(() => {
      this.teams.delete(teamId);
    });
  }

  async addMembers(workspaceSlug: string, teamId: string, members: TTeamMemberPayload[]): Promise<TTeamMember[]> {
    const created = await this.teamService.addMembers(workspaceSlug, teamId, members);
    runInAction(() => {
      const team = this.teams.get(teamId);
      if (team) {
        this.teams.set(teamId, {
          ...team,
          member_count: team.member_count + created.length,
          members: [...team.members, ...created],
        });
      }
    });
    return created;
  }

  async updateMember(
    workspaceSlug: string,
    teamId: string,
    memberId: string,
    data: Partial<TTeamMemberPayload>
  ): Promise<TTeamMember> {
    const member = await this.teamService.updateMember(workspaceSlug, teamId, memberId, data);
    runInAction(() => {
      const team = this.teams.get(teamId);
      if (team) {
        this.teams.set(teamId, {
          ...team,
          members: team.members.map((item) => (item.member === memberId ? member : item)),
        });
      }
    });
    return member;
  }

  async removeMember(workspaceSlug: string, teamId: string, memberId: string): Promise<void> {
    await this.teamService.removeMember(workspaceSlug, teamId, memberId);
    runInAction(() => {
      const team = this.teams.get(teamId);
      if (team) {
        this.teams.set(teamId, {
          ...team,
          member_count: Math.max(team.member_count - 1, 0),
          members: team.members.filter((item) => item.member !== memberId),
        });
      }
    });
  }
}
