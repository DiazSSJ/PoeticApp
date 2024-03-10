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
      max_tokens: 20,
    }),
  });

  const data = await response.json();
  return data;
}

const animo = document.querySelector("#animo");
const tipo = document.querySelector("#tipoPoema");

const button = document.querySelector("#generate");
const output = document.querySelector("#output");




button.addEventListener("click", async () => {

  
  const to = document.getElementById('to').value;

  const prompt = `Eres un experto en poesía de toda categoría y amante de ayudar a los demás a expresar sus sentimientos con poemas. 
                  Quiero que escribas un poema de tipo ${tipo.value} para ${to} teniendo en cuenta que me siento ${animo.value}. 
                  Quiero que hagas uso de todos los recursos que tengas disponible para que el poema sea breve, 
                  conciso pero contundente con su mensaje, y que exprese lo que siento.`;

  console.log(prompt)

  if (!prompt) {
    window.alert("Please enter a prompt");
    return;
  }

  const response = await getCompletion(prompt);
  const content = response.choices[0].message.content;
  output.innerHTML = content;
});
