/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { action, makeObservable, observable, runInAction } from "mobx";
import { WorkspaceIntakeService } from "@plane/services";
import type {
  TIntakeFormField,
  TIntakeFormFieldOption,
  TIntakeFormFieldOptionPayload,
  TIntakeFormFieldPayload,
  TWorkspaceIntake,
  TWorkspaceIntakeIssue,
  TWorkspaceIntakeIssueAcceptPayload,
  TWorkspaceIntakeIssueDuplicatePayload,
  TWorkspaceIntakeIssuePayload,
  TWorkspaceIntakeIssueRejectPayload,
  TWorkspaceIntakeIssueSnoozePayload,
  TWorkspaceIntakePayload,
} from "@plane/types";

export interface IWorkspaceIntakeStore {
  intakes: Map<string, TWorkspaceIntake[]>;
  issues: Map<string, TWorkspaceIntakeIssue[]>;
  fields: Map<string, TIntakeFormField[]>;
  loader: boolean;
  fetchIntakes: (workspaceSlug: string) => Promise<TWorkspaceIntake[]>;
  fetchIssues: (
    workspaceSlug: string,
    params?: Record<string, string | number | undefined>
  ) => Promise<TWorkspaceIntakeIssue[]>;
  createIntake: (workspaceSlug: string, data: TWorkspaceIntakePayload) => Promise<TWorkspaceIntake>;
  updateIntake: (
    workspaceSlug: string,
    intakeId: string,
    data: Partial<TWorkspaceIntakePayload>
  ) => Promise<TWorkspaceIntake>;
  deleteIntake: (workspaceSlug: string, intakeId: string) => Promise<void>;
  fetchFields: (workspaceSlug: string, intakeId: string) => Promise<TIntakeFormField[]>;
  createField: (workspaceSlug: string, intakeId: string, data: TIntakeFormFieldPayload) => Promise<TIntakeFormField>;
  updateField: (
    workspaceSlug: string,
    intakeId: string,
    fieldId: string,
    data: Partial<TIntakeFormFieldPayload>
  ) => Promise<TIntakeFormField>;
  deleteField: (workspaceSlug: string, intakeId: string, fieldId: string) => Promise<void>;
  reorderFields: (
    workspaceSlug: string,
    intakeId: string,
    fields: { id: string; relative_order: number }[]
  ) => Promise<TIntakeFormField[]>;
  createFieldOption: (
    workspaceSlug: string,
    intakeId: string,
    fieldId: string,
    data: TIntakeFormFieldOptionPayload
  ) => Promise<TIntakeFormFieldOption>;
  updateFieldOption: (
    workspaceSlug: string,
    intakeId: string,
    fieldId: string,
    optionId: string,
    data: Partial<TIntakeFormFieldOptionPayload>
  ) => Promise<TIntakeFormFieldOption>;
  deleteFieldOption: (workspaceSlug: string, intakeId: string, fieldId: string, optionId: string) => Promise<void>;
  createIssue: (workspaceSlug: string, data: TWorkspaceIntakeIssuePayload) => Promise<TWorkspaceIntakeIssue>;
  updateIssue: (
    workspaceSlug: string,
    issueId: string,
    data: Partial<TWorkspaceIntakeIssuePayload>
  ) => Promise<TWorkspaceIntakeIssue>;
  acceptIssue: (
    workspaceSlug: string,
    issueId: string,
    data: TWorkspaceIntakeIssueAcceptPayload
  ) => Promise<TWorkspaceIntakeIssue>;
  rejectIssue: (
    workspaceSlug: string,
    issueId: string,
    data: TWorkspaceIntakeIssueRejectPayload
  ) => Promise<TWorkspaceIntakeIssue>;
  snoozeIssue: (
    workspaceSlug: string,
    issueId: string,
    data: TWorkspaceIntakeIssueSnoozePayload
  ) => Promise<TWorkspaceIntakeIssue>;
  duplicateIssue: (
    workspaceSlug: string,
    issueId: string,
    data: TWorkspaceIntakeIssueDuplicatePayload
  ) => Promise<TWorkspaceIntakeIssue>;
  getIntakes: (workspaceSlug: string) => TWorkspaceIntake[];
  getIssues: (workspaceSlug: string) => TWorkspaceIntakeIssue[];
  getFields: (intakeId: string) => TIntakeFormField[];
}

export class WorkspaceIntakeStore implements IWorkspaceIntakeStore {
  intakes: Map<string, TWorkspaceIntake[]> = new Map();
  issues: Map<string, TWorkspaceIntakeIssue[]> = new Map();
  fields: Map<string, TIntakeFormField[]> = new Map();
  loader = false;

