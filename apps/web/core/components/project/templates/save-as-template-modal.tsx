/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

"use client";

import { useEffect, useState } from "react";
import { TOAST_TYPE, setToast } from "@plane/propel/toast";
import { Button, Input, ModalCore } from "@plane/ui";
import { useProjectTemplate } from "@/hooks/store/use-project-template";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  workspaceSlug: string;
  projectId: string;
  projectName?: string;
};

export function SaveAsProjectTemplateModal({ isOpen, onClose, workspaceSlug, projectId, projectName }: Props) {
  const projectTemplateStore = useProjectTemplate();
  const [name, setName] = useState(projectName ? `${projectName} template` : "");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setName(projectName ? `${projectName} template` : "");
    setDescription("");
  }, [isOpen, projectName]);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      await projectTemplateStore.saveAs(workspaceSlug, {
        project_id: projectId,
        name: name.trim(),
        description: description.trim(),
      });
      setToast({ type: TOAST_TYPE.SUCCESS, title: "Template saved" });
      onClose();
    } catch {
      setToast({ type: TOAST_TYPE.ERROR, title: "Failed to save template" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalCore isOpen={isOpen} handleClose={onClose}>
      <div className="flex flex-col gap-4 p-5">
        <h3 className="text-h3-medium text-primary">Save as template</h3>
        <div>
          <label htmlFor="save-template-name" className="mb-1 block text-body-sm-medium text-secondary">
            Name *
          </label>
          <Input id="save-template-name" value={name} onChange={(event) => setName(event.target.value)} />
        </div>
        <div>
          <label htmlFor="save-template-description" className="mb-1 block text-body-sm-medium text-secondary">
            Description
          </label>
          <Input
            id="save-template-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>
        <div className="flex items-center justify-end gap-2">
          <Button variant="neutral-primary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} loading={submitting} disabled={!name.trim()}>
            Save
          </Button>
        </div>
      </div>
    </ModalCore>
  );
}
