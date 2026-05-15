/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { action, makeObservable, observable, runInAction } from "mobx";
import { IssuePropertyService } from "@plane/services";
import type {
  TIssueProperty,
  TIssuePropertyOption,
  TIssuePropertyOptionPayload,
  TIssuePropertyPayload,
  TProjectIssueType,
} from "@plane/types";

export interface IIssuePropertyStore {
  issueTypesByProject: Map<string, TProjectIssueType[]>;
  propertiesByIssueType: Map<string, TIssueProperty[]>;
  loader: boolean;
  fetchIssueTypes: (workspaceSlug: string, projectId: string) => Promise<TProjectIssueType[]>;
  fetchProperties: (workspaceSlug: string, projectId: string, issueTypeId: string) => Promise<TIssueProperty[]>;
  createProperty: (
    workspaceSlug: string,
    projectId: string,
    issueTypeId: string,
    data: TIssuePropertyPayload
  ) => Promise<TIssueProperty>;
  updateProperty: (
    workspaceSlug: string,
    projectId: string,
    issueTypeId: string,
    propertyId: string,
    data: Partial<TIssuePropertyPayload>
  ) => Promise<TIssueProperty>;
  deleteProperty: (workspaceSlug: string, projectId: string, issueTypeId: string, propertyId: string) => Promise<void>;
  createOption: (
    workspaceSlug: string,
    projectId: string,
    issueTypeId: string,
    propertyId: string,
    data: TIssuePropertyOptionPayload
  ) => Promise<TIssuePropertyOption>;
  updateOption: (
    workspaceSlug: string,
    projectId: string,
    issueTypeId: string,
    propertyId: string,
    optionId: string,
    data: Partial<TIssuePropertyOptionPayload>
  ) => Promise<TIssuePropertyOption>;
  deleteOption: (
    workspaceSlug: string,
    projectId: string,
    issueTypeId: string,
    propertyId: string,
    optionId: string
  ) => Promise<void>;
}

export class IssuePropertyStore implements IIssuePropertyStore {
  issueTypesByProject: Map<string, TProjectIssueType[]> = new Map();
  propertiesByIssueType: Map<string, TIssueProperty[]> = new Map();
  loader = false;

  private service: IssuePropertyService;

  constructor() {
    makeObservable(this, {
      issueTypesByProject: observable,
      propertiesByIssueType: observable,
      loader: observable,
      fetchIssueTypes: action,
      fetchProperties: action,
      createProperty: action,
      updateProperty: action,
      deleteProperty: action,
      createOption: action,
      updateOption: action,
      deleteOption: action,
    });
    this.service = new IssuePropertyService();
  }

  async fetchIssueTypes(workspaceSlug: string, projectId: string) {
    const issueTypes = await this.service.listIssueTypes(workspaceSlug, projectId);
    runInAction(() => {
      this.issueTypesByProject.set(projectId, issueTypes);
    });
    return issueTypes;
  }

  async fetchProperties(workspaceSlug: string, projectId: string, issueTypeId: string) {
    runInAction(() => {
      this.loader = true;
    });
    try {
      const properties = await this.service.listProperties(workspaceSlug, projectId, issueTypeId);
      runInAction(() => {
        this.propertiesByIssueType.set(issueTypeId, properties);
      });
      return properties;
    } finally {
      runInAction(() => {
        this.loader = false;
      });
    }
  }

  async createProperty(workspaceSlug: string, projectId: string, issueTypeId: string, data: TIssuePropertyPayload) {
    const property = await this.service.createProperty(workspaceSlug, projectId, issueTypeId, data);
    runInAction(() => {
      this.propertiesByIssueType.set(issueTypeId, [...(this.propertiesByIssueType.get(issueTypeId) ?? []), property]);
    });
    return property;
  }

  async updateProperty(
    workspaceSlug: string,
    projectId: string,
    issueTypeId: string,
    propertyId: string,
    data: Partial<TIssuePropertyPayload>
  ) {
    const property = await this.service.updateProperty(workspaceSlug, projectId, issueTypeId, propertyId, data);
    runInAction(() => {
      this.propertiesByIssueType.set(
        issueTypeId,
        (this.propertiesByIssueType.get(issueTypeId) ?? []).map((item) => (item.id === propertyId ? property : item))
      );
    });
    return property;
  }

  async deleteProperty(workspaceSlug: string, projectId: string, issueTypeId: string, propertyId: string) {
    await this.service.deleteProperty(workspaceSlug, projectId, issueTypeId, propertyId);
    runInAction(() => {
      this.propertiesByIssueType.set(
        issueTypeId,
        (this.propertiesByIssueType.get(issueTypeId) ?? []).filter((item) => item.id !== propertyId)
      );
    });
  }

  async createOption(
    workspaceSlug: string,
    projectId: string,
    issueTypeId: string,
    propertyId: string,
    data: TIssuePropertyOptionPayload
  ) {
    const option = await this.service.createOption(workspaceSlug, projectId, issueTypeId, propertyId, data);
    this.patchPropertyOptions(issueTypeId, propertyId, (options) => [...options, option]);
    return option;
  }

  async updateOption(
    workspaceSlug: string,
    projectId: string,
    issueTypeId: string,
    propertyId: string,
    optionId: string,
    data: Partial<TIssuePropertyOptionPayload>
  ) {
    const option = await this.service.updateOption(workspaceSlug, projectId, issueTypeId, propertyId, optionId, data);
    this.patchPropertyOptions(issueTypeId, propertyId, (options) =>
      options.map((item) => (item.id === optionId ? option : item))
    );
    return option;
  }

  async deleteOption(
    workspaceSlug: string,
    projectId: string,
    issueTypeId: string,
    propertyId: string,
    optionId: string
  ) {
    await this.service.deleteOption(workspaceSlug, projectId, issueTypeId, propertyId, optionId);
    this.patchPropertyOptions(issueTypeId, propertyId, (options) => options.filter((item) => item.id !== optionId));
  }

  private patchPropertyOptions(
    issueTypeId: string,
    propertyId: string,
    updater: (options: TIssuePropertyOption[]) => TIssuePropertyOption[]
  ) {
    runInAction(() => {
      this.propertiesByIssueType.set(
        issueTypeId,
        (this.propertiesByIssueType.get(issueTypeId) ?? []).map((property) =>
          property.id === propertyId ? Object.assign({}, property, { options: updater(property.options) }) : property
        )
      );
    });
  }
}
