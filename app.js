import express from "express";
import 'dotenv/config'

const app = express()

const port = process.env.PORT

app.get('/', (_, res) => {
  console.log('Health check...')
  res.send({
    message: 'Health check... API is running!',
    status: 200
  })
})

app.listen(port, () => {
  console.log(`Server listening at port: ${port}`);
});