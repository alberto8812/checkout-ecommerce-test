import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// NOTE: babel-plugin-react-compiler removed — incompatible with Radix UI (shadcn components)
// It breaks Radix's internal class constructors at runtime (TypeError: Illegal constructor)
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov", "html"],
      exclude: [
        "node_modules/",
        "src/test/",
        "src/main.tsx",
        "**/*.d.ts",
        "**/*.config.*",
        "**/index.ts",
      ],
    },
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
