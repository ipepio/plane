/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

"use client";

import { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { useRouter } from "next/navigation";
import { CopyPlus, Pencil, Trash2 } from "lucide-react";
import { EUserPermissions, EUserPermissionsLevel } from "@plane/constants";
import { useTranslation } from "@plane/i18n";
import { TOAST_TYPE, setToast } from "@plane/propel/toast";
import { AlertModalCore, Button, Input, ModalCore } from "@plane/ui";
import type { TProjectTemplate } from "@plane/types";
import { NotAuthorizedView } from "@/components/auth-screens/not-authorized-view";
import { PageHead } from "@/components/core/page-title";
import { SettingsContentWrapper } from "@/components/settings/content-wrapper";
import { useProjectTemplate } from "@/hooks/store/use-project-template";
import { useUserPermissions } from "@/hooks/store/user";
import { useWorkspace } from "@/hooks/store/use-workspace";

type Props = {
  params: {
    workspaceSlug: string;
  };
};

const TemplateEditModal = observer(function TemplateEditModal({
  initialTemplate,
  isOpen,
  onClose,
  onSubmit,
}: {
  initialTemplate?: TProjectTemplate;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: { name: string; description: string }) => Promise<void>;
}) {
  const [name, setName] = useState(initialTemplate?.name ?? "");
  const [description, setDescription] = useState(initialTemplate?.description ?? "");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setName(initialTemplate?.name ?? "");
    setDescription(initialTemplate?.description ?? "");
  }, [initialTemplate, isOpen]);

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
        <h3 className="text-h3-medium text-primary">Edit template</h3>
        <div>
          <label htmlFor="template-name" className="mb-1 block text-body-sm-medium text-secondary">
            Name *
          </label>
          <Input id="template-name" value={name} onChange={(event) => setName(event.target.value)} />
        </div>
        <div>
          <label htmlFor="template-description" className="mb-1 block text-body-sm-medium text-secondary">
            Description
          </label>
          <Input
            id="template-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>
        <div className="flex items-center justify-end gap-2">
          <Button variant="neutral-primary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} loading={submitting} disabled={!name.trim()}>
            Save
          </Button>
        </div>
      </div>
    </ModalCore>
  );
});

