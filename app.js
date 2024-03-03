const API_KEY = "your api";

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

// getCompletion()


const animo = document.querySelector("#animo");
const to = document.querySelector("#to");
const tipo = document.querySelector("#tipoPoema");

const button = document.querySelector("#generate");
const output = document.querySelector("#output");


button.addEventListener("click", async () => {
  console.log(prompt.value);

  if (!prompt.value) window.alert("Please enter a prompt");

  const response = await getCompletion(prompt.value);
  const content = response.choices[0].message.content;
  output.innerHTML = content;
});
