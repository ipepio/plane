/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

"use client";

import { useState } from "react";
import { observer } from "mobx-react";
import { Button, Input, ModalCore } from "@plane/ui";
import { TOAST_TYPE, setToast } from "@plane/propel/toast";
import { useTranslation } from "@plane/i18n";
import { useRole } from "@/hooks/store/use-role";

type Props = {
  workspaceSlug: string;
  isOpen: boolean;
  onClose: () => void;
  onCreated: (roleId: string) => void;
};

export const CreateRoleModal = observer(function CreateRoleModal({ workspaceSlug, isOpen, onClose, onCreated }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const roleStore = useRole();
  const { t } = useTranslation();

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      const role = await roleStore.create(workspaceSlug, { name: name.trim(), description });
      setToast({ type: TOAST_TYPE.SUCCESS, title: t("roles.toasts.created") });
      setName("");
      setDescription("");
      onCreated(role.id);
    } catch {
      setToast({ type: TOAST_TYPE.ERROR, title: t("roles.toasts.create_failed") });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalCore isOpen={isOpen} handleClose={onClose}>
      <div className="flex flex-col gap-4 p-5">
        <h3 className="text-h3-medium text-primary">{t("roles.create_modal.title")}</h3>
        <div>
          <label className="mb-1 block text-body-sm-medium text-secondary">{t("roles.form.name")} *</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("roles.form.name_placeholder")}
            autoFocus
          />
        </div>
        <div>
          <label className="mb-1 block text-body-sm-medium text-secondary">{t("roles.form.description")}</label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("roles.form.description_placeholder")}
          />
        </div>
        <div className="flex items-center justify-end gap-2">
          <Button variant="neutral-primary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} loading={submitting} disabled={!name.trim()}>
            {t("roles.new_role")}
          </Button>
        </div>
      </div>
    </ModalCore>
  );
});
