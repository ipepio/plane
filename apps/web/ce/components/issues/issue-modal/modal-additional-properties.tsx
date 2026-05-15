/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { observer } from "mobx-react";
import { AlertCircle } from "lucide-react";
import type { TIssuePropertyPrimitiveValue } from "@plane/types";
import { CustomPropertyField } from "@/components/issues/issue-detail/custom-properties/property-field";
import { useIssueModal } from "@/hooks/context/use-issue-modal";
import { useIssueProperty, useIssuePropertyValue } from "@/hooks/store/use-issue-property";
import type { TIssueFields } from "./issue-type-select";

export type TWorkItemModalAdditionalPropertiesProps = {
  isDraft?: boolean;
  projectId: string | null;
  workItemId: string | undefined;
  workspaceSlug: string;
};

export const WorkItemModalAdditionalProperties = observer(function WorkItemModalAdditionalProperties(
  props: TWorkItemModalAdditionalPropertiesProps
) {
  const { workspaceSlug, projectId, workItemId } = props;
  const { watch } = useFormContext<TIssueFields>();
  const issueTypeId = watch("type_id");
  const propertyStore = useIssueProperty();
  const valueStore = useIssuePropertyValue();
  const { issuePropertyValues, setIssuePropertyValues, issuePropertyValueErrors } = useIssueModal();

  useEffect(() => {
    if (!projectId || !issueTypeId) return;
    propertyStore.fetchProperties(workspaceSlug, projectId, issueTypeId);
  }, [propertyStore, workspaceSlug, projectId, issueTypeId]);

  useEffect(() => {
    if (!projectId || !workItemId) return;
    const loadValues = async () => {
      const values = await valueStore.fetchValues(workspaceSlug, projectId, workItemId);
      const nextValues = values.reduce<Record<string, TIssuePropertyPrimitiveValue>>((acc, value) => {
        acc[value.property] = value.value;
        return acc;
      }, {});
      setIssuePropertyValues(nextValues);
    };
    loadValues();
  }, [valueStore, setIssuePropertyValues, workspaceSlug, projectId, workItemId]);

  if (!projectId || !issueTypeId) return null;

  const properties = propertyStore.propertiesByIssueType.get(issueTypeId) ?? [];
  if (properties.length === 0) return null;

  return (
    <div className="space-y-3 px-5">
      {properties.map((property) => (
        <div key={property.id}>
          <label className="mb-1 block text-body-xs-medium text-secondary">
            {property.display_name}
            {property.is_required ? " *" : ""}
          </label>
          <CustomPropertyField
            property={property}
            value={{ value: issuePropertyValues[property.id] } as any}
            disabled={false}
            onChange={async (_propertyId, value) => {
              setIssuePropertyValues((current) => ({ ...current, [property.id]: value }));
            }}
          />
          {issuePropertyValueErrors[property.id] && (
            <div className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle className="size-3" />
              {issuePropertyValueErrors[property.id]}
            </div>
          )}
        </div>
      ))}
    </div>
  );
});
