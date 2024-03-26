const button = document.querySelector("#generate");
const output = document.querySelector("#output");
const descargaButton = document.querySelector(".descarga");

//grabar audios
const recordAnimo = document.getElementById("recordAnimo");
let mediaRecorder;
let audioChunks = [];


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


//grabar audios

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      //clearInterval(timerInterval);
      const audioBlob = new Blob(audioChunks, {
        type: 'audio/wav; codecs=opus',
      });

      // Envía el audio grabado al servidor
      const formData = new FormData();
      formData.append("audio", audioBlob);

      const response = fetch('/upload-audio', {
        method: 'POST',
        body: formData
      });
    
      
    };

    mediaRecorder.start();
    console.log("grabando")
    //startTime = Date.now();
    //timerInterval = setInterval(updateRecordingTime, 1000);
    recordAnimo.classList.remove("bi-mic-fill");
    recordAnimo.classList.add("text-danger", "bi-mic-mute-fill");
    recordAnimo.classList.add("recording"); // Agregar la clase "recording"
  } catch (error) {
    console.error("Error al acceder al micrófono:", error);
  }
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    //clearInterval(timerInterval);
    mediaRecorder.stop();
    recordAnimo.classList.remove("text-danger", "bi-mic-mute-fill");
    recordAnimo.classList.add("bi-mic-fill");
    console.log("no grabando")
    recordAnimo.classList.remove("recording");

  }
}

recordAnimo.addEventListener("click", () => {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    stopRecording();
  } else {
    startRecording();
  }
});

//grabar audio