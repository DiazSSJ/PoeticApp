const API_KEY = "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";

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

  const data = await response.json();
  return data;
}

const animo = document.querySelector("#animo");
const tipo = document.querySelector("#tipoPoema");

const button = document.querySelector("#generate");
const output = document.querySelector("#output");
const descargaButton = document.querySelector(".descarga");

button.addEventListener("click", async () => {

  
  const to = document.getElementById('to').value;

  const prompt = `Eres un experto en poesía de toda categoría y amante de ayudar a los demás a expresar sus sentimientos con poemas.Quiero que escribas un poema de tipo ${tipo.value} para ${to} teniendo en cuenta que me siento ${animo.value}.Quiero que hagas uso de todos los recursos que tengas disponible para que el poema sea conciso pero contundente con su mensaje, y que exprese lo que siento. Debe de ser de almenos 20 y maximo 30 palabras.`;

  console.log(prompt)

  if (!prompt) {
    window.alert("Please enter a prompt");
    return;
  }

  const response = await getCompletion(prompt);
  const content = response.choices[0].message.content;
  output.innerHTML = content;
  console.log(content)
});

descargaButton.addEventListener("click", async () => {
  const content = output.innerHTML;
  if (!content) {
    window.alert("No hay contenido para descargar");
    return;
  }

  const opt = {
    margin:       1,
    filename:     'poema.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(output).save();
});