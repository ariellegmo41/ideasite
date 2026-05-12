import { defineConfig } from "@tanstack/react-start/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    preset: "vercel",
    entry: "./src/server.ts",
  },
  vite: {
    plugins: [
      tsconfigPaths({
        projects: ["./tsconfig.json"],
      }),
    ],
  },
});
