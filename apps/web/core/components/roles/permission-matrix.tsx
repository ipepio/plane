/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useTranslation } from "@plane/i18n";
import type { TPermission } from "@plane/types";

type Props = {
  permissions: TPermission[];
  selected: Set<string>;
  readOnly?: boolean;
  onChange: (codes: Set<string>) => void;
};

function groupByCategory(permissions: TPermission[]): Record<string, TPermission[]> {
  return permissions.reduce<Record<string, TPermission[]>>((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {});
}

export function PermissionMatrix({ permissions, selected, readOnly = false, onChange }: Props) {
  const { t } = useTranslation();
  const [openCategories, setOpenCategories] = useState<Set<string>>(() => {
    try {
      const stored = sessionStorage.getItem("role-editor-open-categories");
      return stored ? new Set(JSON.parse(stored)) : new Set(Object.keys(groupByCategory(permissions)));
    } catch {
      return new Set(Object.keys(groupByCategory(permissions)));
    }
  });

  const grouped = groupByCategory(permissions);

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      try {
        sessionStorage.setItem("role-editor-open-categories", JSON.stringify(Array.from(next)));
      } catch {}
      return next;
    });
  };

  const togglePermission = (code: string) => {
    const next = new Set(selected);
    if (next.has(code)) next.delete(code);
    else next.add(code);
    onChange(next);
  };

  const selectAll = (codes: string[]) => {
    const next = new Set(selected);
    codes.forEach((c) => next.add(c));
    onChange(next);
  };

  const deselectAll = (codes: string[]) => {
    const next = new Set(selected);
    codes.forEach((c) => next.delete(c));
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-2">
      {Object.entries(grouped).map(([category, perms]) => {
        const isOpen = openCategories.has(category);
        const codes = perms.map((p) => p.code);
        const allSelected = codes.every((c) => selected.has(c));

        return (
          <div key={category} className="rounded-md border border-subtle">
            <button
              type="button"
              className="flex w-full items-center justify-between px-4 py-3 text-left"
              onClick={() => toggleCategory(category)}
            >
              <span className="text-body-sm-medium capitalize">
                {t(`roles.category.${category}`, { defaultValue: category })}
              </span>
              <div className="flex items-center gap-2">
                {!readOnly && isOpen && (
                  <button
                    type="button"
                    className="text-custom-primary text-caption-xs-medium underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      allSelected ? deselectAll(codes) : selectAll(codes);
                    }}
                  >
                    {allSelected ? t("roles.matrix.deselect_all") : t("roles.matrix.select_all")}
                  </button>
                )}
                {isOpen ? (
                  <ChevronDown className="h-4 w-4 text-secondary" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-secondary" />
                )}
              </div>
            </button>
            {isOpen && (
              <div className="divide-y divide-subtle border-t border-subtle">
                {perms.map((perm) => (
                  <label key={perm.code} className="flex cursor-pointer items-start gap-3 px-4 py-2.5">
                    <input
                      type="checkbox"
                      className="accent-custom-primary mt-0.5 h-4 w-4 shrink-0"
                      checked={selected.has(perm.code)}
                      disabled={readOnly}
                      onChange={() => togglePermission(perm.code)}
                    />
                    <div>
                      <div className="text-body-xs-medium">{perm.name}</div>
                      {perm.description && (
                        <div className="text-caption-xs-regular text-tertiary">{perm.description}</div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
