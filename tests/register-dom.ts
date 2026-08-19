/**
 * Registers happy-dom globals.
 *
 * This MUST live in its own module and be imported first by `setup.tsx`.
 * ESM hoists every `import` above the statements around it, so calling
 * `GlobalRegistrator.register()` alongside the other imports would run it
 * *after* `@testing-library/dom` was evaluated. That library binds its
 * `screen` object to `document.body` at module load time and falls back to
 * throwing stubs when no document exists yet — which silently breaks every
 * `screen.*` query for the whole suite.
 */
import { GlobalRegistrator } from "@happy-dom/global-registrator";

if (!GlobalRegistrator.isRegistered) {
  // A concrete URL is required so relative asset paths (e.g. next/image with
  // src="/logo-square.png") resolve instead of throwing "Invalid URL".
  GlobalRegistrator.register({ url: "http://localhost:3000/" });
}
