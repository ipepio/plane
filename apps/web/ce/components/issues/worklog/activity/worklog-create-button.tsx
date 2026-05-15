import { useState } from "react";
import { Timer } from "lucide-react";
import { TOAST_TYPE, setToast } from "@plane/propel/toast";
import { Button } from "@plane/ui";
import { LogTimeModal } from "@/components/issues/issue-detail/worklog/log-time-modal";
import { useWorklog } from "@/hooks/store/use-worklog";

type TIssueActivityWorklogCreateButton = {
  workspaceSlug: string;
  projectId: string;
  issueId: string;
  disabled: boolean;
};

export function IssueActivityWorklogCreateButton(props: TIssueActivityWorklogCreateButton) {
  const { workspaceSlug, projectId, issueId, disabled } = props;
  const [isOpen, setIsOpen] = useState(false);
  const worklogStore = useWorklog();

  return (
    <>
      <LogTimeModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={async (payload) => {
          await worklogStore.createIssueWorklog(workspaceSlug, projectId, issueId, payload);
          setToast({ type: TOAST_TYPE.SUCCESS, title: "Time logged" });
        }}
      />
      <Button
        variant="neutral-primary"
        size="sm"
        prependIcon={<Timer className="size-3.5" />}
        disabled={disabled}
        onClick={() => setIsOpen(true)}
      >
        Log time
      </Button>
    </>
  );
}
