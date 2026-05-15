import { useEffect } from "react";
import { observer } from "mobx-react";
import { Timer } from "lucide-react";
import { formatDuration } from "@/helpers/duration";
import { useWorklog } from "@/hooks/store/use-worklog";

type TIssueWorklogProperty = {
  workspaceSlug: string;
  projectId: string;
  issueId: string;
  disabled: boolean;
};

export const IssueWorklogProperty = observer(function IssueWorklogProperty(props: TIssueWorklogProperty) {
  const { workspaceSlug, projectId, issueId } = props;
  const worklogStore = useWorklog();

  useEffect(() => {
    worklogStore.fetchIssueWorklogs(workspaceSlug, projectId, issueId);
  }, [worklogStore, workspaceSlug, projectId, issueId]);

  const worklogs = worklogStore.issueWorklogs.get(`${projectId}:${issueId}`) ?? [];
  const totalSeconds = worklogs.reduce((acc, item) => acc + item.duration, 0);

  return (
    <div className="flex items-center gap-2 rounded px-2 py-1 text-body-sm-regular text-secondary">
      <Timer className="size-3.5 shrink-0" />
      <span className="truncate">Logged {formatDuration(totalSeconds)}</span>
    </div>
  );
});
