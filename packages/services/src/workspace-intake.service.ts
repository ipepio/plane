/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { API_BASE_URL } from "@plane/constants";
import type {
  TIntakeFormField,
  TIntakeFormFieldOption,
  TIntakeFormFieldOptionPayload,
  TIntakeFormFieldPayload,
  TWorkspaceIntake,
  TWorkspaceIntakeIssue,
  TWorkspaceIntakeIssueAcceptPayload,
  TWorkspaceIntakeIssueDuplicatePayload,
  TWorkspaceIntakeIssueListResponse,
  TWorkspaceIntakeIssuePayload,
  TWorkspaceIntakeIssueRejectPayload,
  TWorkspaceIntakeIssueSnoozePayload,
  TWorkspaceIntakePayload,
} from "@plane/types";
import { APIService } from "./api.service";

export class WorkspaceIntakeService extends APIService {
  constructor(BASE_URL?: string) {
    super(BASE_URL || API_BASE_URL);
  }

  async listIntakes(workspaceSlug: string): Promise<TWorkspaceIntake[]> {
    return this.get(`/api/workspaces/${workspaceSlug}/workspace-intakes/`)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async createIntake(workspaceSlug: string, data: TWorkspaceIntakePayload): Promise<TWorkspaceIntake> {
    return this.post(`/api/workspaces/${workspaceSlug}/workspace-intakes/`, data)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async updateIntake(
    workspaceSlug: string,
    intakeId: string,
    data: Partial<TWorkspaceIntakePayload>
  ): Promise<TWorkspaceIntake> {
    return this.patch(`/api/workspaces/${workspaceSlug}/workspace-intakes/${intakeId}/`, data)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async deleteIntake(workspaceSlug: string, intakeId: string): Promise<void> {
    return this.delete(`/api/workspaces/${workspaceSlug}/workspace-intakes/${intakeId}/`)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async listFields(workspaceSlug: string, intakeId: string): Promise<TIntakeFormField[]> {
    return this.get(`/api/workspaces/${workspaceSlug}/intakes/${intakeId}/form-fields/`)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async createField(workspaceSlug: string, intakeId: string, data: TIntakeFormFieldPayload): Promise<TIntakeFormField> {
    return this.post(`/api/workspaces/${workspaceSlug}/intakes/${intakeId}/form-fields/`, data)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async updateField(
    workspaceSlug: string,
    intakeId: string,
    fieldId: string,
    data: Partial<TIntakeFormFieldPayload>
  ): Promise<TIntakeFormField> {
    return this.patch(`/api/workspaces/${workspaceSlug}/intakes/${intakeId}/form-fields/${fieldId}/`, data)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async deleteField(workspaceSlug: string, intakeId: string, fieldId: string): Promise<void> {
    return this.delete(`/api/workspaces/${workspaceSlug}/intakes/${intakeId}/form-fields/${fieldId}/`)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async reorderFields(
    workspaceSlug: string,
    intakeId: string,
    fields: { id: string; relative_order: number }[]
  ): Promise<TIntakeFormField[]> {
    return this.post(`/api/workspaces/${workspaceSlug}/intakes/${intakeId}/form-fields/reorder/`, { fields })
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async createFieldOption(
    workspaceSlug: string,
    intakeId: string,
    fieldId: string,
    data: TIntakeFormFieldOptionPayload
  ): Promise<TIntakeFormFieldOption> {
    return this.post(`/api/workspaces/${workspaceSlug}/intakes/${intakeId}/form-fields/${fieldId}/options/`, data)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async updateFieldOption(
    workspaceSlug: string,
    intakeId: string,
    fieldId: string,
    optionId: string,
    data: Partial<TIntakeFormFieldOptionPayload>
  ): Promise<TIntakeFormFieldOption> {
    return this.patch(
      `/api/workspaces/${workspaceSlug}/intakes/${intakeId}/form-fields/${fieldId}/options/${optionId}/`,
      data
    )
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async deleteFieldOption(workspaceSlug: string, intakeId: string, fieldId: string, optionId: string): Promise<void> {
    return this.delete(
      `/api/workspaces/${workspaceSlug}/intakes/${intakeId}/form-fields/${fieldId}/options/${optionId}/`
    )
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async listIssues(
    workspaceSlug: string,
    params: Record<string, string | number | undefined> = {}
  ): Promise<TWorkspaceIntakeIssueListResponse> {
    return this.get(`/api/workspaces/${workspaceSlug}/workspace-intake-issues/`, { params })
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async createIssue(workspaceSlug: string, data: TWorkspaceIntakeIssuePayload): Promise<TWorkspaceIntakeIssue> {
    return this.post(`/api/workspaces/${workspaceSlug}/workspace-intake-issues/`, data)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async updateIssue(
    workspaceSlug: string,
    issueId: string,
    data: Partial<TWorkspaceIntakeIssuePayload>
  ): Promise<TWorkspaceIntakeIssue> {
    return this.patch(`/api/workspaces/${workspaceSlug}/workspace-intake-issues/${issueId}/`, data)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async acceptIssue(
    workspaceSlug: string,
    issueId: string,
    data: TWorkspaceIntakeIssueAcceptPayload
  ): Promise<TWorkspaceIntakeIssue> {
    return this.post(`/api/workspaces/${workspaceSlug}/workspace-intake-issues/${issueId}/accept/`, data)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async rejectIssue(
    workspaceSlug: string,
    issueId: string,
    data: TWorkspaceIntakeIssueRejectPayload
  ): Promise<TWorkspaceIntakeIssue> {
    return this.post(`/api/workspaces/${workspaceSlug}/workspace-intake-issues/${issueId}/reject/`, data)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async snoozeIssue(
    workspaceSlug: string,
    issueId: string,
    data: TWorkspaceIntakeIssueSnoozePayload
  ): Promise<TWorkspaceIntakeIssue> {
    return this.post(`/api/workspaces/${workspaceSlug}/workspace-intake-issues/${issueId}/snooze/`, data)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async duplicateIssue(
    workspaceSlug: string,
    issueId: string,
    data: TWorkspaceIntakeIssueDuplicatePayload
  ): Promise<TWorkspaceIntakeIssue> {
    return this.post(`/api/workspaces/${workspaceSlug}/workspace-intake-issues/${issueId}/duplicate/`, data)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }
}
