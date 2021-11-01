import { renderToString } from "react-dom/server.js"
import { StaticRouter } from "react-router-dom"
import Routes from "../components/functional/Routes"

export function render(
  url: string,
  context: Record<string, unknown>,
  preloadConf: {
    fileName?: string
    manifest: Record<string, string[]>
  } = {
    manifest: {},
  }
): [string, string] {
  const html = renderToString(
    <StaticRouter location={url} context={context}>
      <Routes />
    </StaticRouter>
  )

  const manifestKey = "src/pages/" + preloadConf.fileName
  const preloadFiles = preloadConf.manifest[manifestKey] ?? []

  return [html, preloadFiles.map(renderPreloadLink).join("")]
}

export type ServerRender = typeof render

function renderPreloadLink(fileName: string): string {
  if (fileName.endsWith(".js")) {
    return `<link rel="modulepreload" crossorigin href="${fileName}">`
  } else if (fileName.endsWith(".css")) {
    return `<link rel="stylesheet" href="${fileName}">`
  } else if (fileName.endsWith(".woff")) {
    return ` <link rel="preload" href="${fileName}" as="font" type="font/woff" crossorigin>`
  } else if (fileName.endsWith(".woff2")) {
    return ` <link rel="preload" href="${fileName}" as="font" type="font/woff2" crossorigin>`
  } else if (fileName.endsWith(".gif")) {
    return ` <link rel="preload" href="${fileName}" as="image" type="image/gif">`
  } else if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) {
    return ` <link rel="preload" href="${fileName}" as="image" type="image/jpeg">`
  } else if (fileName.endsWith(".png")) {
    return ` <link rel="preload" href="${fileName}" as="image" type="image/png">`
  } else {
    // TODO
    return ""
  }
}
