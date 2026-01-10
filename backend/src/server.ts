import app from "./app"

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log(`le server a demarre sur le port http://localhost:${PORT}`)
})
