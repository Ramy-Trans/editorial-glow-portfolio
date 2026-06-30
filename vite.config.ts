import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Auto-detect Cloudflare Pages build environment
if (process.env.CF_PAGES) {
  process.env.NITRO_PRESET = "cloudflare-pages";
} else {
  process.env.NITRO_PRESET ??= "node";
}

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
  },
});
