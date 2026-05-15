/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

"use client";

import { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { AlertTriangle } from "lucide-react";
import { Button, Input, TextArea } from "@plane/ui";
import { TOAST_TYPE, setToast } from "@plane/propel/toast";
import { useTranslation } from "@plane/i18n";
import type { TPermission, TRole } from "@plane/types";
import { useUnsavedChangesWarning } from "@/hooks/use-unsaved-changes-warning";
import { useRole } from "@/hooks/store/use-role";
import { PermissionMatrix } from "./permission-matrix";

type Props = {
  workspaceSlug: string;
  role: TRole;
  permissions: TPermission[];
};

export const RoleEditor = observer(function RoleEditor({ workspaceSlug, role, permissions }: Props) {
  const roleStore = useRole();
  const { t } = useTranslation();

  const [name, setName] = useState(role.name);
  const [description, setDescription] = useState(role.description ?? "");
  const [selectedCodes, setSelectedCodes] = useState<Set<string>>(() => new Set(role.permission_codes ?? []));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(role.name);
    setDescription(role.description ?? "");
    setSelectedCodes(new Set(role.permission_codes ?? []));
  }, [role.id]);

  const nameDirty = name !== role.name;
  const descDirty = description !== (role.description ?? "");
  const initialCodes = new Set(role.permission_codes ?? []);
  const permsDirty = selectedCodes.size !== initialCodes.size || [...selectedCodes].some((c) => !initialCodes.has(c));
  const isDirty = nameDirty || descDirty || permsDirty;

  useUnsavedChangesWarning(isDirty);

  const handleSave = async () => {
    if (!name.trim()) {
      setToast({ type: TOAST_TYPE.ERROR, title: "Name is required" });
      return;
    }
    setSaving(true);
    try {
      if (nameDirty || descDirty) {
        await roleStore.update(workspaceSlug, role.id, { name: name.trim(), description });
      }
      if (permsDirty) {
        await roleStore.setRolePermissions(workspaceSlug, role.id, Array.from(selectedCodes));
      }
      setToast({ type: TOAST_TYPE.SUCCESS, title: t("roles.toasts.saved") });
    } catch {
      setToast({ type: TOAST_TYPE.ERROR, title: t("roles.toasts.save_failed") });
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    setName(role.name);
    setDescription(role.description ?? "");
    setSelectedCodes(new Set(role.permission_codes ?? []));
  };

  const readOnly = role.is_system;

  return (
    <div className="flex flex-col gap-6">
      {readOnly && (
        <div className="border-yellow-200 bg-yellow-50 text-yellow-800 flex items-center gap-2 rounded-md border px-4 py-3 text-body-sm-regular">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {t("roles.system_banner")}
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-body-sm-medium text-secondary">{t("roles.form.name")}</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={readOnly}
            placeholder={t("roles.form.name_placeholder")}
          />
        </div>
        <div>
          <label className="mb-1 block text-body-sm-medium text-secondary">{t("roles.form.description")}</label>
          <TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={readOnly}
            placeholder={t("roles.form.description_placeholder")}
            rows={2}
          />
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-body-sm-medium">{t("roles.matrix.permissions_title")}</h4>
        <PermissionMatrix
          permissions={permissions}
          selected={selectedCodes}
          readOnly={readOnly}
          onChange={setSelectedCodes}
        />
      </div>

      {!readOnly && (
        <div className="sticky bottom-0 flex items-center justify-end gap-2 border-t border-subtle bg-surface-1 py-3">
          <Button variant="neutral-primary" size="sm" onClick={handleDiscard} disabled={!isDirty || saving}>
            {t("roles.discard")}
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave} loading={saving} disabled={!isDirty}>
            {t("roles.save_changes")}
          </Button>
        </div>
      )}
    </div>
  );
});
