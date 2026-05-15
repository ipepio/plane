/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { useEffect, useState } from "react";
import type { TIssueProperty, TIssuePropertyPrimitiveValue, TIssuePropertyValue } from "@plane/types";

type Props = {
  property: TIssueProperty;
  value?: TIssuePropertyValue;
  disabled: boolean;
  onChange: (propertyId: string, value: TIssuePropertyPrimitiveValue) => Promise<void>;
};

const inputClassName =
  "h-7.5 w-full rounded border border-transparent bg-transparent px-2 text-body-xs-regular outline-none hover:border-subtle focus:border-custom-primary-100";

const getInitialValue = (property: TIssueProperty, value?: TIssuePropertyValue) => {
  if (value?.value === undefined || value?.value === null) return property.type === "multi_select" ? [] : "";
  if (property.type === "date" && typeof value.value === "string") return value.value.slice(0, 10);
  return value.value;
};

export function CustomPropertyField(props: Props) {
  const { property, value, disabled, onChange } = props;
  const [localValue, setLocalValue] = useState<TIssuePropertyPrimitiveValue>(() => getInitialValue(property, value));

  useEffect(() => {
    setLocalValue(getInitialValue(property, value));
  }, [property, value]);

  const commit = async (nextValue: TIssuePropertyPrimitiveValue = localValue) => {
    await onChange(property.id, nextValue);
  };

  if (property.type === "long_text") {
    return (
      <textarea
        className="focus:border-custom-primary-100 min-h-16 w-full resize-none rounded border border-subtle bg-transparent px-2 py-1.5 text-body-xs-regular outline-none"
        value={String(localValue ?? "")}
        disabled={disabled}
        placeholder="Empty"
        onChange={(event) => setLocalValue(event.target.value)}
        onBlur={() => commit()}
      />
    );
  }

  if (property.type === "boolean") {
    return (
      <label className="flex h-7.5 items-center gap-2 px-2 text-body-xs-regular text-secondary">
        <input
          type="checkbox"
          className="size-4 rounded border-subtle"
          checked={Boolean(localValue)}
          disabled={disabled}
          onChange={(event) => {
            setLocalValue(event.target.checked);
            commit(event.target.checked);
          }}
        />
        {localValue ? "Yes" : "No"}
      </label>
    );
  }

  if (property.type === "select") {
    return (
      <select
        className={inputClassName}
        value={String(localValue ?? "")}
        disabled={disabled}
        onChange={(event) => {
          setLocalValue(event.target.value);
          commit(event.target.value || null);
        }}
      >
        <option value="">Empty</option>
        {property.options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    );
  }

  if (property.type === "multi_select") {
    const selectedValues = Array.isArray(localValue) ? localValue : [];
    return (
      <div className="flex flex-wrap gap-1 px-2 py-1">
        {property.options.map((option) => {
          const selected = selectedValues.includes(option.id);
          return (
            <button
              key={option.id}
              type="button"
              disabled={disabled}
              className={`text-xs rounded border px-2 py-0.5 ${
                selected
                  ? "border-custom-primary-100 bg-custom-primary-100/10 text-custom-primary-100"
                  : "border-subtle text-secondary"
              }`}
              onClick={() => {
                const nextValue = selected
                  ? selectedValues.filter((id) => id !== option.id)
                  : [...selectedValues, option.id];
                setLocalValue(nextValue);
                commit(nextValue);
              }}
            >
              {option.name}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <input
      className={inputClassName}
      type={property.type === "number" ? "number" : property.type === "date" ? "date" : "text"}
      value={String(localValue ?? "")}
      disabled={disabled}
      placeholder={property.type === "user" ? "User ID" : "Empty"}
      onChange={(event) => setLocalValue(event.target.value)}
      onBlur={() => commit()}
    />
  );
}
