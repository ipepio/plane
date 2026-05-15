/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

"use client";

import { useState } from "react";
import { observer } from "mobx-react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { AlertModalCore } from "@plane/ui";
import { TOAST_TYPE, setToast } from "@plane/propel/toast";
import { useTranslation } from "@plane/i18n";
import type { TRole } from "@plane/types";
import { useRole } from "@/hooks/store/use-role";

type Props = {
  workspaceSlug: string;
  roles: TRole[];
};

export const RolesList = observer(function RolesList({ workspaceSlug, roles }: Props) {
  const [deleteRole, setDeleteRole] = useState<TRole | null>(null);
  const [deleting, setDeleting] = useState(false);
  const roleStore = useRole();
  const { t } = useTranslation();

  const handleDelete = async () => {
    if (!deleteRole) return;
    setDeleting(true);
    try {
      await roleStore.destroy(workspaceSlug, deleteRole.id);
      setToast({ type: TOAST_TYPE.SUCCESS, title: t("roles.toasts.deleted") });
      setDeleteRole(null);
    } catch {
      setToast({ type: TOAST_TYPE.ERROR, title: t("roles.toasts.delete_failed") });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <AlertModalCore
        isOpen={!!deleteRole}
        handleClose={() => setDeleteRole(null)}
        handleSubmit={handleDelete}
        isSubmitting={deleting}
        title={t("roles.delete_modal.title")}
        content={t("roles.delete_modal.content").replace("{name}", deleteRole?.name ?? "")}
      />
      <div className="divide-y divide-subtle rounded-md border border-subtle">
        {roles.map((role) => (
          <div key={role.id} className="flex items-center gap-4 px-4 py-3">
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-center gap-2">
                <span className="truncate text-body-sm-medium">{role.name}</span>
                {role.is_system && (
                  <span className="shrink-0 rounded bg-surface-2 px-1.5 py-0.5 text-caption-xs-medium text-secondary">
                    {t("roles.system_badge")}
                  </span>
                )}
              </div>
              {role.description && (
                <span className="truncate text-caption-xs-regular text-tertiary">{role.description}</span>
              )}
            </div>
            <div className="shrink-0 text-body-sm-regular text-secondary">{role.members_count} members</div>
            <div className="flex shrink-0 items-center gap-1">
              <Link
                href={`/${workspaceSlug}/settings/roles/${role.id}`}
                className="rounded p-1 text-secondary hover:bg-surface-2 hover:text-primary"
              >
                <Pencil className="h-4 w-4" />
              </Link>
              <button
                disabled={role.is_system}
                onClick={() => setDeleteRole(role)}
                className="hover:text-red-500 rounded p-1 text-secondary hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
});
