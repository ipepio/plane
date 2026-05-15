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
import { useTranslation } from "@plane/i18n";
import { TOAST_TYPE, setToast } from "@plane/propel/toast";
import { Button, Input } from "@plane/ui";
import type { TWorklogGroupBy, TWorkspaceWorklogFilters } from "@plane/types";
import { NotAuthorizedView } from "@/components/auth-screens/not-authorized-view";
import { PageHead } from "@/components/core/page-title";
import { SettingsContentWrapper } from "@/components/settings/content-wrapper";
import { formatDuration } from "@/helpers/duration";
import { useUserPermissions } from "@/hooks/store/user";
import { useWorklog } from "@/hooks/store/use-worklog";
import { useWorkspace } from "@/hooks/store/use-workspace";

type Props = {
  params: {
    workspaceSlug: string;
  };
};

const today = new Date();
const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
const toDateInput = (date: Date) => date.toISOString().slice(0, 10);

const formatDate = (value: string) =>
  new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));

const TimeTrackingReportPage = observer(function TimeTrackingReportPage({ params }: Props) {
  const { workspaceSlug } = params;
  const { t } = useTranslation();
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
    if (canViewReports) worklogStore.fetchReport(workspaceSlug, filters);
  }, [canViewReports, filters, worklogStore, workspaceSlug]);

  const pageTitle = currentWorkspace?.name
    ? `${currentWorkspace.name} - ${t("workspace_settings.settings.time_tracking.title")}`
    : undefined;

  if (workspaceUserInfo && !canViewReports) {
    return <NotAuthorizedView section="settings" className="h-auto" />;
  }

  const handleExport = async () => {
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
    <SettingsContentWrapper>
      <PageHead title={pageTitle} />
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
        <div>
          <h3 className="text-h3-medium">{t("workspace_settings.settings.time_tracking.title")}</h3>
          <p className="mt-1 text-body-sm-regular text-secondary">
            Review logged time by date, user, project, and billing status.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="neutral-primary"
            size="sm"
            prependIcon={<RefreshCcw className="size-3.5" />}
            onClick={() => worklogStore.fetchReport(workspaceSlug, filters)}
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

      <div className="grid grid-cols-1 gap-3 rounded-md border border-subtle p-4 md:grid-cols-3 xl:grid-cols-6">
        <div>
          <label htmlFor="worklog-report-from" className="text-xs mb-1 block font-medium text-secondary">
            From
          </label>
          <Input id="worklog-report-from" type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
        </div>
        <div>
          <label htmlFor="worklog-report-to" className="text-xs mb-1 block font-medium text-secondary">
            To
          </label>
          <Input id="worklog-report-to" type="date" value={to} onChange={(event) => setTo(event.target.value)} />
        </div>
        <div>
          <label htmlFor="worklog-report-group" className="text-xs mb-1 block font-medium text-secondary">
            Group
          </label>
          <select
            id="worklog-report-group"
            value={groupBy}
            onChange={(event) => setGroupBy(event.target.value as TWorklogGroupBy | "")}
            className="h-8 w-full rounded border border-subtle bg-layer-2 px-2 text-body-sm-regular outline-none"
          >
            <option value="">Entries</option>
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="user">User</option>
            <option value="project">Project</option>
          </select>
        </div>
        <div>
          <label htmlFor="worklog-report-billable" className="text-xs mb-1 block font-medium text-secondary">
            Billable
          </label>
          <select
            id="worklog-report-billable"
            value={billable}
            onChange={(event) => setBillable(event.target.value as "all" | "true" | "false")}
            className="h-8 w-full rounded border border-subtle bg-layer-2 px-2 text-body-sm-regular outline-none"
          >
            <option value="all">All</option>
            <option value="true">Billable</option>
            <option value="false">Non-billable</option>
          </select>
        </div>
        <div>
          <label htmlFor="worklog-report-project" className="text-xs mb-1 block font-medium text-secondary">
            Project ID
          </label>
          <Input
            id="worklog-report-project"
            value={project}
            onChange={(event) => setProject(event.target.value)}
            placeholder="Optional"
          />
        </div>
        <div>
          <label htmlFor="worklog-report-user" className="text-xs mb-1 block font-medium text-secondary">
            User ID
          </label>
          <Input
            id="worklog-report-user"
            value={user}
            onChange={(event) => setUser(event.target.value)}
            placeholder="Optional"
          />
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-md border border-subtle">
        {worklogStore.reportLoader ? (
          <div className="px-4 py-8 text-center text-body-sm-regular text-tertiary">Loading worklogs...</div>
        ) : groupBy ? (
          <table className="w-full min-w-[520px] text-left text-body-sm-regular">
            <thead className="text-xs border-b border-subtle bg-surface-2 font-medium text-secondary">
              <tr>
                <th className="px-4 py-2">Group</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Billable</th>
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
          <table className="w-full min-w-[760px] text-left text-body-sm-regular">
            <thead className="text-xs border-b border-subtle bg-surface-2 font-medium text-secondary">
              <tr>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Project</th>
                <th className="px-4 py-2">Issue</th>
                <th className="px-4 py-2">Duration</th>
                <th className="px-4 py-2">Billable</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-subtle">
              {worklogStore.reportRows.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-3 text-secondary">{formatDate(row.started_at)}</td>
                  <td className="px-4 py-3 text-primary">{row.logged_by_detail?.display_name ?? "Unknown"}</td>
                  <td className="px-4 py-3 text-secondary">{row.project_detail?.name ?? row.project}</td>
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
    </SettingsContentWrapper>
  );
});

export default TimeTrackingReportPage;
