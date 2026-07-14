---
name: TanStack Start form silently blocked by native select validation
description: A required <select> with a disabled placeholder option can block form submission with zero network calls and zero console errors, before React's onSubmit ever runs.
---

When a form's `onSubmit` calls `e.preventDefault()` then hits a bare `try/catch`, and a native `required` field (e.g. a `<select>` stuck on its disabled placeholder option) is left unfilled, the browser's HTML5 constraint validation blocks the submit event entirely — React's `onSubmit` never fires, so there's no network request and no console output, even though the click handler on the button does fire.

**Why:** verified via a real headless-Chromium click-through (playwright-core against the built-in nix chromium cache, since no browser-automation tool is otherwise available) — filling every field except the select left `requests: []` and zero console logs, matching a user report of "clicking submit does nothing, no POST, no JS errors" almost exactly. A bare `catch {}` (no logged error) compounds this class of bug by hiding the true cause on any later failure too.

**How to apply:** when a form submit is reported as silently doing nothing, suspect a native-required field before suspecting the JS/server path. Fix by adding `noValidate` to the `<form>` and doing manual validation in `onSubmit` with a clear, visible, user-facing message — this guarantees the handler always runs and the failure is never invisible. Also always log the actual error in catch blocks (`console.error(err)`) instead of swallowing it bare, so the next real failure is diagnosable from logs alone.
