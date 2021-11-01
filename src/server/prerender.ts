import {
  readFileSync,
  readdirSync,
  writeFileSync,
  unlinkSync,
  mkdirSync,
} from "fs"
import { resolve, dirname } from "path"
import { createServer } from "./create-server"
import type { ServerRender } from "~/server/entry-server"

const __dirname = dirname(new URL(import.meta.url).pathname)
const rootDir = resolve(__dirname, "../../")

const toAbsolute = (p: string) => resolve(rootDir, p)

const template = readFileSync(toAbsolute("dist/static/index.html"), "utf-8")
const manifest = JSON.parse(
  readFileSync(toAbsolute("dist/static/ssr-manifest.json"), "utf-8")
)

const searchFileNamesRecursively = (
  path: string,
  baseName: string | undefined = undefined
): string[] => {
  return readdirSync(path, { withFileTypes: true }).flatMap((fileOrDir) => {
    const fullPath = baseName ? `${baseName}/${fileOrDir.name}` : fileOrDir.name

    return fileOrDir.isFile()
      ? fullPath
      : searchFileNamesRecursively(resolve(path, fileOrDir.name), fullPath)
  })
}

const routesForPrerender = searchFileNamesRecursively(toAbsolute("src/pages"))
  .filter((fileName) => !fileName.startsWith("_"))
  .map((fileName) => ({
    fileName,
    path:
      "/" +
      fileName.replace(".tsx", "").replace("/index", "").replace("index", ""),
  }))

const { viteServer } = await createServer()

const { render } = (await viteServer.ssrLoadModule(
  toAbsolute("./src/server/entry-server.tsx")
)) as { render: ServerRender }

for (const route of routesForPrerender) {
  const [appHtml, preloadLinks] = render(
    route.path,
    {},
    { manifest, fileName: route.fileName }
  )

  const html = template
    .replace(`<!--preload-links-->`, preloadLinks)
    .replace(`<!--app-html-->`, appHtml)

  const filePath = `dist/static/${route.fileName.replace(".tsx", "")}.html`
  const dirPath = filePath.split("/").slice(0, -1).join("/")
  mkdirSync(dirPath, { recursive: true })
  writeFileSync(toAbsolute(filePath), html)
}

// done, delete ssr manifest
unlinkSync(toAbsolute("dist/static/ssr-manifest.json"))

viteServer.close()
