# Sub-01 — Types

**Task:** 08 · **Tamaño:** XS

## Cambio

```ts
// packages/types/src/intake.ts
export type TWorkspaceIntakeStatus =
  | "pending" | "accepted" | "rejected" | "snoozed" | "duplicate";

export type TWorkspaceIntake = {
  id: string; workspace: string; name: string; description: string;
  is_default: boolean; logo_props: Record<string, unknown>;
  pending_count: number; created_at: string; updated_at: string;
};

export type TWorkspaceIntakeIssue = {
  id: string; intake: string; submitter: string;
  submitter_detail: { id: string; display_name: string; email: string; avatar_url: string };
  name: string; description_html: string;
  priority: "none" | "low" | "medium" | "high" | "urgent";
  metadata: Record<string, unknown>;
  status: TWorkspaceIntakeStatus;
  decision_note: string; snoozed_till: string | null;
  duplicate_of: string | null; accepted_issue: string | null;
  triaged_by: string | null; triaged_at: string | null;
  created_at: string; updated_at: string;
};
```

## Aceptación

- [ ] Exportados desde `@plane/types`.
