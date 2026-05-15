/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

"use client";

import { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, UsersRound } from "lucide-react";
import { EUserPermissions, EUserPermissionsLevel } from "@plane/constants";
import { useTranslation } from "@plane/i18n";
import { TOAST_TYPE, setToast } from "@plane/propel/toast";
import { AlertModalCore, Button, Input, ModalCore } from "@plane/ui";
import type { TTeam, TTeamPayload } from "@plane/types";
import { NotAuthorizedView } from "@/components/auth-screens/not-authorized-view";
import { PageHead } from "@/components/core/page-title";
import { SettingsContentWrapper } from "@/components/settings/content-wrapper";
import { useTeam } from "@/hooks/store/use-team";
import { useUserPermissions } from "@/hooks/store/user";
import { useWorkspace } from "@/hooks/store/use-workspace";

type Props = {
  params: {
    workspaceSlug: string;
  };
};

const TeamFormModal = observer(function TeamFormModal({
  initialTeam,
  isOpen,
  onClose,
  onSubmit,
}: {
  initialTeam?: TTeam;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: TTeamPayload) => Promise<void>;
}) {
  const [name, setName] = useState(initialTeam?.name ?? "");
  const [description, setDescription] = useState(initialTeam?.description ?? "");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setName(initialTeam?.name ?? "");
    setDescription(initialTeam?.description ?? "");
  }, [initialTeam, isOpen]);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit({ name: name.trim(), description: description.trim() });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalCore isOpen={isOpen} handleClose={onClose}>
      <div className="flex flex-col gap-4 p-5">
        <h3 className="text-h3-medium text-primary">{initialTeam ? "Edit team" : "Create team"}</h3>
        <div>
          <label htmlFor="team-name" className="mb-1 block text-body-sm-medium text-secondary">
            Name *
          </label>
          <Input id="team-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Backend" />
        </div>
        <div>
          <label htmlFor="team-description" className="mb-1 block text-body-sm-medium text-secondary">
            Description
          </label>
          <Input
            id="team-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What this team owns"
          />
        </div>
        <div className="flex items-center justify-end gap-2">
          <Button variant="neutral-primary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} loading={submitting} disabled={!name.trim()}>
            {initialTeam ? "Save" : "Create"}
          </Button>
        </div>
      </div>
    </ModalCore>
  );
});

const TeamsSettingsPage = observer(function TeamsSettingsPage({ params }: Props) {
  const { workspaceSlug } = params;
  const [createModal, setCreateModal] = useState(false);
  const [editTeam, setEditTeam] = useState<TTeam | undefined>();
  const [deleteTeam, setDeleteTeam] = useState<TTeam | null>(null);
  const [deleting, setDeleting] = useState(false);

  const router = useRouter();
  const teamStore = useTeam();
  const { allowPermissions, workspaceUserInfo } = useUserPermissions();
  const { currentWorkspace } = useWorkspace();
  const { t } = useTranslation();

  const canManageTeams = allowPermissions(
    [EUserPermissions.ADMIN, EUserPermissions.MEMBER],
    EUserPermissionsLevel.WORKSPACE
  );

  useEffect(() => {
    teamStore.fetchAll(workspaceSlug);
  }, [teamStore, workspaceSlug]);

  const teams = Array.from(teamStore.teams.values());
  const pageTitle = currentWorkspace?.name ? `${currentWorkspace.name} - Teams` : undefined;

  if (workspaceUserInfo && !canManageTeams) {
    return <NotAuthorizedView section="settings" className="h-auto" />;
  }

  const handleCreate = async (payload: TTeamPayload) => {
    try {
      const team = await teamStore.create(workspaceSlug, payload);
      setToast({ type: TOAST_TYPE.SUCCESS, title: "Team created" });
      router.push(`/${workspaceSlug}/settings/teams/${team.id}`);
    } catch {
      setToast({ type: TOAST_TYPE.ERROR, title: "Failed to create team" });
    }
  };

  const handleUpdate = async (payload: TTeamPayload) => {
    if (!editTeam) return;
    try {
      await teamStore.update(workspaceSlug, editTeam.id, payload);
      setToast({ type: TOAST_TYPE.SUCCESS, title: "Team updated" });
      setEditTeam(undefined);
    } catch {
      setToast({ type: TOAST_TYPE.ERROR, title: "Failed to update team" });
    }
  };

  const handleDelete = async () => {
    if (!deleteTeam) return;
    setDeleting(true);
    try {
      await teamStore.destroy(workspaceSlug, deleteTeam.id);
      setToast({ type: TOAST_TYPE.SUCCESS, title: "Team deleted" });
      setDeleteTeam(null);
    } catch {
      setToast({ type: TOAST_TYPE.ERROR, title: "Failed to delete team" });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <SettingsContentWrapper>
      <PageHead title={pageTitle} />
      <TeamFormModal isOpen={createModal} onClose={() => setCreateModal(false)} onSubmit={handleCreate} />
      <TeamFormModal
        initialTeam={editTeam}
        isOpen={!!editTeam}
        onClose={() => setEditTeam(undefined)}
        onSubmit={handleUpdate}
      />
      <AlertModalCore
        isOpen={!!deleteTeam}
        handleClose={() => setDeleteTeam(null)}
        handleSubmit={handleDelete}
        isSubmitting={deleting}
        title="Delete team"
        content={`Delete ${deleteTeam?.name ?? "this team"}? Existing issues will keep their history but the team assignment will be hidden.`}
      />
      <div className="flex items-center justify-between pb-4">
        <h3 className="text-h3-medium">{t("workspace_settings.settings.teams.title")}</h3>
        <Button variant="primary" size="sm" onClick={() => setCreateModal(true)}>
          New team
        </Button>
      </div>
      {teamStore.loader ? (
        <div className="py-8 text-center text-body-sm-regular text-tertiary">Loading teams...</div>
      ) : teams.length === 0 ? (
        <div className="rounded-md border border-subtle px-4 py-8 text-center text-body-sm-regular text-tertiary">
          No teams yet.
        </div>
      ) : (
        <div className="divide-y divide-subtle rounded-md border border-subtle">
          {teams.map((team) => (
            <div key={team.id} className="flex items-center gap-4 px-4 py-3">
              <button
                type="button"
                onClick={() => router.push(`/${workspaceSlug}/settings/teams/${team.id}`)}
                className="flex min-w-0 flex-1 items-center gap-3 text-left"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded bg-surface-2 text-body-sm-medium text-secondary">
                  {team.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-body-sm-medium text-primary">{team.name}</div>
                  <div className="truncate text-caption-xs-regular text-tertiary">
                    {team.description || "No description"}
                  </div>
                </div>
              </button>
              <div className="flex shrink-0 items-center gap-1 text-body-sm-regular text-secondary">
                <UsersRound className="size-4" />
                {team.member_count}
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => setEditTeam(team)}
                  className="rounded p-1 text-secondary hover:bg-surface-2 hover:text-primary"
                >
                  <Pencil className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTeam(team)}
                  className="hover:text-red-500 rounded p-1 text-secondary hover:bg-surface-2"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </SettingsContentWrapper>
  );
});

export default TeamsSettingsPage;