  private service: WorkspaceIntakeService;

  constructor() {
    makeObservable(this, {
      intakes: observable,
      issues: observable,
      fields: observable,
      loader: observable,
      fetchIntakes: action,
      fetchIssues: action,
      createIntake: action,
      updateIntake: action,
      deleteIntake: action,
      fetchFields: action,
      createField: action,
      updateField: action,
      deleteField: action,
      reorderFields: action,
      createFieldOption: action,
      updateFieldOption: action,
      deleteFieldOption: action,
      createIssue: action,
      updateIssue: action,
      acceptIssue: action,
      rejectIssue: action,
      snoozeIssue: action,
      duplicateIssue: action,
    });
    this.service = new WorkspaceIntakeService();
  }

  getIntakes(workspaceSlug: string): TWorkspaceIntake[] {
    return this.intakes.get(workspaceSlug) ?? [];
  }

  getIssues(workspaceSlug: string): TWorkspaceIntakeIssue[] {
    return this.issues.get(workspaceSlug) ?? [];
  }

  getFields(intakeId: string): TIntakeFormField[] {
    return this.fields.get(intakeId) ?? [];
  }

  private upsertIssue(workspaceSlug: string, issue: TWorkspaceIntakeIssue) {
    const currentIssues = this.getIssues(workspaceSlug);
    const nextIssues = currentIssues.some((currentIssue) => currentIssue.id === issue.id)
      ? currentIssues.map((currentIssue) => (currentIssue.id === issue.id ? issue : currentIssue))
      : [issue, ...currentIssues];
    this.issues.set(workspaceSlug, nextIssues);
  }

  async fetchIntakes(workspaceSlug: string): Promise<TWorkspaceIntake[]> {
    runInAction(() => {
      this.loader = true;
    });
    try {
      const intakes = await this.service.listIntakes(workspaceSlug);
      runInAction(() => {
        this.intakes.set(workspaceSlug, intakes);
      });
      return intakes;
    } finally {
      runInAction(() => {
        this.loader = false;
      });
    }
  }

  async fetchIssues(
    workspaceSlug: string,
    params: Record<string, string | number | undefined> = {}
  ): Promise<TWorkspaceIntakeIssue[]> {
    const response = await this.service.listIssues(workspaceSlug, params);
    const issues = response.results ?? [];
    runInAction(() => {
      this.issues.set(workspaceSlug, issues);
    });
    return issues;
  }

  async createIntake(workspaceSlug: string, data: TWorkspaceIntakePayload): Promise<TWorkspaceIntake> {
    const intake = await this.service.createIntake(workspaceSlug, data);
    runInAction(() => {
      const currentIntakes = this.getIntakes(workspaceSlug).map((currentIntake) =>
        intake.is_default ? Object.assign({}, currentIntake, { is_default: false }) : currentIntake
      );
      this.intakes.set(workspaceSlug, [intake, ...currentIntakes]);
    });
    return intake;
  }

  async updateIntake(
    workspaceSlug: string,
    intakeId: string,
    data: Partial<TWorkspaceIntakePayload>
  ): Promise<TWorkspaceIntake> {
    const intake = await this.service.updateIntake(workspaceSlug, intakeId, data);
    runInAction(() => {
      this.intakes.set(
        workspaceSlug,
        this.getIntakes(workspaceSlug).map((currentIntake) => {
          if (currentIntake.id === intake.id) return intake;
          return intake.is_default ? Object.assign({}, currentIntake, { is_default: false }) : currentIntake;
        })
      );
    });
    return intake;
  }

  async deleteIntake(workspaceSlug: string, intakeId: string): Promise<void> {
    await this.service.deleteIntake(workspaceSlug, intakeId);
    runInAction(() => {
      this.intakes.set(
        workspaceSlug,
        this.getIntakes(workspaceSlug).filter((intake) => intake.id !== intakeId)
      );
    });
  }

  private upsertField(intakeId: string, field: TIntakeFormField) {
    const currentFields = this.getFields(intakeId);
    const nextFields = currentFields.some((currentField) => currentField.id === field.id)
      ? currentFields.map((currentField) => (currentField.id === field.id ? field : currentField))
      : [...currentFields, field];
    this.fields.set(intakeId, nextFields);
  }

  async fetchFields(workspaceSlug: string, intakeId: string): Promise<TIntakeFormField[]> {
    const fields = await this.service.listFields(workspaceSlug, intakeId);
    runInAction(() => {
      this.fields.set(intakeId, fields);
    });
    return fields;
  }

