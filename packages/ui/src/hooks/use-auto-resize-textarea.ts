/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { useLayoutEffect } from "react";

export const useAutoResizeTextArea = (
  textAreaRef: React.RefObject<HTMLTextAreaElement>,
  value: string | number | readonly string[]
) => {
  useLayoutEffect(() => {
    const textArea = textAreaRef.current;
    if (!textArea) return;

    // Compute the minimum height from the rows attribute so it's respected
    // even when the value is empty.
    const rows = parseInt(textArea.getAttribute("rows") ?? "1", 10);
    const lineHeight = parseFloat(getComputedStyle(textArea).lineHeight) || 20;
    const paddingTop = parseFloat(getComputedStyle(textArea).paddingTop) || 0;
    const paddingBottom = parseFloat(getComputedStyle(textArea).paddingBottom) || 0;
    const minHeight = rows * lineHeight + paddingTop + paddingBottom;

    // Reset height to measure scrollHeight, then apply whichever is larger
    textArea.style.height = "0px";
    const scrollHeight = textArea.scrollHeight;
    textArea.style.height = Math.max(scrollHeight, minHeight) + "px";
  }, [textAreaRef, value]);
};
