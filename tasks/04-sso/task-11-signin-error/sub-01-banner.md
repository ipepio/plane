# Sub-01 — Banner component

**Task:** 11 · **Tamaño:** S

## Cambio

```tsx
"use client";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "@plane/i18n";

export const SignInErrorBanner: FC = () => {
  const params = useSearchParams();
  const { t } = useTranslation();
  const error = params.get("error");
  const ws = params.get("ws");

  if (error !== "sso_blocked") return null;

  return (
    <div role="alert" className="rounded border border-red-500 bg-red-50 p-3 text-sm text-red-700">
      {ws
        ? t("sso.blocked_with_ws", { workspace: ws })
        : t("sso.blocked_generic")}
    </div>
  );
};
```

## Aceptación

- [ ] Banner solo aparece con `error=sso_blocked`.
- [ ] Texto cambia según `ws` presente.
