/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

"use client";

import { useEffect, useState } from "react";
import { observer } from "mobx-react";
import useSWR from "swr";
import type { TIntakeFormField, TIntakeFormValuePayload } from "@plane/types";
import { EWorkspaceIntakeIssueStatus } from "@plane/types";
import { TOAST_TYPE, setToast } from "@plane/propel/toast";
import { Button, Input, TextArea } from "@plane/ui";
import { PageHead } from "@/components/core/page-title";
import { useProject } from "@/hooks/store/use-project";
import { useWorkspaceIntake } from "@/hooks/store/use-workspace-intake";

type Props = {
  params: {
    workspaceSlug: string;
  };
};

const STATUS_LABELS: Record<EWorkspaceIntakeIssueStatus, string> = {
  [EWorkspaceIntakeIssueStatus.PENDING]: "Pending",
  [EWorkspaceIntakeIssueStatus.REJECTED]: "Rejected",
  [EWorkspaceIntakeIssueStatus.SNOOZED]: "Snoozed",
  [EWorkspaceIntakeIssueStatus.ACCEPTED]: "Accepted",
  [EWorkspaceIntakeIssueStatus.DUPLICATE]: "Duplicate",
};

const FIELD_TYPES: { label: string; value: TIntakeFormField["type"] }[] = [
  { label: "Short text", value: "short_text" },
  { label: "Long text", value: "long_text" },
  { label: "Number", value: "number" },
  { label: "Date", value: "date" },
  { label: "Boolean", value: "boolean" },
  { label: "Select", value: "select" },
  { label: "Multi-select", value: "multi_select" },
  { label: "File URL", value: "file" },
  { label: "User ID", value: "user" },
];

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const htmlToText = (value: string) =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const displayFieldValue = (fieldValue: TIntakeFormFieldValueLike) => {
  const fieldType = fieldValue.field_detail?.type;
  if (fieldType === "select")
    return fieldValue.field_detail?.options.find((option) => option.id === fieldValue.value_option)?.label ?? "";
  if (fieldType === "multi_select")
    return fieldValue.selected_options_detail?.map((option) => option.label).join(", ") ?? "";
  if (fieldType === "number") return fieldValue.value_number ?? "";
  if (fieldType === "date") return fieldValue.value_datetime?.slice(0, 10) ?? "";
  if (fieldType === "boolean") return fieldValue.value_boolean === null ? "" : fieldValue.value_boolean ? "Yes" : "No";
  if (fieldType === "file") return fieldValue.value_file_url;
  if (fieldType === "user") return fieldValue.value_user ?? "";
  return fieldValue.value_text;
};

function getIssueFormValues(issue: { form_values?: TIntakeFormFieldValueLike[] }) {
  return issue.form_values ?? [];
}

type TIntakeFormFieldValueLike = {
  id: string;
  field_detail?: TIntakeFormField;
  value_text: string;
  value_number: string | null;
  value_datetime: string | null;
  value_boolean: boolean | null;
  value_option: string | null;
  selected_options_detail?: { label: string }[];
  value_file_url: string;
  value_user: string | null;
};

type TFormValue = string | number | boolean | string[] | null;

