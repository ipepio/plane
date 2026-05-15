from django.utils import timezone

from plane.db.models import IssueWorklog


def test_issue_worklog_str_returns_issue_user_and_duration():
    worklog = IssueWorklog(issue_id="issue-id", logged_by_id="user-id", duration=5400, started_at=timezone.now())

    assert str(worklog) == "issue-id user-id 5400s"
