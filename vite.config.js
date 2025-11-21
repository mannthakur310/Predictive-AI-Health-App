import path from "path"
import { fileURLToPath } from "url"
import { writeFileSync, mkdirSync } from "fs"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "create-redirects",
      closeBundle() {
        try {
          mkdirSync("dist", { recursive: true })
          writeFileSync("dist/_redirects", "/*    /index.html   200")
          console.log("✅ _redirects file created in dist/")
        } catch (error) {
          console.error("❌ Error creating _redirects:", error)
        }
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5157,
  },
})