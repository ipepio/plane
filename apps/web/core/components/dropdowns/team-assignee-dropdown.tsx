/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

"use client";

import { useEffect } from "react";
import { observer } from "mobx-react";
import { ChevronDown, UsersRound } from "lucide-react";
import { cn } from "@plane/utils";
import { useTeam } from "@/hooks/store/use-team";

type Props = {
  workspaceSlug: string;
  value?: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
};

export const TeamAssigneeDropdown = observer(function TeamAssigneeDropdown({
  workspaceSlug,
  value = [],
  onChange,
  disabled = false,
}: Props) {
  const teamStore = useTeam();

  useEffect(() => {
    teamStore.fetchAll(workspaceSlug);
  }, [teamStore, workspaceSlug]);

  const teams = Array.from(teamStore.teams.values());
  const selectedIds = new Set(value);
  const selectedTeams = teams.filter((team) => selectedIds.has(team.id));
  const label =
    selectedTeams.length === 0
      ? "Add teams"
      : selectedTeams.length === 1
        ? selectedTeams[0].name
        : `${selectedTeams.length} teams`;

  const handleToggle = (teamId: string) => {
    if (disabled) return;
    if (selectedIds.has(teamId)) {
      onChange(value.filter((id) => id !== teamId));
      return;
    }
    onChange([...value, teamId]);
  };

  return (
    <details className="group/team relative w-full">
      <summary
        className={cn(
          "flex h-7.5 cursor-pointer list-none items-center justify-between rounded px-2 text-body-xs-regular text-primary hover:bg-surface-2",
          {
            "pointer-events-none cursor-not-allowed text-secondary": disabled,
            "text-placeholder": selectedTeams.length === 0,
          }
        )}
      >
        <span className="flex min-w-0 items-center gap-2">
          {selectedTeams.length > 0 && <UsersRound className="size-3.5 shrink-0 text-secondary" />}
          <span className="truncate">{label}</span>
        </span>
        <ChevronDown className="hidden size-3.5 shrink-0 text-secondary group-hover/team:block" />
      </summary>
      {!disabled && (
        <div className="shadow-custom-shadow-sm absolute right-0 z-20 mt-1 max-h-64 w-56 overflow-y-auto rounded-md border border-subtle bg-surface-1 p-1">
          {teams.length === 0 ? (
            <div className="px-2 py-2 text-caption-xs-regular text-tertiary">No teams found.</div>
          ) : (
            teams.map((team) => (
              <label
                key={team.id}
                className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-body-xs-regular text-primary hover:bg-surface-2"
              >
                <input
                  type="checkbox"
                  checked={selectedIds.has(team.id)}
                  onChange={() => handleToggle(team.id)}
                  className="size-3.5"
                />
                <span className="flex size-5 shrink-0 items-center justify-center rounded bg-surface-2 text-caption-xs-medium text-secondary">
                  {team.name.charAt(0).toUpperCase()}
                </span>
                <span className="min-w-0 flex-1 truncate">{team.name}</span>
              </label>
            ))
          )}
        </div>
      )}
    </details>
  );
});
