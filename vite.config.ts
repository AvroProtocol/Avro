// @lovable.dev/vite-tanstack-config already provides TanStack Start, React,
// Tailwind, tsconfig paths, Nitro, VITE_* injection, and local sandbox defaults.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const isVercel = Boolean(process.env.VERCEL);

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  nitro: isVercel ? { preset: "vercel" } : true,
});
