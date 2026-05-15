/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { EUserPermissions, EUserPermissionsLevel } from "@plane/constants";
import { TOAST_TYPE, setToast } from "@plane/propel/toast";
import { AlertModalCore, Button, Input, ModalCore } from "@plane/ui";
import type { TIssueProperty, TIssuePropertyPayload, TIssuePropertyType } from "@plane/types";
import { NotAuthorizedView } from "@/components/auth-screens/not-authorized-view";
import { PageHead } from "@/components/core/page-title";
import { SettingsContentWrapper } from "@/components/settings/content-wrapper";
import { SettingsHeading } from "@/components/settings/heading";
import { useIssueProperty } from "@/hooks/store/use-issue-property";
import { useProject } from "@/hooks/store/use-project";
import { useUserPermissions } from "@/hooks/store/user";

type Props = {
  params: {
    workspaceSlug: string;
    projectId: string;
    issueTypeId?: string;
  };
};

const PROPERTY_TYPES: { key: TIssuePropertyType; label: string }[] = [
  { key: "text", label: "Text" },
  { key: "long_text", label: "Long text" },
  { key: "number", label: "Number" },
  { key: "date", label: "Date" },
  { key: "boolean", label: "Checkbox" },
  { key: "select", label: "Select" },
  { key: "multi_select", label: "Multi-select" },
  { key: "user", label: "User" },
  { key: "url", label: "URL" },
];

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const PropertyModal = observer(function PropertyModal({
  isOpen,
  initialProperty,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  initialProperty?: TIssueProperty;
  onClose: () => void;
  onSubmit: (payload: TIssuePropertyPayload) => Promise<void>;
}) {
  const [displayName, setDisplayName] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState<TIssuePropertyType>("text");
  const [isRequired, setIsRequired] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setDisplayName(initialProperty?.display_name ?? "");
    setName(initialProperty?.name ?? "");
    setType(initialProperty?.type ?? "text");
    setIsRequired(initialProperty?.is_required ?? false);
  }, [initialProperty, isOpen]);

  const handleSubmit = async () => {
    if (!displayName.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        display_name: displayName.trim(),
        name: name.trim() || slugify(displayName),
        type,
        is_required: isRequired,
        config: initialProperty?.config ?? {},
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalCore isOpen={isOpen} handleClose={onClose}>
      <div className="flex w-full max-w-lg flex-col gap-4 p-5">
        <h3 className="text-h3-medium text-primary">{initialProperty ? "Edit field" : "Create field"}</h3>
        <div>
          <label htmlFor="property-display-name" className="mb-1 block text-body-sm-medium text-secondary">
            Label
          </label>
          <Input
            id="property-display-name"
            value={displayName}
            onChange={(event) => {
              setDisplayName(event.target.value);
              if (!initialProperty) setName(slugify(event.target.value));
            }}
            placeholder="Severity"
          />
        </div>
        <div>
          <label htmlFor="property-name" className="mb-1 block text-body-sm-medium text-secondary">
            API name
          </label>
          <Input
            id="property-name"
            value={name}
            onChange={(event) => setName(slugify(event.target.value))}
            placeholder="severity"
          />
        </div>
        <div>
          <label htmlFor="property-type" className="mb-1 block text-body-sm-medium text-secondary">
            Type
          </label>
          <select
            id="property-type"
            value={type}
            disabled={!!initialProperty}
            onChange={(event) => setType(event.target.value as TIssuePropertyType)}
            className="h-9 w-full rounded border border-subtle bg-layer-2 px-2 text-body-sm-regular outline-none"
          >
            {PROPERTY_TYPES.map((propertyType) => (
              <option key={propertyType.key} value={propertyType.key}>
                {propertyType.label}
              </option>
            ))}
          </select>
        </div>
        <label htmlFor="property-required" className="flex items-center gap-2 text-body-sm-regular text-secondary">
          <input
            id="property-required"
            type="checkbox"
            className="size-4 rounded border-subtle"
            checked={isRequired}
            onChange={(event) => setIsRequired(event.target.checked)}
          />
          Required on issue creation
        </label>
        <div className="flex items-center justify-end gap-2">
          <Button variant="neutral-primary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            loading={submitting}
            disabled={!displayName.trim()}
            onClick={handleSubmit}
          >
            {initialProperty ? "Save" : "Create"}
          </Button>
        </div>
      </div>
    </ModalCore>
  );
});

