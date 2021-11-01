import { createServer } from "./create-server"

createServer().then(({ app }) =>
  app.listen(3000, () => {
    console.log("http://localhost:3000")
  })
)
