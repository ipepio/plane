/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { Button } from "@plane/propel/button";
import { TOAST_TYPE, setToast } from "@plane/propel/toast";
import { EIssuesStoreType } from "@plane/types";
import { EModalPosition, EModalWidth, Input, ModalCore } from "@plane/ui";
import { useIssues } from "@/hooks/store/use-issues";
import { useProject } from "@/hooks/store/use-project";

type TDuplicateWorkItemModalProps = {
  workItemId: string;
  onClose: () => void;
  isOpen: boolean;
  workspaceSlug: string;
  projectId: string;
};

export const DuplicateWorkItemModal = observer(function DuplicateWorkItemModal(props: TDuplicateWorkItemModalProps) {
  const { workItemId, isOpen, onClose, workspaceSlug, projectId } = props;

  const { issueMap, issues: projectIssues } = useIssues(EIssuesStoreType.PROJECT);
  const { getProjectById, workspaceProjectIds } = useProject();

  const sourceIssue = issueMap[workItemId];

  const [name, setName] = useState("");
  const [targetProjectId, setTargetProjectId] = useState(projectId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && sourceIssue) {
      setName(`${sourceIssue.name} (copy)`);
      setTargetProjectId(projectId);
    }
  }, [isOpen, sourceIssue, projectId]);

  const handleClose = () => {
    setIsSubmitting(false);
    onClose();
  };

  const handleSubmit = async () => {
    if (!sourceIssue || !name.trim()) return;

    const sameProject = targetProjectId === projectId;

    setIsSubmitting(true);
    try {
      // Only send writable fields; drop read-only, computed, and project-scoped references
      // when copying to a different project.
      const payload: Partial<typeof sourceIssue> = {
        name: name.trim(),
        description_html: sourceIssue.description_html,
        priority: sourceIssue.priority,
        start_date: sourceIssue.start_date,
        target_date: sourceIssue.target_date,
        estimate_point: sourceIssue.estimate_point,
        // Keep assignees (users exist across projects)
        assignee_ids: sourceIssue.assignee_ids,
        team_assignee_ids: sourceIssue.team_assignee_ids,
        // Keep project-scoped fields only when copying within the same project
        ...(sameProject && {
          state_id: sourceIssue.state_id,
          label_ids: sourceIssue.label_ids,
          parent_id: sourceIssue.parent_id,
          type_id: sourceIssue.type_id,
        }),
        sourceIssueId: sourceIssue.id,
      };

      await projectIssues.createIssue(workspaceSlug, targetProjectId, payload);

      const targetProject = getProjectById(targetProjectId);
      setToast({
        type: TOAST_TYPE.SUCCESS,
        title: "Issue duplicated",
        message: `Created in ${targetProject?.name ?? targetProjectId}.`,
      });
      handleClose();
    } catch {
      setToast({
        type: TOAST_TYPE.ERROR,
        title: "Could not duplicate issue",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!sourceIssue) return null;

  const sourceProject = getProjectById(projectId);

  return (
    <ModalCore
      isOpen={isOpen}
      handleClose={handleClose}
      position={EModalPosition.CENTER}
      width={EModalWidth.LG}
    >
      <div className="px-5 py-4">
        <h3 className="text-18 font-medium">Duplicate issue</h3>
        <p className="mt-1 text-13 text-secondary">
          {sourceProject?.identifier}-{sourceIssue.sequence_id}: {sourceIssue.name}
        </p>

        <div className="mt-4 flex flex-col gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-secondary">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Issue name"
              autoFocus
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-secondary">Target project</label>
            <select
              value={targetProjectId}
              onChange={(e) => setTargetProjectId(e.target.value)}
              className="h-8 w-full rounded border border-subtle bg-layer-2 px-2 text-sm text-primary outline-none"
            >
              {(workspaceProjectIds ?? []).map((id) => {
                const project = getProjectById(id);
                if (!project) return null;
                return (
                  <option key={id} value={id}>
                    {project.name}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" size="lg" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={!name.trim()}
          >
            {isSubmitting ? "Duplicating…" : "Duplicate"}
          </Button>
        </div>
      </div>
    </ModalCore>
  );
});
