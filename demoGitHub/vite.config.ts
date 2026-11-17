import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

const pathFromHere = (path: string) => fileURLToPath(new URL(path, import.meta.url));
const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];
export default defineConfig({
  base: repoName ? `/${repoName}/` : "/",
  plugins: [tailwindcss(), tanstackRouter({ target: "react", autoCodeSplitting: true }), react()],
  resolve: {
    alias: [
      { find: /^@wayco\/shared\/database$/, replacement: pathFromHere("../packages/shared/src/database/types.ts") },
      {
  find: /^@wayco\/shared\/pricing-engine$/,
  replacement: pathFromHere("../packages/shared/src/pricing_engine/index.ts"),
},
{
  find: /^@wayco\/shared\/([\w-]+)$/,
  replacement: pathFromHere("../packages/shared/src/") + "$1/index.ts",
},
      { find: /^@wayco\/shared$/, replacement: pathFromHere("../packages/shared/src/index.ts") },
      { find: "@error", replacement: pathFromHere("./src/errors") },
      { find: "@", replacement: pathFromHere("./src") },
    ],
  },
  server: { port: 5174, strictPort: true },
});
