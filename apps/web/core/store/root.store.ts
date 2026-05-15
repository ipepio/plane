/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { enableStaticRendering } from "mobx-react";
// plane imports
import { FALLBACK_LANGUAGE, LANGUAGE_STORAGE_KEY } from "@plane/i18n";
import type { IWorkItemFilterStore } from "@plane/shared-state";
import { WorkItemFilterStore } from "@plane/shared-state";
// plane web store
import type { IAnalyticsStore } from "@/plane-web/store/analytics.store";
import { AnalyticsStore } from "@/plane-web/store/analytics.store";
import type { ICommandPaletteStore } from "@/plane-web/store/command-palette.store";
import { CommandPaletteStore } from "@/plane-web/store/command-palette.store";
import { PowerKStore } from "@/plane-web/store/power-k.store";
import type { IPowerKStore } from "@/plane-web/store/power-k.store";
import type { RootStore } from "@/plane-web/store/root.store";
import type { IStateStore } from "@/plane-web/store/state.store";
import { StateStore } from "@/plane-web/store/state.store";
import { WorkspaceRootStore } from "@/plane-web/store/workspace";
// stores
import type { ICycleStore } from "./cycle.store";
import { CycleStore } from "./cycle.store";
import type { ICycleFilterStore } from "./cycle_filter.store";
import { CycleFilterStore } from "./cycle_filter.store";
import type { IDashboardStore } from "./dashboard.store";
import { DashboardStore } from "./dashboard.store";
import type { IEditorAssetStore } from "./editor/asset.store";
import { EditorAssetStore } from "./editor/asset.store";
import type { IProjectEstimateStore } from "./estimates/project-estimate.store";
import { ProjectEstimateStore } from "./estimates/project-estimate.store";
import type { IFavoriteStore } from "./favorite.store";
import { FavoriteStore } from "./favorite.store";
import type { IGlobalViewStore } from "./global-view.store";
import { GlobalViewStore } from "./global-view.store";
import type { IProjectInboxStore } from "./inbox/project-inbox.store";
import { ProjectInboxStore } from "./inbox/project-inbox.store";
import type { IInstanceStore } from "./instance.store";
import { InstanceStore } from "./instance.store";
import type { IIssueRootStore } from "./issue/root.store";
import { IssueRootStore } from "./issue/root.store";
import type { IIssuePropertyStore } from "./issue-properties/issue-property.store";
import { IssuePropertyStore } from "./issue-properties/issue-property.store";
import type { IIssuePropertyValueStore } from "./issue-properties/issue-property-value.store";
import { IssuePropertyValueStore } from "./issue-properties/issue-property-value.store";
import type { ILabelStore } from "./label.store";
import { LabelStore } from "./label.store";
import type { IMemberRootStore } from "./member";
import { MemberRootStore } from "./member";
import type { IModuleStore } from "./module.store";
import { ModulesStore } from "./module.store";
import type { IModuleFilterStore } from "./module_filter.store";
import { ModuleFilterStore } from "./module_filter.store";
import type { IMultipleSelectStore } from "./multiple_select.store";
import { MultipleSelectStore } from "./multiple_select.store";
import type { IWorkspaceNotificationStore } from "./notifications/workspace-notifications.store";
import { WorkspaceNotificationStore } from "./notifications/workspace-notifications.store";
import type { IProjectPageStore } from "./pages/project-page.store";
import { ProjectPageStore } from "./pages/project-page.store";
import type { IProjectRootStore } from "./project";
import { ProjectRootStore } from "./project";
import type { IProjectTemplateStore } from "./project-template/project-template.store";
import { ProjectTemplateStore } from "./project-template/project-template.store";
import type { IProjectViewStore } from "./project-view.store";
import { ProjectViewStore } from "./project-view.store";
import type { IRoleStore } from "./roles/role.store";
import { RoleStore } from "./roles/role.store";
import type { IRouterStore } from "./router.store";
import { RouterStore } from "./router.store";
import type { IStickyStore } from "./sticky/sticky.store";
import { StickyStore } from "./sticky/sticky.store";
import type { IThemeStore } from "./theme.store";
import { ThemeStore } from "./theme.store";
import type { ITeamStore } from "./teams/team.store";
import { TeamStore } from "./teams/team.store";
import type { IUserStore } from "./user";
import { UserStore } from "./user";
import type { IWorkspaceRootStore } from "./workspace";
import type { IWorkspaceSSOStore } from "./workspace-sso/workspace-sso.store";
import { WorkspaceSSOStore } from "./workspace-sso/workspace-sso.store";
import type { IWorkspaceIntakeStore } from "./workspace-intake/workspace-intake.store";
import { WorkspaceIntakeStore } from "./workspace-intake/workspace-intake.store";
import type { IWorklogStore } from "./worklog/worklog.store";
import { WorklogStore } from "./worklog/worklog.store";

enableStaticRendering(typeof window === "undefined");

