import { renderToString } from "react-dom/server.js"
import { StaticRouter } from "react-router-dom"
import Routes from "../components/functional/Routes"

export function render(
  url: string,
  context: Record<string, unknown>
): [string, string] {
  const html = renderToString(
    <StaticRouter location={url} context={context}>
      <Routes />
    </StaticRouter>
  )

  const preloadLinks = ""
  return [html, preloadLinks]
}
export type ServerRender = typeof render
