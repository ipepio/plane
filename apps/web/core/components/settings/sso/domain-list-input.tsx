/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

"use client";

import { X } from "lucide-react";
import { Button, Input } from "@plane/ui";

const DOMAIN_RE = /^(?!-)[a-z0-9-]+(\.[a-z0-9-]+)+$/;

export const normalizeDomain = (domain: string) => domain.trim().toLowerCase().replace(/^@/, "");

export const isValidDomain = (domain: string) => DOMAIN_RE.test(normalizeDomain(domain));

type Props = {
  domains: string[];
  error?: string;
  onChange: (domains: string[]) => void;
  placeholder: string;
  addLabel: string;
};

export function DomainListInput(props: Props) {
  const { domains, error, onChange, placeholder, addLabel } = props;

  const addDomain = (rawDomain: string) => {
    const domain = normalizeDomain(rawDomain);
    if (!domain || !isValidDomain(domain) || domains.includes(domain)) return;
    onChange([...domains, domain]);
  };

  const removeDomain = (domain: string) => {
    onChange(domains.filter((item) => item !== domain));
  };

  return (
    <div className="flex flex-col gap-2">
      <form
        className="flex items-center gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          const form = event.currentTarget;
          const input = form.elements.namedItem("domain") as HTMLInputElement;
          addDomain(input.value);
          input.value = "";
        }}
      >
        <Input
          name="domain"
          className="w-full"
          placeholder={placeholder}
          onKeyDown={(event) => {
            if (event.key === "," || event.key === "Enter") {
              event.preventDefault();
              addDomain(event.currentTarget.value);
              event.currentTarget.value = "";
            }
          }}
        />
        <Button variant="neutral-primary" size="sm" type="submit">
          {addLabel}
        </Button>
      </form>
      {domains.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {domains.map((domain) => (
            <span
              key={domain}
              className="inline-flex max-w-full items-center gap-1 rounded border border-subtle bg-layer-2 px-2 py-1 text-caption-md-medium text-primary"
            >
              <span className="truncate">{domain}</span>
              <button
                type="button"
                className="grid size-4 shrink-0 place-items-center rounded hover:bg-layer-transparent-hover"
                onClick={() => removeDomain(domain)}
                aria-label={`Remove ${domain}`}
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}
      {error && <p className="text-caption-md-regular text-danger-primary">{error}</p>}
    </div>
  );
}
