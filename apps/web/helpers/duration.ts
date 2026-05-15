/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

export const parseDurationToSeconds = (value: string): number | null => {
  const normalized = value.trim().toLowerCase().replace(/\s+/g, "");
  if (!normalized) return null;

  const colonMatch = normalized.match(/^(\d+):([0-5]?\d)$/);
  if (colonMatch) {
    const hours = Number(colonMatch[1]);
    const minutes = Number(colonMatch[2]);
    return hours * 3600 + minutes * 60;
  }

  if (/^\d+$/.test(normalized)) return Number(normalized) * 60;

  const tokenPattern = /(\d+(?:\.\d+)?)(h|m|s)/g;
  let total = 0;
  let consumed = "";
  for (const match of normalized.matchAll(tokenPattern)) {
    const amount = Number(match[1]);
    const unit = match[2];
    consumed += match[0];
    if (unit === "h") total += amount * 3600;
    if (unit === "m") total += amount * 60;
    if (unit === "s") total += amount;
  }

  if (consumed === normalized && total > 0) return Math.round(total);
  return null;
};

export const formatDuration = (seconds: number): string => {
  if (!seconds) return "0m";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const parts = [];
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  if (remainingSeconds && !hours) parts.push(`${remainingSeconds}s`);
  return parts.join(" ") || "0m";
};
