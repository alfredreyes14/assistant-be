import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import 'dotenv/config'
import GPT from "./openai.js";

const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

const port = process.env.PORT

// Initial endpoint to be hit - you can use this to perform a quick health check
app.get('/', async (_, res) => {
  console.log('Health check...')
  res.send({
    message: 'Health check passed...',
    status: 200
  })
})

app.post('/ask', async (req, res) => {
  const { body } = req

  if (body.question === "") {
    res.send({
      status: 400,
      message: 'Question field is missing'
    })
    return
  }

  if (typeof body.question !== 'string') {
    res.send({
      status: 400,
      message: 'Question field must be of type string'
    })
    return
  }
  
  const question = body.question.trim()

  const openAI = new GPT()
  try {
    const stream = await openAI.callGPT(question)
    for await (const chunk of stream) {
      res.write(chunk.choices[0]?.delta?.content || "")
    }

    res.end();
  } catch (exception) {
    res.send({
      message: exception.message,
      status: 500
    })
  }
})

app.listen(port, () => {
  console.log(`Server listening at port: ${port}`);
});