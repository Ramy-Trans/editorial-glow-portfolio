import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  nitro: { preset: process.env.NITRO_PRESET ?? "netlify" },
  tanstackStart: { server: { entry: "src/server.ts" } },
  vite: {
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
  },
});
