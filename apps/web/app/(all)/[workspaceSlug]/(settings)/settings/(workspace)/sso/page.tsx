/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

"use client";

import { useEffect } from "react";
import { observer } from "mobx-react";
import { EUserPermissions, EUserPermissionsLevel } from "@plane/constants";
import { useTranslation } from "@plane/i18n";
import { NotAuthorizedView } from "@/components/auth-screens/not-authorized-view";
import { PageHead } from "@/components/core/page-title";
import { SettingsContentWrapper } from "@/components/settings/content-wrapper";
import { WorkspaceSSOForm } from "@/components/settings/sso/sso-form";
import { useUserPermissions } from "@/hooks/store/user";
import { useWorkspace } from "@/hooks/store/use-workspace";
import { useWorkspaceSSO } from "@/hooks/store/use-workspace-sso";

type Props = {
  params: {
    workspaceSlug: string;
  };
};

const WorkspaceSSOSettingsPage = observer(function WorkspaceSSOSettingsPage({ params }: Props) {
  const { workspaceSlug } = params;
  const { t } = useTranslation();
  const ssoStore = useWorkspaceSSO();
  const { currentWorkspace } = useWorkspace();
  const { allowPermissions, workspaceUserInfo } = useUserPermissions();

  const canManageSettings = allowPermissions([EUserPermissions.ADMIN], EUserPermissionsLevel.WORKSPACE);

  useEffect(() => {
    ssoStore.fetch(workspaceSlug);
  }, [workspaceSlug]);

  if (workspaceUserInfo && !canManageSettings) {
    return <NotAuthorizedView section="settings" className="h-auto" />;
  }

  const config = ssoStore.config(workspaceSlug);
  const pageTitle = currentWorkspace?.name
    ? `${currentWorkspace.name} - ${t("workspace_settings.settings.sso.title")}`
    : undefined;

  return (
    <SettingsContentWrapper>
      <PageHead title={pageTitle} />
      <div className="flex flex-col gap-1 pb-4">
        <h3 className="text-h3-medium">{t("workspace_settings.settings.sso.title")}</h3>
        <p className="text-body-sm-regular text-secondary">{t("workspace_settings.settings.sso.description")}</p>
      </div>
      {ssoStore.loader ? (
        <div className="py-8 text-center text-body-sm-regular text-tertiary">
          {t("workspace_settings.settings.sso.loading")}
        </div>
      ) : (
        <WorkspaceSSOForm workspaceSlug={workspaceSlug} initialConfig={config} />
      )}
    </SettingsContentWrapper>
  );
});

export default WorkspaceSSOSettingsPage;
