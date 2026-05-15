# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

import re

PLACEHOLDER_PATTERN = re.compile(r"\{\{\s*([a-zA-Z0-9_]+)\s*\}\}")


def apply_vars(value, variables):
    if isinstance(value, str):
        return PLACEHOLDER_PATTERN.sub(lambda match: str(variables.get(match.group(1), match.group(0))), value)

    if isinstance(value, list):
        return [apply_vars(item, variables) for item in value]

    if isinstance(value, dict):
        return {key: apply_vars(item, variables) for key, item in value.items()}

    return value


def extract_placeholders(value):
    placeholders = set()

    def visit(item):
        if isinstance(item, str):
            placeholders.update(match.group(1) for match in PLACEHOLDER_PATTERN.finditer(item))
            return

        if isinstance(item, list):
            for child in item:
                visit(child)
            return

        if isinstance(item, dict):
            for child in item.values():
                visit(child)

    visit(value)
    return sorted(placeholders)
