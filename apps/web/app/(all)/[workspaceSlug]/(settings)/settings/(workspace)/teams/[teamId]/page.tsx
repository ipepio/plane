/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react";
import Link from "next/link";
import { ChevronLeft, Trash2 } from "lucide-react";
import { EUserPermissions, EUserPermissionsLevel } from "@plane/constants";
import { TOAST_TYPE, setToast } from "@plane/propel/toast";
import { Button } from "@plane/ui";
import type { TTeamRole } from "@plane/types";
import { NotAuthorizedView } from "@/components/auth-screens/not-authorized-view";
import { PageHead } from "@/components/core/page-title";
import { SettingsContentWrapper } from "@/components/settings/content-wrapper";
import { useMember } from "@/hooks/store/use-member";
import { useTeam } from "@/hooks/store/use-team";
import { useUserPermissions } from "@/hooks/store/user";

type Props = {
  params: {
    workspaceSlug: string;
    teamId: string;
  };
};

const TeamDetailPage = observer(function TeamDetailPage({ params }: Props) {
  const { workspaceSlug, teamId } = params;
  const [selectedMember, setSelectedMember] = useState("");
  const [selectedRole, setSelectedRole] = useState<TTeamRole>("member");
  const [submitting, setSubmitting] = useState(false);

  const teamStore = useTeam();
  const memberRoot = useMember();
  const { allowPermissions, workspaceUserInfo } = useUserPermissions();

  const canManageTeams = allowPermissions(
    [EUserPermissions.ADMIN, EUserPermissions.MEMBER],
    EUserPermissionsLevel.WORKSPACE
  );

  useEffect(() => {
    teamStore.retrieve(workspaceSlug, teamId);
    memberRoot.workspace.fetchWorkspaceMembers(workspaceSlug);
  }, [memberRoot.workspace, teamId, teamStore, workspaceSlug]);

  const team = teamStore.teams.get(teamId);
  const existingMemberIds = useMemo(() => new Set(team?.members.map((member) => member.member) ?? []), [team?.members]);
  const workspaceMemberIds = memberRoot.workspace.getWorkspaceMemberIds(workspaceSlug);
  const availableMembers = workspaceMemberIds.filter((memberId) => !existingMemberIds.has(memberId));

  if (workspaceUserInfo && !canManageTeams) {
    return <NotAuthorizedView section="settings" className="h-auto" />;
  }

  const handleAddMember = async () => {
    if (!selectedMember) return;
    setSubmitting(true);
    try {
      await teamStore.addMembers(workspaceSlug, teamId, [{ member: selectedMember, role: selectedRole }]);
      setSelectedMember("");
      setSelectedRole("member");
      setToast({ type: TOAST_TYPE.SUCCESS, title: "Member added" });
    } catch {
      setToast({ type: TOAST_TYPE.ERROR, title: "Failed to add member" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRoleChange = async (memberId: string, role: TTeamRole) => {
    try {
      await teamStore.updateMember(workspaceSlug, teamId, memberId, { role });
      setToast({ type: TOAST_TYPE.SUCCESS, title: "Team role updated" });
    } catch {
      setToast({ type: TOAST_TYPE.ERROR, title: "Failed to update role" });
    }
  };

  const handleRemove = async (memberId: string) => {
    try {
      await teamStore.removeMember(workspaceSlug, teamId, memberId);
      setToast({ type: TOAST_TYPE.SUCCESS, title: "Member removed" });
    } catch {
      setToast({ type: TOAST_TYPE.ERROR, title: "Failed to remove member" });
    }
  };

  if (!team) {
    return (
      <SettingsContentWrapper>
        <div className="py-8 text-center text-body-sm-regular text-tertiary">
          {teamStore.loader ? "Loading team..." : "Team not found."}
        </div>
      </SettingsContentWrapper>
    );
  }

  return (
    <SettingsContentWrapper>
      <PageHead title={`${team.name} - Team`} />
      <div className="pb-4">
        <Link
          href={`/${workspaceSlug}/settings/teams`}
          className="mb-3 inline-flex items-center gap-1 text-body-sm-regular text-secondary hover:text-primary"
        >
          <ChevronLeft className="size-4" />
          Teams
        </Link>
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded bg-surface-2 text-body-sm-medium text-secondary">
            {team.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-h3-medium">{team.name}</h3>
            {team.description && <p className="mt-1 text-body-sm-regular text-tertiary">{team.description}</p>}
          </div>
        </div>
      </div>
      <div className="mb-4 grid grid-cols-1 gap-2 rounded-md border border-subtle p-3 md:grid-cols-[1fr_140px_auto]">
        <select
          value={selectedMember}
          onChange={(event) => setSelectedMember(event.target.value)}
          className="h-8 rounded border border-subtle bg-surface-1 px-2 text-body-sm-regular text-primary"
        >
          <option value="">Select workspace member</option>
          {availableMembers.map((memberId) => {
            const member = memberRoot.workspace.getWorkspaceMemberDetails(memberId)?.member;
            return (
              <option key={memberId} value={memberId}>
                {member?.display_name || member?.email || memberId}
              </option>
            );
          })}
        </select>
        <select
          value={selectedRole}
          onChange={(event) => setSelectedRole(event.target.value as TTeamRole)}
          className="h-8 rounded border border-subtle bg-surface-1 px-2 text-body-sm-regular text-primary"
        >
          <option value="member">Member</option>
          <option value="lead">Lead</option>
        </select>
        <Button size="sm" variant="primary" onClick={handleAddMember} loading={submitting} disabled={!selectedMember}>
          Add member
        </Button>
      </div>
      <div className="divide-y divide-subtle rounded-md border border-subtle">
        {team.members.length === 0 ? (
          <div className="px-4 py-8 text-center text-body-sm-regular text-tertiary">No members in this team.</div>
        ) : (
          team.members.map((teamMember) => {
            const member = teamMember.member_detail;
            return (
              <div key={teamMember.id} className="flex items-center gap-4 px-4 py-3">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-2 text-caption-xs-medium text-secondary">
                    {(member?.display_name || member?.email || "?").charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-body-sm-medium text-primary">
                      {member?.display_name || member?.email}
                    </div>
                    <div className="truncate text-caption-xs-regular text-tertiary">{member?.email}</div>
                  </div>
                </div>
                <select
                  value={teamMember.role}
                  onChange={(event) => handleRoleChange(teamMember.member, event.target.value as TTeamRole)}
                  className="h-8 rounded border border-subtle bg-surface-1 px-2 text-body-sm-regular text-primary"
                >
                  <option value="member">Member</option>
                  <option value="lead">Lead</option>
                </select>
                <button
                  type="button"
                  onClick={() => handleRemove(teamMember.member)}
                  className="hover:text-red-500 rounded p-1 text-secondary hover:bg-surface-2"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </SettingsContentWrapper>
  );
});

export default TeamDetailPage;
