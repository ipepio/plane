/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

"use client";

import { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { useRouter } from "next/navigation";
import { Button } from "@plane/ui";
import { EUserPermissions, EUserPermissionsLevel } from "@plane/constants";
import { useTranslation } from "@plane/i18n";
import { NotAuthorizedView } from "@/components/auth-screens/not-authorized-view";
import { PageHead } from "@/components/core/page-title";
import { SettingsContentWrapper } from "@/components/settings/content-wrapper";
import { CreateRoleModal } from "@/components/roles/create-role-modal";
import { RolesList } from "@/components/roles/roles-list";
import { useRole } from "@/hooks/store/use-role";
import { useUserPermissions } from "@/hooks/store/user";
import { useWorkspace } from "@/hooks/store/use-workspace";

type Props = {
  params: {
    workspaceSlug: string;
  };
};

const RolesSettingsPage = observer(function RolesSettingsPage({ params }: Props) {
  const { workspaceSlug } = params;
  const [createModal, setCreateModal] = useState(false);

  const router = useRouter();
  const roleStore = useRole();
  const { allowPermissions, workspaceUserInfo } = useUserPermissions();
  const { currentWorkspace } = useWorkspace();

  const canManageRoles = allowPermissions([EUserPermissions.ADMIN], EUserPermissionsLevel.WORKSPACE);
  const { t } = useTranslation();

  useEffect(() => {
    roleStore.fetchAll(workspaceSlug);
  }, [workspaceSlug]);

  if (workspaceUserInfo && !canManageRoles) {
    return <NotAuthorizedView section="settings" className="h-auto" />;
  }

  const roles = Array.from(roleStore.roles.values());
  const pageTitle = currentWorkspace?.name ? `${currentWorkspace.name} - Roles` : undefined;

  return (
    <SettingsContentWrapper>
      <PageHead title={pageTitle} />
      <CreateRoleModal
        workspaceSlug={workspaceSlug}
        isOpen={createModal}
        onClose={() => setCreateModal(false)}
        onCreated={(roleId) => {
          setCreateModal(false);
          router.push(`/${workspaceSlug}/settings/roles/${roleId}`);
        }}
      />
      <div className="flex items-center justify-between pb-4">
        <h3 className="text-h3-medium">{t("roles.title")}</h3>
        <Button variant="primary" size="sm" onClick={() => setCreateModal(true)}>
          {t("roles.new_role")}
        </Button>
      </div>
      {roleStore.loader ? (
        <div className="py-8 text-center text-body-sm-regular text-tertiary">{t("roles.loading")}</div>
      ) : roles.length === 0 ? (
        <div className="py-8 text-center text-body-sm-regular text-tertiary">{t("roles.no_roles")}</div>
      ) : (
        <RolesList workspaceSlug={workspaceSlug} roles={roles} />
      )}
    </SettingsContentWrapper>
  );
});

export default RolesSettingsPage;
