/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react";
import { Button, CustomSelect, ToggleSwitch } from "@plane/ui";
import { useTranslation } from "@plane/i18n";
import { TOAST_TYPE, setToast } from "@plane/propel/toast";
import type { TWorkspaceSSOConfig } from "@plane/types";
import { SettingsBoxedControlItem } from "@/components/settings/boxed-control-item";
import { useWorkspaceSSO } from "@/hooks/store/use-workspace-sso";
import { DomainListInput } from "./domain-list-input";

const ROLE_OPTIONS = [
  { value: 15, labelKey: "workspace_settings.settings.sso.roles.member" },
  { value: 5, labelKey: "workspace_settings.settings.sso.roles.guest" },
  { value: 20, labelKey: "workspace_settings.settings.sso.roles.admin" },
];

type Props = {
  workspaceSlug: string;
  initialConfig?: TWorkspaceSSOConfig;
};

export const WorkspaceSSOForm = observer(function WorkspaceSSOForm(props: Props) {
  const { workspaceSlug, initialConfig } = props;
  const { t } = useTranslation();
  const ssoStore = useWorkspaceSSO();

  const [enabled, setEnabled] = useState(initialConfig?.enabled ?? false);
  const [domains, setDomains] = useState<string[]>(initialConfig?.allowed_domains ?? []);
  const [autoProvisionRole, setAutoProvisionRole] = useState(initialConfig?.auto_provision_role ?? 15);
  const [saving, setSaving] = useState(false);
  const [domainError, setDomainError] = useState<string | undefined>();

  useEffect(() => {
    setEnabled(initialConfig?.enabled ?? false);
    setDomains(initialConfig?.allowed_domains ?? []);
    setAutoProvisionRole(initialConfig?.auto_provision_role ?? 15);
  }, [initialConfig]);

  const selectedRoleLabel = useMemo(() => {
    const role = ROLE_OPTIONS.find((option) => option.value === autoProvisionRole);
    return role ? t(role.labelKey) : t("workspace_settings.settings.sso.roles.member");
  }, [autoProvisionRole, t]);

  const handleSave = async () => {
    if (enabled && domains.length === 0) {
      setDomainError(t("workspace_settings.settings.sso.errors.domains_required"));
      return;
    }

    setSaving(true);
    setDomainError(undefined);
    try {
      await ssoStore.save(workspaceSlug, {
        enabled,
        allowed_domains: domains,
        auto_provision_role: autoProvisionRole,
      });
      setToast({ type: TOAST_TYPE.SUCCESS, title: t("workspace_settings.settings.sso.toasts.saved") });
    } catch {
      setToast({ type: TOAST_TYPE.ERROR, title: t("workspace_settings.settings.sso.toasts.save_failed") });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex w-full max-w-3xl flex-col gap-4">
      <SettingsBoxedControlItem
        title={t("workspace_settings.settings.sso.enable.title")}
        description={t("workspace_settings.settings.sso.enable.description")}
        control={<ToggleSwitch value={enabled} onChange={() => setEnabled((value) => !value)} size="sm" />}
      />

      <div className="flex flex-col gap-3 rounded-lg border border-subtle bg-layer-2 p-4">
        <div className="flex flex-col gap-1">
          <h4 className="text-body-sm-medium text-primary">{t("workspace_settings.settings.sso.domains.title")}</h4>
          <p className="text-caption-md-regular text-tertiary">
            {t("workspace_settings.settings.sso.domains.description")}
          </p>
        </div>
        <DomainListInput
          domains={domains}
          error={domainError}
          onChange={(nextDomains) => {
            setDomains(nextDomains);
            setDomainError(undefined);
          }}
          placeholder={t("workspace_settings.settings.sso.domains.placeholder")}
          addLabel={t("workspace_settings.settings.sso.domains.add")}
        />
      </div>

      <SettingsBoxedControlItem
        title={t("workspace_settings.settings.sso.auto_provision.title")}
        description={t("workspace_settings.settings.sso.auto_provision.description")}
        control={
          <CustomSelect
            value={autoProvisionRole}
            onChange={(value: number) => setAutoProvisionRole(value)}
            label={selectedRoleLabel}
            input
          >
            {ROLE_OPTIONS.map((option) => (
              <CustomSelect.Option key={option.value} value={option.value}>
                {t(option.labelKey)}
              </CustomSelect.Option>
            ))}
          </CustomSelect>
        }
      />

      <div className="flex justify-end">
        <Button variant="primary" size="sm" onClick={handleSave} loading={saving}>
          {t("workspace_settings.settings.sso.save")}
        </Button>
      </div>
    </div>
  );
});
