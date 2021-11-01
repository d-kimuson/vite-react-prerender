import "../App.css"

type Props = React.PropsWithChildren<Record<string, unknown>>

const MyApp: React.VFC<Props> = ({ children }: Props) => {
  return <div className="myAppClass">{children}</div>
}

export default MyApp
