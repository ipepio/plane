/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import React, { useMemo, useState } from "react";
import { observer } from "mobx-react";
// plane imports
import type { ISearchIssueResponse, TIssue } from "@plane/types";
// components
import { IssueModalContext, type TIssueModalContext } from "@/components/issues/issue-modal/context";
// hooks
import { useIssueProperty, useIssuePropertyValue } from "@/hooks/store/use-issue-property";
import { useUser } from "@/hooks/store/user/user-user";
import type { TIssuePropertyValueErrors, TIssuePropertyValues } from "@/plane-web/types/issue-types";

export type TIssueModalProviderProps = {
  templateId?: string;
  dataForPreload?: Partial<TIssue>;
  allowedProjectIds?: string[];
  children: React.ReactNode;
};

export const IssueModalProvider = observer(function IssueModalProvider(props: TIssueModalProviderProps) {
  const { children, allowedProjectIds } = props;
  // states
  const [selectedParentIssue, setSelectedParentIssue] = useState<ISearchIssueResponse | null>(null);
  const [issuePropertyValues, setIssuePropertyValues] = useState<TIssuePropertyValues>({});
  const [issuePropertyValueErrors, setIssuePropertyValueErrors] = useState<TIssuePropertyValueErrors>({});
  // store hooks
  const issuePropertyStore = useIssueProperty();
  const issuePropertyValueStore = useIssuePropertyValue();
  const { projectsWithCreatePermissions } = useUser();
  // derived values
  const projectIdsWithCreatePermissions = Object.keys(projectsWithCreatePermissions ?? {});
  const contextValue = useMemo<TIssueModalContext>(
    () => ({
      allowedProjectIds: allowedProjectIds ?? projectIdsWithCreatePermissions,
      workItemTemplateId: null,
      setWorkItemTemplateId: () => {},
      isApplyingTemplate: false,
      setIsApplyingTemplate: () => {},
      selectedParentIssue,
      setSelectedParentIssue,
      issuePropertyValues,
      setIssuePropertyValues,
      issuePropertyValueErrors,
      setIssuePropertyValueErrors,
      getIssueTypeIdOnProjectChange: () => null,
      getActiveAdditionalPropertiesLength: ({ watch }) => {
        const issueTypeId = watch("type_id");
        return issueTypeId ? (issuePropertyStore.propertiesByIssueType.get(issueTypeId) ?? []).length : 0;
      },
      handlePropertyValuesValidation: ({ watch }) => {
        const issueTypeId = watch("type_id");
        const properties = issueTypeId ? (issuePropertyStore.propertiesByIssueType.get(issueTypeId) ?? []) : [];
        const errors = properties.reduce<TIssuePropertyValueErrors>((acc, property) => {
          const value = issuePropertyValues[property.id];
          if (
            property.is_required &&
            (value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0))
          ) {
            acc[property.id] = `${property.display_name} is required.`;
          }
          return acc;
        }, {});
        setIssuePropertyValueErrors(errors);
        return Object.keys(errors).length === 0;
      },
      handleCreateUpdatePropertyValues: ({ issueId, projectId, workspaceSlug }) =>
        issuePropertyValueStore
          .updateValues(
            workspaceSlug,
            projectId,
            issueId,
            Object.entries(issuePropertyValues).map(([property, value]) => ({ property, value }))
          )
          .then(() => undefined),
      handleProjectEntitiesFetch: () => Promise.resolve(),
      handleTemplateChange: () => Promise.resolve(),
      handleConvert: () => Promise.resolve(),
      handleCreateSubWorkItem: () => Promise.resolve(),
    }),
    [
      allowedProjectIds,
      issuePropertyStore.propertiesByIssueType,
      issuePropertyValueErrors,
      issuePropertyValueStore,
      issuePropertyValues,
      projectIdsWithCreatePermissions,
      selectedParentIssue,
    ]
  );

  return <IssueModalContext.Provider value={contextValue}>{children}</IssueModalContext.Provider>;
});
