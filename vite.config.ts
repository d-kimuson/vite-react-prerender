import { defineConfig } from "vite"
import pluginReact from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [tsconfigPaths(), pluginReact()],
})
