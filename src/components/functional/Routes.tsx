import { Switch, Route } from "react-router-dom"
import App from "~/pages/_app"

type PageConf = {
  [path: string]: {
    default: React.VFC
  }
}

// @ts-expect-error
const pages = import.meta.globEager("../../pages/**/*.tsx") as PageConf

export type RouterConf = {
  path: string
  content: React.VFC<{}>
}

export const routes: RouterConf[] = Object.keys(pages)
  .filter((path) => !path.includes("_"))
  .map((path) => {
    const module = pages[path]
    // TODO: support dynamic roots like /hoge/[id].tsx
    const routingPath = path
      .toLowerCase()
      .replace("../../pages", "")
      .replace(".tsx", "")
      .replace("/index", "")
      .replace("index", "")

    return {
      path: routingPath,
      content: module?.default,
    }
  })
  .filter(
    (maybeConf): maybeConf is RouterConf =>
      typeof maybeConf.content !== "undefined"
  )
  // 上からマッチするので、パスの文字数でソートしておく
  .sort((a, b) => b.path.length - a.path.length)

const Routes: React.VFC = () => {
  return (
    <Switch>
      {routes.map((conf) => (
        <Route exact key={conf.path} path={conf.path}>
          <App>
            <p>path: {conf.path}</p>
            <conf.content />
          </App>
        </Route>
      ))}
      <Route>
        {/* TODO: 404.tsx とかを読むようにするのが良さそう */}
        <h1>Not Found</h1>
      </Route>
    </Switch>
  )
}

export default Routes
