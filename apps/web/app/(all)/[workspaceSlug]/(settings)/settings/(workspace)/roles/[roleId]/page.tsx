/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

"use client";

import { useEffect } from "react";
import { observer } from "mobx-react";
import { EUserPermissions, EUserPermissionsLevel } from "@plane/constants";
import { NotAuthorizedView } from "@/components/auth-screens/not-authorized-view";
import { PageHead } from "@/components/core/page-title";
import { SettingsContentWrapper } from "@/components/settings/content-wrapper";
import { RoleEditor } from "@/components/roles/role-editor";
import { useRole } from "@/hooks/store/use-role";
import { useUserPermissions } from "@/hooks/store/user";

type Props = {
  params: {
    workspaceSlug: string;
    roleId: string;
  };
};

const RoleEditPage = observer(function RoleEditPage({ params }: Props) {
  const { workspaceSlug, roleId } = params;
  const roleStore = useRole();
  const { allowPermissions, workspaceUserInfo } = useUserPermissions();

  const canManageRoles = allowPermissions([EUserPermissions.ADMIN], EUserPermissionsLevel.WORKSPACE);

  useEffect(() => {
    if (!roleStore.roles.size) {
      roleStore.fetchAll(workspaceSlug);
    }
    if (!roleStore.permissions.length) {
      roleStore.fetchPermissions(workspaceSlug);
    }
  }, [workspaceSlug]);

  if (workspaceUserInfo && !canManageRoles) {
    return <NotAuthorizedView section="settings" className="h-auto" />;
  }

  const role = roleStore.roles.get(roleId);

  if (!role) {
    return (
      <SettingsContentWrapper>
        <div className="py-8 text-center text-body-sm-regular text-tertiary">
          {roleStore.loader ? "Loading..." : "Role not found."}
        </div>
      </SettingsContentWrapper>
    );
  }

  return (
    <SettingsContentWrapper>
      <PageHead title={`${role.name} - Role`} />
      <div className="pb-4">
        <h3 className="text-h3-medium">{role.name}</h3>
      </div>
      <RoleEditor workspaceSlug={workspaceSlug} role={role} permissions={roleStore.permissions} />
    </SettingsContentWrapper>
  );
});

export default RoleEditPage;
