import dotenv from 'dotenv';
import fetch from 'node-fetch'; 
import express from 'express';
import cors from 'cors';

dotenv.config();
const app = express();

//middleware to enable CORS
app.use(cors({
    origin: '*'
  }));

app.use(express.json());
app.use(express.static('public'));

const port = 3000;
const host = '0.0.0.0'

const API_KEY = process.env.API_KEY;

async function getCompletion(messages) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo-16k",
      messages: [{ role: "user", content: messages }],
      max_tokens: 50,
    }),
  });

  return response;
}

app.use(express.static('public'));

app.post('/generate', async (req, res) => {
  const { to, animo, tipo } = req.body;

  const prompt =`Eres un experto en poesía de toda categoría y amante de ayudar a los demás a expresar sus
   sentimientos con poemas.Quiero que escribas un poema de tipo ${tipo} para ${to} teniendo en cuenta
    que me siento ${animo}.Quiero que hagas uso de todos los recursos que tengas disponible para que el
     poema sea conciso pero contundente con su mensaje, y que exprese lo que siento. Debe de ser de almenos 20 y maximo 30 palabras.`;

  if (!prompt) {
    return res.status(400).send("Please enter a prompt");
  }

  const response = await getCompletion(prompt);

  const statusCode = response.status;
  if (statusCode !== 200) {
    const msg = `Error ${statusCode}: Please contac the website's tech support`
    res.status(statusCode).send(msg);
  }

  try {
    const data = await response.json();
    const content = data.choices[0].message.content;
    res.send(content);

  } catch (error) {
    res.status(500).send("Error parsing response from OpenAI");
  }

});

app.listen(port, host, () => {
  console.log(`Server is running at http://localhost:${port}`);
});