const IssueTypePropertiesPage = observer(function IssueTypePropertiesPage({ params }: Props) {
  const { workspaceSlug, projectId, issueTypeId } = params;
  const { currentProjectDetails } = useProject();
  const { workspaceUserInfo, allowPermissions } = useUserPermissions();
  const propertyStore = useIssueProperty();
  const [selectedIssueTypeId, setSelectedIssueTypeId] = useState(issueTypeId ?? "");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<TIssueProperty | undefined>();
  const [deleteProperty, setDeleteProperty] = useState<TIssueProperty | null>(null);
  const [optionNameByProperty, setOptionNameByProperty] = useState<Record<string, string>>({});
  const [deleting, setDeleting] = useState(false);

  const canManage = allowPermissions([EUserPermissions.ADMIN], EUserPermissionsLevel.PROJECT);

  useEffect(() => {
    const loadIssueTypes = async () => {
      const issueTypes = await propertyStore.fetchIssueTypes(workspaceSlug, projectId);
      if (!selectedIssueTypeId && issueTypes[0]) setSelectedIssueTypeId(issueTypes[0].issue_type);
    };
    loadIssueTypes();
  }, [propertyStore, workspaceSlug, projectId, selectedIssueTypeId]);

  useEffect(() => {
    if (selectedIssueTypeId) propertyStore.fetchProperties(workspaceSlug, projectId, selectedIssueTypeId);
  }, [propertyStore, workspaceSlug, projectId, selectedIssueTypeId]);

  const issueTypes = propertyStore.issueTypesByProject.get(projectId) ?? [];
  const properties = selectedIssueTypeId ? (propertyStore.propertiesByIssueType.get(selectedIssueTypeId) ?? []) : [];
  const selectedIssueType = issueTypes.find((issueType) => issueType.issue_type === selectedIssueTypeId);
  const pageTitle = currentProjectDetails?.name ? `${currentProjectDetails.name} - Issue fields` : undefined;

  const propertyTypeLabel = useMemo(
    () => new Map(PROPERTY_TYPES.map((propertyType) => [propertyType.key, propertyType.label])),
    []
  );

  if (workspaceUserInfo && !canManage) {
    return <NotAuthorizedView section="settings" isProjectView className="h-auto" />;
  }

  const handleDelete = async () => {
    if (!deleteProperty || !selectedIssueTypeId) return;
    setDeleting(true);
    try {
      await propertyStore.deleteProperty(workspaceSlug, projectId, selectedIssueTypeId, deleteProperty.id);
      setToast({ type: TOAST_TYPE.SUCCESS, title: "Field deleted" });
      setDeleteProperty(null);
    } catch {
      setToast({ type: TOAST_TYPE.ERROR, title: "Failed to delete field" });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <SettingsContentWrapper>
      <PageHead title={pageTitle} />
      <PropertyModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={async (payload) => {
          await propertyStore.createProperty(workspaceSlug, projectId, selectedIssueTypeId, payload);
          setToast({ type: TOAST_TYPE.SUCCESS, title: "Field created" });
        }}
      />
      <PropertyModal
        isOpen={!!editingProperty}
        initialProperty={editingProperty}
        onClose={() => setEditingProperty(undefined)}
        onSubmit={async (payload) => {
          if (!editingProperty) return;
          await propertyStore.updateProperty(
            workspaceSlug,
            projectId,
            selectedIssueTypeId,
            editingProperty.id,
            payload
          );
          setToast({ type: TOAST_TYPE.SUCCESS, title: "Field updated" });
        }}
      />
      <AlertModalCore
        isOpen={!!deleteProperty}
        handleClose={() => setDeleteProperty(null)}
        handleSubmit={handleDelete}
        isSubmitting={deleting}
        title="Delete custom field"
        content="Existing values for this field will be hidden from issues and reports."
      />
      <div className="flex items-start justify-between gap-4 pb-5">
        <SettingsHeading title="Issue fields" description="Configure custom fields per issue type for this project." />
        <Button
          variant="primary"
          size="sm"
          prependIcon={<Plus className="size-3.5" />}
          disabled={!selectedIssueTypeId}
          onClick={() => setCreateModalOpen(true)}
        >
          New field
        </Button>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {issueTypes.map((issueType) => (
          <button
            key={issueType.id}
            type="button"
            onClick={() => setSelectedIssueTypeId(issueType.issue_type)}
            className={`rounded border px-3 py-1.5 text-body-sm-medium ${
              selectedIssueTypeId === issueType.issue_type
                ? "border-custom-primary-100 bg-custom-primary-100/10 text-custom-primary-100"
                : "border-subtle text-secondary hover:bg-surface-2"
            }`}
          >
            {issueType.issue_type_detail.name}
          </button>
        ))}
      </div>
      <div className="overflow-hidden rounded-md border border-subtle">
        <div className="flex items-center justify-between border-b border-subtle bg-surface-2 px-4 py-3">
          <div>
            <h4 className="text-body-sm-medium text-primary">
              {selectedIssueType?.issue_type_detail.name ?? "Issue type"}
            </h4>
            <p className="text-xs text-tertiary">{properties.length} fields configured</p>
          </div>
        </div>
        {propertyStore.loader ? (
          <div className="px-4 py-8 text-center text-body-sm-regular text-tertiary">Loading fields...</div>
        ) : properties.length === 0 ? (
          <div className="px-4 py-8 text-center text-body-sm-regular text-tertiary">No custom fields yet.</div>
        ) : (
          <div className="divide-y divide-subtle">
            {properties.map((property) => {
              const supportsOptions = property.type === "select" || property.type === "multi_select";
              const optionName = optionNameByProperty[property.id] ?? "";
              return (
                <div key={property.id} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h5 className="text-body-sm-medium text-primary">{property.display_name}</h5>
                        <span className="text-xs rounded bg-surface-2 px-1.5 py-0.5 text-secondary">
                          {propertyTypeLabel.get(property.type)}
                        </span>
                        {property.is_required && (
                          <span className="bg-red-500/10 text-xs text-red-500 rounded px-1.5 py-0.5 font-medium">
                            Required
                          </span>
                        )}
                      </div>
                      <p className="text-xs mt-1 text-tertiary">{property.name}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        className="rounded p-1 text-tertiary hover:bg-surface-2"
                        onClick={() => setEditingProperty(property)}
                      >
                        <Pencil className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        className="hover:text-red-500 rounded p-1 text-tertiary hover:bg-surface-2"
                        onClick={() => setDeleteProperty(property)}
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                  {supportsOptions && (
                    <div className="mt-3 flex flex-col gap-2">
                      <div className="flex flex-wrap gap-1.5">
                        {property.options.map((option) => (
                          <span
                            key={option.id}
                            className="text-xs inline-flex items-center gap-1 rounded border border-subtle px-2 py-0.5 text-secondary"
                          >
                            {option.name}
                            <button
                              type="button"
                              className="hover:text-red-500 text-tertiary"
                              onClick={() =>
                                propertyStore.deleteOption(
                                  workspaceSlug,
                                  projectId,
                                  selectedIssueTypeId,
                                  property.id,
                                  option.id
                                )
                              }
                            >
                              <Trash2 className="size-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex max-w-sm items-center gap-2">
                        <Input
                          value={optionName}
                          onChange={(event) =>
                            setOptionNameByProperty((current) => ({ ...current, [property.id]: event.target.value }))
                          }
                          placeholder="Add option"
                        />
                        <Button
                          variant="neutral-primary"
                          size="sm"
                          disabled={!optionName.trim()}
                          onClick={async () => {
                            await propertyStore.createOption(
                              workspaceSlug,
                              projectId,
                              selectedIssueTypeId,
                              property.id,
                              {
                                name: optionName.trim(),
                                value: slugify(optionName),
                              }
                            );
                            setOptionNameByProperty((current) => ({ ...current, [property.id]: "" }));
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </SettingsContentWrapper>
  );
});

export default IssueTypePropertiesPage;
