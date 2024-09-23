import OpenAI from "openai";
import { APIError } from "openai/error";

class GPT {
  constructor (openAI = OpenAI) {
    this.openAI = new openAI({
      apiKey: process.env.OPENAI_KEY
    })
  }

  async callGPT (content, retries = 0) {
    try {
      const responseStream = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful assistant that will answer all questions." },
          { role: "user", content }
        ],
        stream: true,
      });
      
      return responseStream
    } catch (exception) {
      if (retries > 2) {
        console.log('Request failed!!!')
        throw exception
      }
      console.log('Request error, retrying...')
      this.callGPT(content, retries += 1)
      return
    }
  }
}

export default GPT
