/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { useEffect, useState } from "react";
import { TOAST_TYPE, setToast } from "@plane/propel/toast";
import { Button, Input, ModalCore, TextArea } from "@plane/ui";
import type { TIssueWorklog, TIssueWorklogPayload } from "@plane/types";
import { formatDuration, parseDurationToSeconds } from "@/helpers/duration";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: TIssueWorklogPayload) => Promise<void>;
  worklog?: TIssueWorklog;
};

const toDateTimeInputValue = (value?: string) => {
  const date = value ? new Date(value) : new Date();
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60_000);
  return localDate.toISOString().slice(0, 16);
};

export function LogTimeModal(props: Props) {
  const { isOpen, onClose, onSubmit, worklog } = props;
  const [duration, setDuration] = useState("");
  const [startedAt, setStartedAt] = useState(toDateTimeInputValue());
  const [description, setDescription] = useState("");
  const [isBillable, setIsBillable] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setDuration(worklog ? formatDuration(worklog.duration) : "");
    setStartedAt(toDateTimeInputValue(worklog?.started_at));
    setDescription(worklog?.description ?? "");
    setIsBillable(worklog?.is_billable ?? true);
  }, [worklog, isOpen]);

  const parsedDuration = parseDurationToSeconds(duration);

  const handleSubmit = async () => {
    if (!parsedDuration) {
      setToast({ type: TOAST_TYPE.ERROR, title: "Enter a valid duration" });
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        duration: parsedDuration,
        started_at: new Date(startedAt).toISOString(),
        description: description.trim(),
        is_billable: isBillable,
      });
      onClose();
    } catch {
      setToast({ type: TOAST_TYPE.ERROR, title: worklog ? "Failed to update worklog" : "Failed to log time" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalCore isOpen={isOpen} handleClose={onClose} closeOnOutsideClick={false}>
      <div className="flex w-full max-w-lg flex-col gap-4 p-5">
        <div>
          <h3 className="text-h3-medium text-primary">{worklog ? "Edit logged time" : "Log time"}</h3>
          <p className="mt-1 text-body-sm-regular text-secondary">Track a work session against this issue.</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="worklog-duration" className="mb-1 block text-body-sm-medium text-secondary">
              Duration
            </label>
            <Input
              id="worklog-duration"
              value={duration}
              onChange={(event) => setDuration(event.target.value)}
              placeholder="1h30m"
            />
          </div>
          <div>
            <label htmlFor="worklog-started-at" className="mb-1 block text-body-sm-medium text-secondary">
              Date
            </label>
            <Input
              id="worklog-started-at"
              type="datetime-local"
              value={startedAt}
              onChange={(event) => setStartedAt(event.target.value)}
            />
          </div>
        </div>
        <div>
          <label htmlFor="worklog-description" className="mb-1 block text-body-sm-medium text-secondary">
            Description
          </label>
          <TextArea
            id="worklog-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="What was worked on"
            rows={3}
            className="min-h-[80px]"
          />
        </div>
        <label htmlFor="worklog-billable" className="flex items-center gap-2 text-body-sm-regular text-secondary">
          <input
            id="worklog-billable"
            type="checkbox"
            className="size-4 rounded border-subtle"
            checked={isBillable}
            onChange={(event) => setIsBillable(event.target.checked)}
          />
          Billable
        </label>
        <div className="flex items-center justify-end gap-2">
          <Button variant="neutral-primary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" loading={submitting} disabled={!parsedDuration} onClick={handleSubmit}>
            {worklog ? "Save" : "Log time"}
          </Button>
        </div>
      </div>
    </ModalCore>
  );
}
