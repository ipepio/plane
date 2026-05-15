/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { Pencil, Timer, Trash2 } from "lucide-react";
import { TOAST_TYPE, setToast } from "@plane/propel/toast";
import { AlertModalCore, Button } from "@plane/ui";
import type { TIssueWorklog } from "@plane/types";
import { formatDuration } from "@/helpers/duration";
import { useWorklog } from "@/hooks/store/use-worklog";
import { LogTimeModal } from "./log-time-modal";

type Props = {
  workspaceSlug: string;
  projectId: string;
  issueId: string;
  disabled: boolean;
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

export const WorklogSection = observer(function WorklogSection(props: Props) {
  const { workspaceSlug, projectId, issueId, disabled } = props;
  const worklogStore = useWorklog();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingWorklog, setEditingWorklog] = useState<TIssueWorklog | undefined>();
  const [deleteWorklog, setDeleteWorklog] = useState<TIssueWorklog | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    worklogStore.fetchIssueWorklogs(workspaceSlug, projectId, issueId);
  }, [worklogStore, workspaceSlug, projectId, issueId]);

  const worklogs = worklogStore.issueWorklogs.get(`${projectId}:${issueId}`) ?? [];
  const totalSeconds = worklogs.reduce((acc, item) => acc + item.duration, 0);

  const handleDelete = async () => {
    if (!deleteWorklog) return;
    setDeleting(true);
    try {
      await worklogStore.deleteIssueWorklog(workspaceSlug, projectId, issueId, deleteWorklog.id);
      setToast({ type: TOAST_TYPE.SUCCESS, title: "Worklog deleted" });
      setDeleteWorklog(null);
    } catch {
      setToast({ type: TOAST_TYPE.ERROR, title: "Failed to delete worklog" });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="rounded-md border border-subtle">
      <LogTimeModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={async (payload) => {
          await worklogStore.createIssueWorklog(workspaceSlug, projectId, issueId, payload);
          setToast({ type: TOAST_TYPE.SUCCESS, title: "Time logged" });
        }}
      />
      <LogTimeModal
        isOpen={!!editingWorklog}
        worklog={editingWorklog}
        onClose={() => setEditingWorklog(undefined)}
        onSubmit={async (payload) => {
          if (!editingWorklog) return;
          await worklogStore.updateIssueWorklog(workspaceSlug, projectId, issueId, editingWorklog.id, payload);
          setToast({ type: TOAST_TYPE.SUCCESS, title: "Worklog updated" });
        }}
      />
      <AlertModalCore
        isOpen={!!deleteWorklog}
        handleClose={() => setDeleteWorklog(null)}
        handleSubmit={handleDelete}
        isSubmitting={deleting}
        title="Delete worklog"
        content="This logged time entry will be removed from the issue and workspace reports."
      />
      <div className="flex items-center justify-between gap-3 border-b border-subtle px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <Timer className="size-4 shrink-0 text-secondary" />
          <div className="min-w-0">
            <h4 className="text-body-sm-medium text-primary">Worklog</h4>
            <p className="text-xs truncate text-tertiary">{formatDuration(totalSeconds)} logged</p>
          </div>
        </div>
        <Button variant="neutral-primary" size="sm" disabled={disabled} onClick={() => setCreateModalOpen(true)}>
          Log time
        </Button>
      </div>
      {worklogStore.loader ? (
        <div className="px-4 py-5 text-body-sm-regular text-tertiary">Loading worklogs...</div>
      ) : worklogs.length === 0 ? (
        <div className="px-4 py-5 text-body-sm-regular text-tertiary">No time logged yet.</div>
      ) : (
        <div className="divide-y divide-subtle">
          {worklogs.map((worklog) => (
            <div key={worklog.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 px-4 py-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-body-sm-medium text-primary">
                  <span>{formatDuration(worklog.duration)}</span>
                  <span className="text-tertiary">by {worklog.logged_by_detail?.display_name ?? "Unknown"}</span>
                  {worklog.is_billable && (
                    <span className="bg-green-500/10 text-xs text-green-600 rounded px-1.5 py-0.5 font-medium">
                      Billable
                    </span>
                  )}
                </div>
                <div className="text-xs mt-1 text-tertiary">{formatDate(worklog.started_at)}</div>
                {worklog.description && (
                  <p className="mt-2 text-body-sm-regular whitespace-pre-wrap text-secondary">{worklog.description}</p>
                )}
              </div>
              {!disabled && (
                <div className="flex items-start gap-1">
                  <button
                    type="button"
                    className="rounded p-1 text-tertiary hover:bg-surface-2 hover:text-primary"
                    onClick={() => setEditingWorklog(worklog)}
                    aria-label="Edit worklog"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    className="hover:text-red-500 rounded p-1 text-tertiary hover:bg-surface-2"
                    onClick={() => setDeleteWorklog(worklog)}
                    aria-label="Delete worklog"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
});
