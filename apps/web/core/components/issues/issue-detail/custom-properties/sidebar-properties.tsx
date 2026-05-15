/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { useEffect } from "react";
import { observer } from "mobx-react";
import { SlidersHorizontal } from "lucide-react";
import { TOAST_TYPE, setToast } from "@plane/propel/toast";
import type { TIssuePropertyPrimitiveValue } from "@plane/types";
import { SidebarPropertyListItem } from "@/components/common/layout/sidebar/property-list-item";
import { useIssueProperty, useIssuePropertyValue } from "@/hooks/store/use-issue-property";
import { CustomPropertyField } from "./property-field";

type Props = {
  workItemId: string;
  workItemTypeId: string | null;
  projectId: string;
  workspaceSlug: string;
  isEditable: boolean;
};

export const CustomSidebarProperties = observer(function CustomSidebarProperties(props: Props) {
  const { workItemId, workItemTypeId, projectId, workspaceSlug, isEditable } = props;
  const propertyStore = useIssueProperty();
  const valueStore = useIssuePropertyValue();

  useEffect(() => {
    if (!workItemTypeId) return;
    propertyStore.fetchProperties(workspaceSlug, projectId, workItemTypeId);
    valueStore.fetchValues(workspaceSlug, projectId, workItemId);
  }, [propertyStore, valueStore, workspaceSlug, projectId, workItemTypeId, workItemId]);

  if (!workItemTypeId) return null;

  const properties = propertyStore.propertiesByIssueType.get(workItemTypeId) ?? [];
  const values = valueStore.valuesByIssue.get(workItemId) ?? [];
  const valueByProperty = new Map(values.map((value) => [value.property, value]));

  if (properties.length === 0) return null;

  const handleChange = async (propertyId: string, value: TIssuePropertyPrimitiveValue) => {
    try {
      await valueStore.updateValues(workspaceSlug, projectId, workItemId, [{ property: propertyId, value }]);
    } catch {
      setToast({ type: TOAST_TYPE.ERROR, title: "Failed to update custom field" });
    }
  };

  return (
    <>
      {properties.map((property) => (
        <SidebarPropertyListItem
          key={property.id}
          icon={SlidersHorizontal}
          label={`${property.display_name}${property.is_required ? " *" : ""}`}
        >
          <CustomPropertyField
            property={property}
            value={valueByProperty.get(property.id)}
            disabled={!isEditable}
            onChange={handleChange}
          />
        </SidebarPropertyListItem>
      ))}
    </>
  );
});
