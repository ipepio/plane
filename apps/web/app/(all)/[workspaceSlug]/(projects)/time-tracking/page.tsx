/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react";
import { Download, RefreshCcw } from "lucide-react";
import { EUserPermissions, EUserPermissionsLevel } from "@plane/constants";
import { TOAST_TYPE, setToast } from "@plane/propel/toast";
import { Button, Input } from "@plane/ui";
import type { TWorklogGroupBy, TWorkspaceWorklogFilters } from "@plane/types";
import { NotAuthorizedView } from "@/components/auth-screens/not-authorized-view";
import { PageHead } from "@/components/core/page-title";
import { formatDuration } from "@/helpers/duration";
import { useUserPermissions } from "@/hooks/store/user";
import { useWorklog } from "@/hooks/store/use-worklog";
import { useWorkspace } from "@/hooks/store/use-workspace";
import { useParams } from "react-router";

const today = new Date();
const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
const toDateInput = (date: Date) => date.toISOString().slice(0, 10);

const formatDate = (value: string) =>
  new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));

const TimeTrackingPage = observer(function TimeTrackingPage() {
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const { currentWorkspace } = useWorkspace();
  const { allowPermissions, workspaceUserInfo } = useUserPermissions();
  const worklogStore = useWorklog();

  const [from, setFrom] = useState(toDateInput(thirtyDaysAgo));
  const [to, setTo] = useState(toDateInput(today));
  const [groupBy, setGroupBy] = useState<TWorklogGroupBy | "">("");
  const [billable, setBillable] = useState<"all" | "true" | "false">("all");
  const [project, setProject] = useState("");
  const [user, setUser] = useState("");
  const [exporting, setExporting] = useState(false);

  const canViewReports = allowPermissions(
    [EUserPermissions.ADMIN, EUserPermissions.MEMBER],
    EUserPermissionsLevel.WORKSPACE
  );

  const filters = useMemo<TWorkspaceWorklogFilters>(
    () => ({
      from,
      to,
      group_by: groupBy || undefined,
      billable: billable === "all" ? undefined : billable === "true",
      project: project.trim() || undefined,
      user: user.trim() || undefined,
    }),
    [billable, from, groupBy, project, to, user]
  );

  useEffect(() => {
    if (canViewReports && workspaceSlug) worklogStore.fetchReport(workspaceSlug, filters);
  }, [canViewReports, filters, worklogStore, workspaceSlug]);

  const pageTitle = currentWorkspace?.name ? `${currentWorkspace.name} - Time Tracking` : undefined;

  if (workspaceUserInfo && !canViewReports) {
    return <NotAuthorizedView section="settings" className="h-auto" />;
  }

  const handleExport = async () => {
    if (!workspaceSlug) return;
    setExporting(true);
    try {
      const blob = await worklogStore.exportCSV(workspaceSlug, filters);
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "worklogs.csv";
      anchor.click();
      window.URL.revokeObjectURL(url);
    } catch {
      setToast({ type: TOAST_TYPE.ERROR, title: "Failed to export worklogs" });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHead title={pageTitle} />

      {/* Toolbar */}
      <div className="flex flex-shrink-0 flex-wrap items-center justify-between gap-3 border-b border-subtle px-5 py-3">
        <div>
          <h3 className="text-base font-semibold text-primary">Time Tracking</h3>
          <p className="mt-0.5 text-sm text-secondary">Review logged time by date, user, project, and billing status.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="neutral-primary"
            size="sm"
            prependIcon={<RefreshCcw className="size-3.5" />}
            onClick={() => workspaceSlug && worklogStore.fetchReport(workspaceSlug, filters)}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            prependIcon={<Download className="size-3.5" />}
            loading={exporting}
            onClick={handleExport}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex-shrink-0 border-b border-subtle px-5 py-3">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-secondary">From</span>
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-secondary">To</span>
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-secondary">Group by</span>
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value as TWorklogGroupBy | "")}
              className="h-8 w-full rounded border border-subtle bg-layer-2 px-2 text-sm text-primary outline-none"
            >
              <option value="">Entries</option>
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="user">User</option>
              <option value="project">Project</option>
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-secondary">Billable</span>
            <select
              value={billable}
              onChange={(e) => setBillable(e.target.value as "all" | "true" | "false")}
              className="h-8 w-full rounded border border-subtle bg-layer-2 px-2 text-sm text-primary outline-none"
            >
              <option value="all">All</option>
              <option value="true">Billable</option>
              <option value="false">Non-billable</option>
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-secondary">Project ID</span>
            <Input value={project} onChange={(e) => setProject(e.target.value)} placeholder="Optional" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-secondary">User ID</span>
            <Input value={user} onChange={(e) => setUser(e.target.value)} placeholder="Optional" />
          </label>
        </div>
      </div>

      {/* Table */}
      <div className="min-h-0 flex-1 overflow-auto px-5 py-4">
        <div className="overflow-hidden rounded-md border border-subtle">
          {worklogStore.reportLoader ? (
            <div className="px-4 py-8 text-center text-sm text-tertiary">Loading worklogs...</div>
          ) : groupBy ? (
            <table className="w-full table-fixed text-left text-sm">
              <colgroup>
                <col className="w-1/2" />
                <col className="w-1/4" />
                <col className="w-1/4" />
              </colgroup>
              <thead className="border-b border-subtle bg-surface-2">
                <tr>
                  <th className="px-4 py-2 text-xs font-medium text-secondary">Group</th>
                  <th className="px-4 py-2 text-xs font-medium text-secondary">Total</th>
                  <th className="px-4 py-2 text-xs font-medium text-secondary">Billable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-subtle">
                {worklogStore.reportGroups.map((row) => (
                  <tr key={row.group}>
                    <td className="px-4 py-3 text-primary">{row.label}</td>
                    <td className="px-4 py-3 text-secondary">{formatDuration(row.total_seconds)}</td>
                    <td className="px-4 py-3 text-secondary">{formatDuration(row.billable_seconds)}</td>
                  </tr>
                ))}
                {worklogStore.reportGroups.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-tertiary">
                      No worklogs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full table-fixed text-left text-sm">
              <colgroup>
                <col className="w-28" />
                <col className="w-40" />
                <col className="w-40" />
                <col className="w-28" />
                <col className="w-28" />
                <col className="w-24" />
              </colgroup>
              <thead className="border-b border-subtle bg-surface-2">
                <tr>
                  <th className="px-4 py-2 text-xs font-medium text-secondary">Date</th>
                  <th className="px-4 py-2 text-xs font-medium text-secondary">User</th>
                  <th className="px-4 py-2 text-xs font-medium text-secondary">Project</th>
                  <th className="px-4 py-2 text-xs font-medium text-secondary">Issue</th>
                  <th className="px-4 py-2 text-xs font-medium text-secondary">Duration</th>
                  <th className="px-4 py-2 text-xs font-medium text-secondary">Billable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-subtle">
                {worklogStore.reportRows.map((row) => (
                  <tr key={row.id}>
                    <td className="truncate px-4 py-3 text-secondary">{formatDate(row.started_at)}</td>
                    <td className="truncate px-4 py-3 text-primary">{row.logged_by_detail?.display_name ?? "Unknown"}</td>
                    <td className="truncate px-4 py-3 text-secondary">{row.project_detail?.name ?? row.project}</td>
                    <td className="px-4 py-3 text-secondary">
                      {row.project_detail?.identifier}-{row.issue_detail?.sequence_id}
                    </td>
                    <td className="px-4 py-3 text-secondary">{formatDuration(row.duration)}</td>
                    <td className="px-4 py-3 text-secondary">{row.is_billable ? "Yes" : "No"}</td>
                  </tr>
                ))}
                {worklogStore.reportRows.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-tertiary">
                      No worklogs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
});

export default TimeTrackingPage;