export class CoreRootStore {
  workspaceRoot: IWorkspaceRootStore;
  projectRoot: IProjectRootStore;
  projectTemplateStore: IProjectTemplateStore;
  memberRoot: IMemberRootStore;
  cycle: ICycleStore;
  cycleFilter: ICycleFilterStore;
  module: IModuleStore;
  moduleFilter: IModuleFilterStore;
  projectView: IProjectViewStore;
  globalView: IGlobalViewStore;
  issue: IIssueRootStore;
  issuePropertyStore: IIssuePropertyStore;
  issuePropertyValueStore: IIssuePropertyValueStore;
  state: IStateStore;
  label: ILabelStore;
  dashboard: IDashboardStore;
  analytics: IAnalyticsStore;
  projectPages: IProjectPageStore;
  router: IRouterStore;
  commandPalette: ICommandPaletteStore;
  theme: IThemeStore;
  instance: IInstanceStore;
  user: IUserStore;
  projectInbox: IProjectInboxStore;
  projectEstimate: IProjectEstimateStore;
  multipleSelect: IMultipleSelectStore;
  workspaceNotification: IWorkspaceNotificationStore;
  workspaceSSO: IWorkspaceSSOStore;
  workspaceIntake: IWorkspaceIntakeStore;
  favorite: IFavoriteStore;
  stickyStore: IStickyStore;
  editorAssetStore: IEditorAssetStore;
  workItemFilters: IWorkItemFilterStore;
  powerK: IPowerKStore;
  roleStore: IRoleStore;
  teamStore: ITeamStore;
  worklogStore: IWorklogStore;

  constructor() {
    this.router = new RouterStore();
    this.commandPalette = new CommandPaletteStore();
    this.instance = new InstanceStore();
    this.user = new UserStore(this as unknown as RootStore);
    this.theme = new ThemeStore();
    this.workspaceRoot = new WorkspaceRootStore(this as unknown as RootStore);
    this.projectRoot = new ProjectRootStore(this);
    this.projectTemplateStore = new ProjectTemplateStore();
    this.memberRoot = new MemberRootStore(this as unknown as RootStore);
    this.cycle = new CycleStore(this);
    this.cycleFilter = new CycleFilterStore(this);
    this.module = new ModulesStore(this);
    this.moduleFilter = new ModuleFilterStore(this);
    this.projectView = new ProjectViewStore(this);
    this.globalView = new GlobalViewStore(this);
    this.issue = new IssueRootStore(this as unknown as RootStore);
    this.issuePropertyStore = new IssuePropertyStore();
    this.issuePropertyValueStore = new IssuePropertyValueStore();
    this.state = new StateStore(this as unknown as RootStore);
    this.label = new LabelStore(this);
    this.dashboard = new DashboardStore(this);
    this.multipleSelect = new MultipleSelectStore();
    this.projectInbox = new ProjectInboxStore(this);
    this.projectPages = new ProjectPageStore(this as unknown as RootStore);
    this.projectEstimate = new ProjectEstimateStore(this);
    this.workspaceNotification = new WorkspaceNotificationStore(this);
    this.workspaceSSO = new WorkspaceSSOStore();
    this.workspaceIntake = new WorkspaceIntakeStore();
    this.favorite = new FavoriteStore(this);
    this.stickyStore = new StickyStore();
    this.editorAssetStore = new EditorAssetStore();
    this.analytics = new AnalyticsStore();
    this.workItemFilters = new WorkItemFilterStore();
    this.powerK = new PowerKStore();
    this.roleStore = new RoleStore();
    this.teamStore = new TeamStore();
    this.worklogStore = new WorklogStore();
  }

  resetOnSignOut() {
    // handling the system theme when user logged out from the app
    localStorage.setItem("theme", "system");
    localStorage.setItem(LANGUAGE_STORAGE_KEY, FALLBACK_LANGUAGE);
    this.router = new RouterStore();
    this.commandPalette = new CommandPaletteStore();
    this.instance = new InstanceStore();
    this.user = new UserStore(this as unknown as RootStore);
    this.workspaceRoot = new WorkspaceRootStore(this as unknown as RootStore);
    this.projectRoot = new ProjectRootStore(this);
    this.projectTemplateStore = new ProjectTemplateStore();
    this.memberRoot = new MemberRootStore(this as unknown as RootStore);
    this.cycle = new CycleStore(this);
    this.cycleFilter = new CycleFilterStore(this);
    this.module = new ModulesStore(this);
    this.moduleFilter = new ModuleFilterStore(this);
    this.projectView = new ProjectViewStore(this);
    this.globalView = new GlobalViewStore(this);
    this.issue = new IssueRootStore(this as unknown as RootStore);
    this.issuePropertyStore = new IssuePropertyStore();
    this.issuePropertyValueStore = new IssuePropertyValueStore();
    this.state = new StateStore(this as unknown as RootStore);
    this.label = new LabelStore(this);
    this.dashboard = new DashboardStore(this);
    this.projectInbox = new ProjectInboxStore(this);
    this.projectPages = new ProjectPageStore(this as unknown as RootStore);
    this.multipleSelect = new MultipleSelectStore();
    this.projectEstimate = new ProjectEstimateStore(this);
    this.workspaceNotification = new WorkspaceNotificationStore(this);
    this.workspaceSSO = new WorkspaceSSOStore();
    this.workspaceIntake = new WorkspaceIntakeStore();
    this.favorite = new FavoriteStore(this);
    this.stickyStore = new StickyStore();
    this.editorAssetStore = new EditorAssetStore();
    this.workItemFilters = new WorkItemFilterStore();
    this.powerK = new PowerKStore();
    this.roleStore = new RoleStore();
    this.teamStore = new TeamStore();
    this.worklogStore = new WorklogStore();
  }
}
