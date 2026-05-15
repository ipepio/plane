/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

"use client";

import { useEffect } from "react";
import { observer } from "mobx-react";
import { useProjectTemplate } from "@/hooks/store/use-project-template";

export type TProjectTemplateSelect = {
  disabled?: boolean;
  value: string;
  workspaceSlug: string;
  onChange: (templateId: string) => void;
};

export const ProjectTemplateSelect = observer(function ProjectTemplateSelect({
  disabled,
  value,
  workspaceSlug,
  onChange,
}: TProjectTemplateSelect) {
  const projectTemplateStore = useProjectTemplate();

  useEffect(() => {
    projectTemplateStore.fetchAll(workspaceSlug);
  }, [projectTemplateStore, workspaceSlug]);

  const templates = Array.from(projectTemplateStore.templates.values());

  if (projectTemplateStore.loader || templates.length === 0) return null;

  return (
    <div>
      <label htmlFor="project-template" className="mb-1 block text-body-sm-medium text-secondary">
        Template
      </label>
      <select
        id="project-template"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 w-full rounded border border-subtle bg-layer-2 px-2 text-body-sm-regular text-primary outline-none"
      >
        <option value="">Blank project</option>
        {templates.map((template) => (
          <option key={template.id} value={template.id}>
            {template.name}
          </option>
        ))}
      </select>
    </div>
  );
});
