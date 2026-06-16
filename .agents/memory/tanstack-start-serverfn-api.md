---
name: TanStack Start createServerFn API quirks
description: Correct API for createServerFn in this project (v1.167.x) and path restrictions.
---

## Rule 1: `.inputValidator()` not `.validator()`
The runtime method to attach an input validator is `.inputValidator()`:
```ts
const myFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => d as MyType)
  .handler(async ({ data }) => { ... })
```
`.validator()` does not exist on the returned object and will throw at runtime.

**Why:** TanStack Start 1.167.x uses `inputValidator` as the internal chain key. The docs/examples using `.validator()` are for a different version.

**How to apply:** Every `createServerFn` call that needs typed input must use `.inputValidator()`.

## Rule 2: Never put server functions in `src/server/`
Vite's import-protection plugin blocks `**/server/**` paths from being imported in client code. Even `createServerFn` files (which are isomorphic) trigger the error.

**Why:** TanStack Start configures Vite with a client-only guard on the `server/` directory pattern.

**How to apply:** Place server functions in `src/lib/` (e.g. `src/lib/booking-fns.ts`), never in `src/server/`.
