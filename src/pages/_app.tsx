import { Link } from "react-router-dom"
import { routes } from "~/components/functional/Routes"
import "~/App.scss"

type Props = React.PropsWithChildren<Record<string, unknown>>

const MyApp: React.VFC<Props> = ({ children }: Props) => {
  return (
    <div className="myAppClass">
      <nav>
        <ul>
          {routes.reverse().map((route) => (
            <li key={route.path}>
              <Link to={route.path}>
                {route.path === "" ? "HOME" : route.path}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="content">{children}</div>
    </div>
  )
}

export default MyApp
