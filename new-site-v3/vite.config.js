import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { resolve } from "node:path"

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        home: resolve(process.cwd(), "index.html"),
        products: resolve(process.cwd(), "products/index.html"),
        guardian: resolve(process.cwd(), "products/guardian/index.html"),
        guardianDocs: resolve(process.cwd(), "products/guardian/docs/index.html"),
        guardianFaq: resolve(process.cwd(), "products/guardian/faq/index.html"),
        suggestions: resolve(process.cwd(), "suggestions/index.html"),
      },
    },
  },
})
