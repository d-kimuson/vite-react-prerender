import { readFileSync } from "fs"
import { resolve, dirname } from "path"
import express from "express"
import vite from "vite"

import type { ServerRender } from "~/server/entry-server"

const __dirname = dirname(new URL(import.meta.url).pathname)
const projectDir = resolve(__dirname, "../..")

const toAbsolute = (p: string) => resolve(projectDir, p)

export async function createServer(
  root = projectDir,
  logLevel: "error" | "info" = "info"
) {
  const app = express()

  const viteServer = await vite.createServer({
    root,
    logLevel,
    server: {
      middlewareMode: "ssr",
      watch: {
        usePolling: true,
        interval: 100,
      },
    },
  })
  app.use(viteServer.middlewares)

  app.use("*", async (req, res) => {
    try {
      const url = req.originalUrl

      const rowTemplate = readFileSync(toAbsolute("index.html"), "utf-8")
      const template = await viteServer.transformIndexHtml(url, rowTemplate)

      const { render } = (await viteServer.ssrLoadModule(
        toAbsolute("./src/server/entry-server.tsx")
      )) as { render: ServerRender }

      const context: Record<string, string> = {}
      const [appHtml, preloadLinks] = render(url, context)
      if (context.url) {
        return res.redirect(301, context.url)
      }

      const html = template
        .replace(`<!--preload-links-->`, preloadLinks)
        .replace(`<!--app-html-->`, appHtml)

      res.status(200).set({ "Content-Type": "text/html" }).end(html)
    } catch (e) {
      const typedError = e as Error
      vite && viteServer.ssrFixStacktrace(typedError)
      console.log(typedError.stack)
      res.status(500).end(typedError.stack)
    }
  })

  return { app, viteServer }
}