const InstantiateModal = observer(function InstantiateModal({
  workspaceSlug,
  template,
  isOpen,
  onClose,
}: {
  workspaceSlug: string;
  template?: TProjectTemplate;
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const projectTemplateStore = useProjectTemplate();
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [placeholders, setPlaceholders] = useState<string[]>([]);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!template || !isOpen) return;
    setName(template.name);
    setIdentifier("");
    setVariables({});
    projectTemplateStore
      .fetchPlaceholders(workspaceSlug, template.id)
      .then(setPlaceholders)
      .catch(() => setPlaceholders([]));
  }, [isOpen, projectTemplateStore, template, workspaceSlug]);

  const handleSubmit = async () => {
    if (!template || !identifier.trim()) return;
    setSubmitting(true);
    try {
      const project = await projectTemplateStore.instantiate(workspaceSlug, template.id, {
        name: name.trim(),
        identifier: identifier.trim(),
        variables,
      });
      setToast({ type: TOAST_TYPE.SUCCESS, title: "Project created" });
      onClose();
      router.push(`/${workspaceSlug}/projects/${project.id}/issues`);
    } catch {
      setToast({ type: TOAST_TYPE.ERROR, title: "Failed to create project" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalCore isOpen={isOpen} handleClose={onClose}>
      <div className="flex flex-col gap-4 p-5">
        <h3 className="text-h3-medium text-primary">Create from template</h3>
        <div>
          <label htmlFor="template-project-name" className="mb-1 block text-body-sm-medium text-secondary">
            Project name *
          </label>
          <Input id="template-project-name" value={name} onChange={(event) => setName(event.target.value)} />
        </div>
        <div>
          <label htmlFor="template-project-identifier" className="mb-1 block text-body-sm-medium text-secondary">
            Identifier *
          </label>
          <Input
            id="template-project-identifier"
            value={identifier}
            maxLength={12}
            onChange={(event) => setIdentifier(event.target.value.toUpperCase())}
          />
        </div>
        {placeholders.length > 0 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {placeholders.map((placeholder) => (
              <div key={placeholder}>
                <label
                  htmlFor={`template-variable-${placeholder}`}
                  className="mb-1 block text-body-sm-medium text-secondary"
                >
                  {placeholder}
                </label>
                <Input
                  id={`template-variable-${placeholder}`}
                  value={variables[placeholder] ?? ""}
                  onChange={(event) => setVariables({ ...variables, [placeholder]: event.target.value })}
                />
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center justify-end gap-2">
          <Button variant="neutral-primary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} loading={submitting} disabled={!identifier.trim()}>
            Create
          </Button>
        </div>
      </div>
    </ModalCore>
  );
});

const ProjectTemplatesSettingsPage = observer(function ProjectTemplatesSettingsPage({ params }: Props) {
  const { workspaceSlug } = params;
  const [editTemplate, setEditTemplate] = useState<TProjectTemplate | undefined>();
  const [deleteTemplate, setDeleteTemplate] = useState<TProjectTemplate | null>(null);
  const [instantiateTemplate, setInstantiateTemplate] = useState<TProjectTemplate | undefined>();
  const [deleting, setDeleting] = useState(false);

  const projectTemplateStore = useProjectTemplate();
  const { allowPermissions, workspaceUserInfo } = useUserPermissions();
  const { currentWorkspace } = useWorkspace();
  const { t } = useTranslation();

  const canManageTemplates = allowPermissions(
    [EUserPermissions.ADMIN, EUserPermissions.MEMBER],
    EUserPermissionsLevel.WORKSPACE
  );

  useEffect(() => {
    if (canManageTemplates) projectTemplateStore.fetchAll(workspaceSlug);
  }, [canManageTemplates, projectTemplateStore, workspaceSlug]);

  const templates = Array.from(projectTemplateStore.templates.values());
  const pageTitle = currentWorkspace?.name
    ? `${currentWorkspace.name} - ${t("workspace_settings.settings.templates.title")}`
    : undefined;

  if (workspaceUserInfo && !canManageTemplates) {
    return <NotAuthorizedView section="settings" className="h-auto" />;
  }

  const handleUpdate = async (payload: { name: string; description: string }) => {
    if (!editTemplate) return;
    try {
      await projectTemplateStore.update(workspaceSlug, editTemplate.id, payload);
      setToast({ type: TOAST_TYPE.SUCCESS, title: "Template updated" });
      setEditTemplate(undefined);
    } catch {
      setToast({ type: TOAST_TYPE.ERROR, title: "Failed to update template" });
    }
  };

  const handleDelete = async () => {
    if (!deleteTemplate) return;
    setDeleting(true);
    try {
      await projectTemplateStore.destroy(workspaceSlug, deleteTemplate.id);
      setToast({ type: TOAST_TYPE.SUCCESS, title: "Template deleted" });
      setDeleteTemplate(null);
    } catch {
      setToast({ type: TOAST_TYPE.ERROR, title: "Failed to delete template" });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <SettingsContentWrapper>
      <PageHead title={pageTitle} />
      <TemplateEditModal
        initialTemplate={editTemplate}
        isOpen={!!editTemplate}
        onClose={() => setEditTemplate(undefined)}
        onSubmit={handleUpdate}
      />
      <InstantiateModal
        workspaceSlug={workspaceSlug}
        template={instantiateTemplate}
        isOpen={!!instantiateTemplate}
        onClose={() => setInstantiateTemplate(undefined)}
      />
      <AlertModalCore
        isOpen={!!deleteTemplate}
        handleClose={() => setDeleteTemplate(null)}
        handleSubmit={handleDelete}
        isSubmitting={deleting}
        title="Delete template"
        content={`Delete ${deleteTemplate?.name ?? "this template"}?`}
      />
      <div className="flex items-center justify-between pb-4">
        <h3 className="text-h3-medium">{t("workspace_settings.settings.templates.title")}</h3>
        <Button variant="neutral-primary" size="sm" onClick={() => projectTemplateStore.fetchAll(workspaceSlug)}>
          Refresh
        </Button>
      </div>
      {projectTemplateStore.loader ? (
        <div className="py-8 text-center text-body-sm-regular text-tertiary">Loading templates...</div>
      ) : templates.length === 0 ? (
        <div className="rounded-md border border-subtle px-4 py-8 text-center text-body-sm-regular text-tertiary">
          No templates yet.
        </div>
      ) : (
        <div className="divide-y divide-subtle rounded-md border border-subtle">
          {templates.map((template) => (
            <div key={template.id} className="flex items-center gap-4 px-4 py-3">
              <div className="min-w-0 flex-1">
                <div className="truncate text-body-sm-medium text-primary">{template.name}</div>
                <div className="truncate text-caption-xs-regular text-tertiary">
                  {template.description || "No description"}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => setInstantiateTemplate(template)}
                  className="rounded p-1 text-secondary hover:bg-surface-2 hover:text-primary"
                >
                  <CopyPlus className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setEditTemplate(template)}
                  className="rounded p-1 text-secondary hover:bg-surface-2 hover:text-primary"
                >
                  <Pencil className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTemplate(template)}
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

export default ProjectTemplatesSettingsPage;
