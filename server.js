import dotenv from 'dotenv';
import fetch from 'node-fetch'; 
import express, { response } from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

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
const AZURE_KEY = process.env.AZURE_KEY;

// Configurar multer para manejar la carga de archivos de audio
const upload = multer({
  dest: 'uploads/' // Directorio donde se guardarán los archivos
});

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

function getSpeechToText(messages) {
  const response = fetch('https://eastus.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=es-ES', {
    method: "POST",
    headers: {
      "Content-Type": "audio/wav",
      "Ocp-Apim-Subscription-Key": `${AZURE_KEY}`,
    },
    body: messages
  });

  return response
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

//grabar audio
// Ruta para manejar la carga de archivos de audio
app.post('/upload-audio', upload.single('audio'), async (req, res) => {
 
  if (!req.file) {
    return res.status(400).send("No se proporcionó ningún archivo de audio.");
  }
  //console.log(req.file)

  const response = await getSpeechToText(req.file);
  response.json()
  .then(data => {
    console.log(data); // Aquí puedes acceder a los datos JSON
  })
  .catch(error => {
    console.error("Error al obtener los datos JSON:", error);
  });

  const targetDir = 'uploads/';

  const randomFileName = `${Date.now()}_${Math.floor(Math.random() * 1000)}.opus`;
  const targetFile = path.join(targetDir, randomFileName);

  fs.rename(req.file.path, targetFile, (err) => {
    if (err) {
      return res.status(500).send('Error al guardar el archivo de audio.');
    }
    res.send(`Audio guardado exitosamente con el nombre: ${randomFileName}`);
  });

  //console.log(response.body);

});



//grabar audio

app.listen(port, host, () => {
  console.log(`Server is running at http://localhost:${port}`);
});