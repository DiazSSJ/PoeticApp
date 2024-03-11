const button = document.querySelector("#generate");
const output = document.querySelector("#output");
const descargaButton = document.querySelector(".descarga");


const server_url = '/generate' 

button.addEventListener("click", async () => {

  const to = document.getElementById('to').value;
  const animo = document.querySelector("#animo").value;
  const tipo= document.querySelector("#tipoPoema").value;

  const response = await fetch(server_url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ to, animo, tipo })
  });

  const content = await response.text();
  output.innerHTML = content;
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