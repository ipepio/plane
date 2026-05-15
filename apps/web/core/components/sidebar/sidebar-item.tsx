/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import React from "react";
import Link from "next/link";
import { cn } from "@plane/utils";

// ============================================================================
// TYPES
// ============================================================================

interface AppSidebarItemData {
  href?: string;
  label?: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  showLabel?: boolean;
}

interface AppSidebarItemProps {
  variant?: "link" | "button";
  item?: AppSidebarItemData;
}

interface AppSidebarItemLabelProps {
  highlight?: boolean;
  label?: string;
}

interface AppSidebarItemIconProps {
  icon?: React.ReactNode;
  highlight?: boolean;
}

interface AppSidebarLinkItemProps {
  href?: string;
  children: React.ReactNode;
  className?: string;
}

interface AppSidebarButtonItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

// ============================================================================
// STYLES
// ============================================================================

const styles = {
  base: "group flex flex-col gap-0.5 items-center justify-center text-tertiary",
  icon: "flex items-center justify-center gap-2 size-8 rounded-md text-tertiary",
  iconActive: "bg-layer-transparent-selected text-secondary !text-icon-primary",
  iconInactive: "group-hover:text-icon-secondary group-hover:bg-layer-transparent-hover !text-icon-tertiary",
  label: "text-11 font-medium",
  labelActive: "text-secondary",
  labelInactive: "group-hover:text-secondary text-tertiary",
} as const;

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function AppSidebarItemLabel({ highlight = false, label }: AppSidebarItemLabelProps) {
  if (!label) return null;

  return (
    <span
      className={cn(styles.label, {
        [styles.labelActive]: highlight,
        [styles.labelInactive]: !highlight,
      })}
    >
      {label}
    </span>
  );
}

function AppSidebarItemIcon({ icon, highlight }: AppSidebarItemIconProps) {
  if (!icon) return null;

  return (
    <div
      className={cn(styles.icon, {
        [styles.iconActive]: highlight,
        [styles.iconInactive]: !highlight,
      })}
    >
      {icon}
    </div>
  );
}

const AppSidebarLinkItem = React.forwardRef<HTMLAnchorElement, AppSidebarLinkItemProps>(function AppSidebarLinkItem(
  { href, children, className },
  ref
) {
  if (!href) return null;

  return (
    <Link ref={ref} href={href} className={cn(styles.base, className)}>
      {children}
    </Link>
  );
});

const AppSidebarButtonItem = React.forwardRef<HTMLDivElement, AppSidebarButtonItemProps>(function AppSidebarButtonItem(
  { children, onClick, disabled = false, className },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(styles.base, className, {
        "pointer-events-none opacity-50": disabled,
      })}
      onClick={disabled ? undefined : onClick}
      aria-disabled={disabled}
    >
      {children}
    </div>
  );
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export type AppSidebarItemComponent = React.ForwardRefExoticComponent<
  AppSidebarItemProps & React.RefAttributes<HTMLAnchorElement | HTMLDivElement>
> & {
  Label: React.FC<AppSidebarItemLabelProps>;
  Icon: React.FC<AppSidebarItemIconProps>;
  Link: typeof AppSidebarLinkItem;
  Button: typeof AppSidebarButtonItem;
};

const AppSidebarItem = React.forwardRef<HTMLAnchorElement | HTMLDivElement, AppSidebarItemProps>(
  function AppSidebarItem({ variant = "link", item }, ref) {
  if (!item) return null;

  const { icon, isActive, label, href, onClick, disabled, showLabel = true } = item;

  const commonItems = (
    <>
      <AppSidebarItemIcon icon={icon} highlight={isActive} />
      {showLabel && <AppSidebarItemLabel highlight={isActive} label={label} />}
    </>
  );

  if (variant === "link") {
    return (
      <AppSidebarLinkItem ref={ref as React.Ref<HTMLAnchorElement>} href={href}>
        {commonItems}
      </AppSidebarLinkItem>
    );
  }

  return (
    <AppSidebarButtonItem ref={ref as React.Ref<HTMLDivElement>} onClick={onClick} disabled={disabled}>
      {commonItems}
    </AppSidebarButtonItem>
  );
}) as AppSidebarItemComponent;

// ============================================================================
// COMPOUND COMPONENT ASSIGNMENT
// ============================================================================

AppSidebarItem.Label = AppSidebarItemLabel;
AppSidebarItem.Icon = AppSidebarItemIcon;
AppSidebarItem.Link = AppSidebarLinkItem;
AppSidebarItem.Button = AppSidebarButtonItem;

export { AppSidebarItem };
export type { AppSidebarItemData, AppSidebarItemProps };
