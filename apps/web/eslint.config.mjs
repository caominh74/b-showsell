import Module from "node:module";
import { existsSync } from "node:fs";
import { delimiter, join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, globalIgnores } from "eslint/config";

const localNodeModules = fileURLToPath(new URL("./node_modules", import.meta.url));
process.env.NODE_PATH = [localNodeModules, process.env.NODE_PATH].filter(Boolean).join(delimiter);
Module._initPaths();

const resolveFilename = Module._resolveFilename;
Module._resolveFilename = function resolveFromWebApp(request, parent, isMain, options) {
  if (typeof request === "string" && request.startsWith("next/")) {
    const localNextPath = join(localNodeModules, `${request}.js`);
    if (existsSync(localNextPath)) {
      return localNextPath;
    }
  }

  return resolveFilename.call(this, request, parent, isMain, options);
};

const nextVitals = (await import("eslint-config-next/core-web-vitals")).default;
const nextTs = (await import("eslint-config-next/typescript")).default;

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
