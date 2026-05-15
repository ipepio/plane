# Sub-01 — Tipos TWorklog

**Task:** 07 · **Tamaño:** XS

## Cambio

```ts
// packages/types/src/issues/worklog.ts
export type TWorklog = {
  id: string;
  issue: string;
  project: string;
  workspace: string;
  logged_by: string;
  duration: number;            // seconds
  started_at: string;          // ISO
  description: string;
  is_billable: boolean;
  created_at: string;
  updated_at: string;
};

export type TWorklogPayload = Pick<TWorklog, "duration" | "started_at" | "description" | "is_billable">;

export type TWorklogReport = TWorklog & {
  user_display_name: string;
  user_email: string;
  project_name: string;
  project_identifier: string;
  issue_name: string;
  issue_sequence_id: number;
};

export type TWorklogAggregate = {
  key: string | number;
  total_seconds: number;
  billable_seconds: number;
};

export type TWorklogGroupBy = "day" | "week" | "month" | "user" | "project";

export type TWorklogFilters = {
  from?: string;
  to?: string;
  user?: string[];
  project?: string[];
  billable?: boolean;
  group_by?: TWorklogGroupBy;
};
```

## Aceptación

- [ ] Tipos exportados desde `@plane/types`.
