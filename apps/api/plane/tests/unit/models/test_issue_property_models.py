from plane.db.models import IssueProperty, IssuePropertyOption, IssuePropertyValue


def test_issue_property_str_returns_display_name():
    property = IssueProperty(display_name="Severity", name="severity", type="select")

    assert str(property) == "Severity"


def test_issue_property_option_str_returns_name():
    option = IssuePropertyOption(name="Critical", value="critical")

    assert str(option) == "Critical"


def test_issue_property_value_str_returns_issue_and_property_ids():
    value = IssuePropertyValue(issue_id="issue-id", property_id="property-id")

    assert str(value) == "issue-id property-id"
