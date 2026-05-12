import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: (process.env.NITRO_PRESET === 'vercel' || process.env.VERCEL === '1' || process.env.NITRO_PRESET === 'vercel-edge') ? undefined : { entry: "server" },
    // @ts-ignore
    nitro: {
      preset: process.env.NITRO_PRESET || (process.env.VERCEL === '1' ? 'vercel' : undefined)
    }
  },
  // Disable Cloudflare plugin if we're building for Vercel
  cloudflare: (process.env.NITRO_PRESET === 'vercel' || process.env.VERCEL === '1' || process.env.NITRO_PRESET === 'vercel-edge') ? false : undefined,
});