function WorkspaceIntakePage({ params }: Props) {
  const { workspaceSlug } = params;
  const workspaceIntake = useWorkspaceIntake();
  const projectStore = useProject();

  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [ticketName, setTicketName] = useState("");
  const [ticketDescription, setTicketDescription] = useState("");
  const [ticketIntakeId, setTicketIntakeId] = useState("");
  const [selectedIntakeId, setSelectedIntakeId] = useState("");
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldType, setNewFieldType] = useState<TIntakeFormField["type"]>("short_text");
  const [newFieldRequired, setNewFieldRequired] = useState(false);
  const [optionDrafts, setOptionDrafts] = useState<Record<string, string>>({});
  const [formValues, setFormValues] = useState<Record<string, TFormValue>>({});
  const [acceptProjectByIssue, setAcceptProjectByIssue] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<"form" | "field" | "ticket" | string | undefined>();

  useSWR(`WORKSPACE_INTAKE_${workspaceSlug}`, () =>
    Promise.all([
      workspaceIntake.fetchIntakes(workspaceSlug),
      workspaceIntake.fetchIssues(workspaceSlug, { status: "-2,0" }),
      projectStore.fetchProjects(workspaceSlug),
    ])
  );

  const intakes = workspaceIntake.getIntakes(workspaceSlug);
  const issues = workspaceIntake.getIssues(workspaceSlug);
  const projects = (projectStore.workspaceProjectIds ?? []).flatMap((id) => {
    const project = projectStore.getProjectById(id);
    return project ? [project] : [];
  });
  const defaultIntake = intakes.find((intake) => intake.is_default);
  const selectedIntake = intakes.find((intake) => intake.id === selectedIntakeId) ?? defaultIntake ?? intakes[0];
  const activeTicketIntakeId = ticketIntakeId || selectedIntake?.id || defaultIntake?.id || "";
  const fields = activeTicketIntakeId ? workspaceIntake.getFields(activeTicketIntakeId) : [];

  useEffect(() => {
    if (!selectedIntakeId && intakes.length > 0) {
      const nextIntake = defaultIntake ?? intakes[0];
      setSelectedIntakeId(nextIntake.id);
      setTicketIntakeId(nextIntake.id);
    }
  }, [defaultIntake, intakes, selectedIntakeId]);

  useSWR(activeTicketIntakeId ? `WORKSPACE_INTAKE_FIELDS_${workspaceSlug}_${activeTicketIntakeId}` : null, () =>
    workspaceIntake.fetchFields(workspaceSlug, activeTicketIntakeId)
  );

  const handleCreateForm = async () => {
    if (!formName.trim()) return;
    setSubmitting("form");
    try {
      await workspaceIntake.createIntake(workspaceSlug, {
        name: formName.trim(),
        description: formDescription.trim(),
        is_default: intakes.length === 0,
      });
      setFormName("");
      setFormDescription("");
      setToast({ type: TOAST_TYPE.SUCCESS, title: "Workspace intake created" });
    } catch {
      setToast({ type: TOAST_TYPE.ERROR, title: "Could not create workspace intake" });
    } finally {
      setSubmitting(undefined);
    }
  };

  const handleCreateTicket = async () => {
    if (!ticketName.trim()) return;
    setSubmitting("ticket");
    try {
      await workspaceIntake.createIssue(workspaceSlug, {
        intake: ticketIntakeId || defaultIntake?.id,
        name: ticketName.trim(),
        description_html: ticketDescription.trim() ? `<p>${escapeHtml(ticketDescription.trim())}</p>` : "<p></p>",
        description_json: {},
        priority: "none",
        form_values: fields.map(
          (field): TIntakeFormValuePayload => ({
            field: field.id,
            value: formValues[field.id] ?? null,
          })
        ),
      });
      setTicketName("");
      setTicketDescription("");
      setFormValues({});
      setToast({ type: TOAST_TYPE.SUCCESS, title: "Ticket submitted" });
    } catch {
      setToast({ type: TOAST_TYPE.ERROR, title: "Could not submit ticket" });
    } finally {
      setSubmitting(undefined);
    }
  };

  const handleCreateField = async () => {
    if (!selectedIntake?.id || !newFieldLabel.trim()) return;
    setSubmitting("field");
    try {
      await workspaceIntake.createField(workspaceSlug, selectedIntake.id, {
        label: newFieldLabel.trim(),
        type: newFieldType,
        is_required: newFieldRequired,
        relative_order: fields.length * 1000,
      });
      setNewFieldLabel("");
      setNewFieldType("short_text");
      setNewFieldRequired(false);
      setToast({ type: TOAST_TYPE.SUCCESS, title: "Field created" });
    } catch {
      setToast({ type: TOAST_TYPE.ERROR, title: "Could not create field" });
    } finally {
      setSubmitting(undefined);
    }
  };

  const handleMoveField = async (fieldId: string, direction: -1 | 1) => {
    if (!selectedIntake?.id) return;
    const currentIndex = fields.findIndex((field) => field.id === fieldId);
    const nextIndex = currentIndex + direction;
    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= fields.length) return;
    const reorderedFields = [...fields];
    const [field] = reorderedFields.splice(currentIndex, 1);
    reorderedFields.splice(nextIndex, 0, field);
    await workspaceIntake.reorderFields(
      workspaceSlug,
      selectedIntake.id,
      reorderedFields.map((item, index) => ({ id: item.id, relative_order: (index + 1) * 1000 }))
    );
  };

  const handleCreateOption = async (field: TIntakeFormField) => {
    if (!selectedIntake?.id || !optionDrafts[field.id]?.trim()) return;
    const label = optionDrafts[field.id].trim();
    await workspaceIntake.createFieldOption(workspaceSlug, selectedIntake.id, field.id, {
      label,
      value: label.toLowerCase().replace(/\s+/g, "_"),
      relative_order: field.options.length * 1000,
    });
    setOptionDrafts((current) => ({ ...current, [field.id]: "" }));
  };

  const renderDynamicField = (field: TIntakeFormField) => {
    const value = formValues[field.id];
    const baseClass = "h-9 rounded border border-subtle bg-surface-1 px-3 text-sm text-primary outline-none";
    if (field.type === "long_text") {
      return (
        <TextArea
          value={typeof value === "string" ? value : ""}
          onChange={(e) => setFormValues((current) => ({ ...current, [field.id]: e.target.value }))}
          placeholder={field.placeholder || field.label}
          rows={3}
        />
      );
    }
    if (field.type === "boolean") {
      return (
        <label className="text-sm flex h-9 items-center gap-2 text-primary">
          <input
            type="checkbox"
            checked={value === true}
            onChange={(e) => setFormValues((current) => ({ ...current, [field.id]: e.target.checked }))}
          />
          Yes
        </label>
      );
    }
    if (field.type === "select") {
      return (
        <select
          value={typeof value === "string" ? value : ""}
          onChange={(e) => setFormValues((current) => ({ ...current, [field.id]: e.target.value }))}
          className={baseClass}
        >
          <option value="">Select</option>
          {field.options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }
    if (field.type === "multi_select") {
      return (
        <select
          multiple
          value={Array.isArray(value) ? value : []}
          onChange={(e) =>
            setFormValues((current) => ({
              ...current,
              [field.id]: Array.from(e.target.selectedOptions).map((option) => option.value),
            }))
          }
          className="text-sm min-h-24 rounded border border-subtle bg-surface-1 px-3 py-2 text-primary outline-none"
        >
          {field.options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }
    return (
      <Input
        type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
        value={typeof value === "string" || typeof value === "number" ? value : ""}
        onChange={(e) => setFormValues((current) => ({ ...current, [field.id]: e.target.value }))}
        placeholder={field.placeholder || field.label}
      />
    );
  };

  const handleAccept = async (issueId: string) => {
    const projectId = acceptProjectByIssue[issueId];
    if (!projectId) return;
    setSubmitting(issueId);
    try {
      await workspaceIntake.acceptIssue(workspaceSlug, issueId, { project: projectId });
      setToast({ type: TOAST_TYPE.SUCCESS, title: "Ticket accepted" });
    } catch {
      setToast({ type: TOAST_TYPE.ERROR, title: "Could not accept ticket" });
    } finally {
      setSubmitting(undefined);
    }
  };

  const handleReject = async (issueId: string) => {
    setSubmitting(issueId);
    try {
      await workspaceIntake.rejectIssue(workspaceSlug, issueId, { decision_note: "Rejected from workspace intake." });
      setToast({ type: TOAST_TYPE.SUCCESS, title: "Ticket rejected" });
    } catch {
      setToast({ type: TOAST_TYPE.ERROR, title: "Could not reject ticket" });
    } finally {
      setSubmitting(undefined);
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHead title="Workspace intake" />
      <div className="grid h-full grid-cols-1 overflow-hidden lg:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="flex h-full flex-col gap-5 overflow-y-auto border-r border-subtle bg-surface-1 p-5">
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-primary">Forms</h2>
              <span className="text-xs rounded bg-surface-2 px-2 py-0.5 font-medium text-secondary">
                {intakes.length}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <Input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Form name" />
              <TextArea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Description"
                rows={3}
              />
              <Button
                size="sm"
                variant="primary"
                onClick={handleCreateForm}
                loading={submitting === "form"}
                disabled={!formName.trim()}
              >
                Create form
              </Button>
            </div>
          </section>

          <section className="flex flex-col gap-2">
            {intakes.map((intake) => (
              <div key={intake.id} className="rounded border border-subtle bg-surface-2 p-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedIntakeId(intake.id);
                    setTicketIntakeId(intake.id);
                  }}
                  className="w-full text-left"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm truncate font-semibold text-primary">{intake.name}</p>
                    {intake.is_default && (
                      <span className="bg-custom-primary-100/10 text-xs text-custom-primary-100 rounded px-2 py-0.5">
                        Default
                      </span>
                    )}
                  </div>
                  {intake.description && (
                    <p className="text-xs mt-1 line-clamp-2 text-secondary">{intake.description}</p>
                  )}
                  <span className="text-xs mt-3 block text-tertiary">{intake.pending_issue_count ?? 0} pending</span>
                </button>
                {!intake.is_default && (
                  <div className="mt-3 flex justify-end">
                    <Button
                      size="sm"
                      variant="neutral-primary"
                      onClick={() => workspaceIntake.updateIntake(workspaceSlug, intake.id, { is_default: true })}
                    >
                      Set default
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </section>
        </aside>

        <main className="flex h-full flex-col overflow-hidden bg-surface-1">
          <div className="grid max-h-[46%] gap-5 overflow-y-auto border-b border-subtle p-5 xl:grid-cols-[minmax(0,1fr)_420px]">
            <section className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-base font-semibold text-primary">Submit ticket</h2>
                {selectedIntake && <span className="text-xs text-tertiary">{selectedIntake.name}</span>}
              </div>
              <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_auto]">
                <Input value={ticketName} onChange={(e) => setTicketName(e.target.value)} placeholder="Ticket title" />
                <select
                  value={ticketIntakeId}
                  onChange={(e) => {
                    setTicketIntakeId(e.target.value);
                    setSelectedIntakeId(e.target.value);
                  }}
                  className="text-sm h-9 rounded border border-subtle bg-surface-1 px-3 text-primary outline-none"
                >
                  <option value="">Default form</option>
                  {intakes.map((intake) => (
                    <option key={intake.id} value={intake.id}>
                      {intake.name}
                    </option>
                  ))}
                </select>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={handleCreateTicket}
                  loading={submitting === "ticket"}
                  disabled={!ticketName.trim() || intakes.length === 0}
                >
                  Submit ticket
                </Button>
              </div>
              <TextArea
                value={ticketDescription}
                onChange={(e) => setTicketDescription(e.target.value)}
                placeholder="Description"
                rows={3}
                className="mt-3"
              />
              {fields.length > 0 && (
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {fields
                    .filter((field) => field.is_active)
                    .map((field) => (
                      <label key={field.id} className="flex min-w-0 flex-col gap-1">
                        <span className="text-xs font-medium text-secondary">
                          {field.label}
                          {field.is_required ? " *" : ""}
                        </span>
                        {renderDynamicField(field)}
                        {field.help_text && <span className="text-xs text-tertiary">{field.help_text}</span>}
                      </label>
                    ))}
                </div>
              )}
            </section>

            <section className="flex flex-col gap-3 rounded border border-subtle bg-surface-2 p-3">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold text-primary">Form fields</h2>
                <span className="text-xs text-tertiary">{fields.length}</span>
              </div>
              <div className="grid gap-2">
                <Input
                  value={newFieldLabel}
                  onChange={(e) => setNewFieldLabel(e.target.value)}
                  placeholder="Field label"
                />
                <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
                  <select
                    value={newFieldType}
                    onChange={(e) => setNewFieldType(e.target.value as TIntakeFormField["type"])}
                    className="text-sm h-9 rounded border border-subtle bg-surface-1 px-3 text-primary outline-none"
                  >
                    {FIELD_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <label className="text-sm flex items-center gap-2 px-2 text-secondary">
                    <input
                      type="checkbox"
                      checked={newFieldRequired}
                      onChange={(e) => setNewFieldRequired(e.target.checked)}
                    />
                    Required
                  </label>
                </div>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={handleCreateField}
                  loading={submitting === "field"}
                  disabled={!newFieldLabel.trim() || !selectedIntake}
                >
                  Add field
                </Button>
              </div>
              <div className="flex flex-col gap-2 overflow-y-auto">
                {fields.map((field, index) => (
                  <div key={field.id} className="rounded border border-subtle bg-surface-1 p-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm truncate font-medium text-primary">{field.label}</p>
                        <p className="text-xs text-tertiary">
                          {field.type}
                          {field.is_required ? " · required" : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="neutral-primary"
                          onClick={() => handleMoveField(field.id, -1)}
                          disabled={index === 0}
                        >
                          Up
                        </Button>
                        <Button
                          size="sm"
                          variant="neutral-primary"
                          onClick={() => handleMoveField(field.id, 1)}
                          disabled={index === fields.length - 1}
                        >
                          Down
                        </Button>
                      </div>
                    </div>
                    {["select", "multi_select"].includes(field.type) && (
                      <div className="mt-2 flex flex-col gap-2">
                        <div className="flex flex-wrap gap-1">
                          {field.options.map((option) => (
                            <span key={option.id} className="text-xs rounded bg-surface-2 px-2 py-0.5 text-secondary">
                              {option.label}
                            </span>
                          ))}
                        </div>
                        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
                          <Input
                            value={optionDrafts[field.id] ?? ""}
                            onChange={(e) => setOptionDrafts((current) => ({ ...current, [field.id]: e.target.value }))}
                            placeholder="Option"
                          />
                          <Button size="sm" variant="neutral-primary" onClick={() => handleCreateOption(field)}>
                            Add
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            <div className="flex flex-col divide-y divide-subtle rounded border border-subtle">
              {issues.length === 0 && (
                <div className="text-sm flex h-40 items-center justify-center text-secondary">No workspace tickets</div>
              )}
              {issues.map((issue) => (
                <div key={issue.id} className="grid gap-4 bg-surface-1 p-4 xl:grid-cols-[minmax(0,1fr)_360px]">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm truncate font-semibold text-primary">{issue.name}</h3>
                      <span className="text-xs rounded bg-surface-2 px-2 py-0.5 text-secondary">
                        {STATUS_LABELS[issue.status]}
                      </span>
                      <span className="text-xs rounded bg-surface-2 px-2 py-0.5 text-secondary">{issue.priority}</span>
                    </div>
                    <p className="text-sm mt-2 line-clamp-2 text-secondary">{htmlToText(issue.description_html)}</p>
                    <p className="text-xs mt-2 text-tertiary">{issue.intake_detail?.name ?? "Workspace intake"}</p>
                    {getIssueFormValues(issue).length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {getIssueFormValues(issue).map((fieldValue) => (
                          <span key={fieldValue.id} className="text-xs rounded bg-surface-2 px-2 py-1 text-secondary">
                            {fieldValue.field_detail?.label}: {displayFieldValue(fieldValue)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row xl:justify-end">
                    {issue.status === EWorkspaceIntakeIssueStatus.PENDING && (
                      <>
                        <select
                          value={acceptProjectByIssue[issue.id] ?? ""}
                          onChange={(e) =>
                            setAcceptProjectByIssue((current) => ({ ...current, [issue.id]: e.target.value }))
                          }
                          className="text-sm h-8 min-w-0 rounded border border-subtle bg-surface-1 px-2 text-primary outline-none sm:w-44"
                        >
                          <option value="">Project</option>
                          {projects.map((project) => (
                            <option key={project?.id} value={project?.id}>
                              {project?.name}
                            </option>
                          ))}
                        </select>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleAccept(issue.id)}
                          loading={submitting === issue.id}
                          disabled={!acceptProjectByIssue[issue.id]}
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="neutral-primary"
                          onClick={() => handleReject(issue.id)}
                          loading={submitting === issue.id}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default observer(WorkspaceIntakePage);
