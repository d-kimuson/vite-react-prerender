import { hydrate } from "react-dom"
import { BrowserRouter } from "react-router-dom"
import Routing from "./components/functional/Routes"

hydrate(
  <BrowserRouter>
    <Routing />
  </BrowserRouter>,
  document.getElementById("root")
)
