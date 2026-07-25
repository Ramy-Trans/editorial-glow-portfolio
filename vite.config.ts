import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "node:path";

// Auto-detect Cloudflare Pages build environment
const isCFBuild = !!process.env.CF_PAGES;
if (isCFBuild) {
  process.env.NITRO_PRESET = "cloudflare-pages";
} else {
  process.env.NITRO_PRESET ??= "node";
}

const API_PORT = process.env.API_PORT ?? "3001";

export default defineConfig({
  plugins: [
    tailwindcss(),
    tsconfigPaths(),
    ...tanstackStart({
      server: {
        entry: "src/server.ts",
      },
    }),
    react(),
  ],
  resolve: {
    alias: {
      // On Cloudflare Pages builds, swap the pg-based DB implementation for the
      // Supabase HTTP client — same interface, edge-compatible transport.
      // On Node.js / Replit deployments, no alias: pg is used directly.
      ...(isCFBuild
        ? {
            "@/lib/db-impl.server": path.resolve(
              "./src/lib/db-impl.supabase.server.ts"
            ),
          }
        : {}),
      "@": `${process.cwd()}/src`,
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5000,
    strictPort: true,
    allowedHosts: true,
    watch: {
      ignored: ["**/.local/**", "**/node_modules/**"],
    },
    // Proxy /api/* to the Express API server so browser fetches also work
    proxy: {
      "/api": {
        target: `http://localhost:${API_PORT}`,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