  async createField(workspaceSlug: string, intakeId: string, data: TIntakeFormFieldPayload): Promise<TIntakeFormField> {
    const field = await this.service.createField(workspaceSlug, intakeId, data);
    runInAction(() => this.upsertField(intakeId, field));
    return field;
  }

  async updateField(
    workspaceSlug: string,
    intakeId: string,
    fieldId: string,
    data: Partial<TIntakeFormFieldPayload>
  ): Promise<TIntakeFormField> {
    const field = await this.service.updateField(workspaceSlug, intakeId, fieldId, data);
    runInAction(() => this.upsertField(intakeId, field));
    return field;
  }

  async deleteField(workspaceSlug: string, intakeId: string, fieldId: string): Promise<void> {
    await this.service.deleteField(workspaceSlug, intakeId, fieldId);
    runInAction(() => {
      this.fields.set(
        intakeId,
        this.getFields(intakeId).filter((field) => field.id !== fieldId)
      );
    });
  }

  async reorderFields(
    workspaceSlug: string,
    intakeId: string,
    fields: { id: string; relative_order: number }[]
  ): Promise<TIntakeFormField[]> {
    const reorderedFields = await this.service.reorderFields(workspaceSlug, intakeId, fields);
    runInAction(() => {
      this.fields.set(intakeId, reorderedFields);
    });
    return reorderedFields;
  }

  async createFieldOption(
    workspaceSlug: string,
    intakeId: string,
    fieldId: string,
    data: TIntakeFormFieldOptionPayload
  ): Promise<TIntakeFormFieldOption> {
    const option = await this.service.createFieldOption(workspaceSlug, intakeId, fieldId, data);
    await this.fetchFields(workspaceSlug, intakeId);
    return option;
  }

  async updateFieldOption(
    workspaceSlug: string,
    intakeId: string,
    fieldId: string,
    optionId: string,
    data: Partial<TIntakeFormFieldOptionPayload>
  ): Promise<TIntakeFormFieldOption> {
    const option = await this.service.updateFieldOption(workspaceSlug, intakeId, fieldId, optionId, data);
    await this.fetchFields(workspaceSlug, intakeId);
    return option;
  }

  async deleteFieldOption(workspaceSlug: string, intakeId: string, fieldId: string, optionId: string): Promise<void> {
    await this.service.deleteFieldOption(workspaceSlug, intakeId, fieldId, optionId);
    await this.fetchFields(workspaceSlug, intakeId);
  }

  async createIssue(workspaceSlug: string, data: TWorkspaceIntakeIssuePayload): Promise<TWorkspaceIntakeIssue> {
    const issue = await this.service.createIssue(workspaceSlug, data);
    runInAction(() => this.upsertIssue(workspaceSlug, issue));
    return issue;
  }

  async updateIssue(
    workspaceSlug: string,
    issueId: string,
    data: Partial<TWorkspaceIntakeIssuePayload>
  ): Promise<TWorkspaceIntakeIssue> {
    const issue = await this.service.updateIssue(workspaceSlug, issueId, data);
    runInAction(() => this.upsertIssue(workspaceSlug, issue));
    return issue;
  }

  async acceptIssue(
    workspaceSlug: string,
    issueId: string,
    data: TWorkspaceIntakeIssueAcceptPayload
  ): Promise<TWorkspaceIntakeIssue> {
    const issue = await this.service.acceptIssue(workspaceSlug, issueId, data);
    runInAction(() => this.upsertIssue(workspaceSlug, issue));
    return issue;
  }

  async rejectIssue(
    workspaceSlug: string,
    issueId: string,
    data: TWorkspaceIntakeIssueRejectPayload
  ): Promise<TWorkspaceIntakeIssue> {
    const issue = await this.service.rejectIssue(workspaceSlug, issueId, data);
    runInAction(() => this.upsertIssue(workspaceSlug, issue));
    return issue;
  }

  async snoozeIssue(
    workspaceSlug: string,
    issueId: string,
    data: TWorkspaceIntakeIssueSnoozePayload
  ): Promise<TWorkspaceIntakeIssue> {
    const issue = await this.service.snoozeIssue(workspaceSlug, issueId, data);
    runInAction(() => this.upsertIssue(workspaceSlug, issue));
    return issue;
  }

  async duplicateIssue(
    workspaceSlug: string,
    issueId: string,
    data: TWorkspaceIntakeIssueDuplicatePayload
  ): Promise<TWorkspaceIntakeIssue> {
    const issue = await this.service.duplicateIssue(workspaceSlug, issueId, data);
    runInAction(() => this.upsertIssue(workspaceSlug, issue));
    return issue;
  }
}
