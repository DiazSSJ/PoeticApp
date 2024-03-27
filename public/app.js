const button = document.querySelector("#generate");
const output = document.querySelector("#output");
const descargaButton = document.querySelector(".descarga");
const playButton = document.querySelector(".play");
const pauseButton = document.querySelector(".pause");
const descargarAudio = document.getElementById("download_audio")
const playingText = document.querySelector("#playing_text");
const generateAudio = document.querySelector(".generate_audio");
const generatingAudio = document.querySelector(".generating_audio");


var sound = new Audio();

//Generar Audio
generateAudio.addEventListener('click', async () => {

  const outputElement = document.getElementById('output');
  const content = outputElement.textContent;
 
  try {
    const response = await fetch('/generate-audio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content })
    });

    // Esperar a que se complete la petición antes de continuar
    if (response.ok) {
      // Si la petición fue exitosa, ocultar el botón de generación
      generateAudio.style.display = "none";
      // Mostrar los botones de reproducción y descarga
      playButton.style.display = "block";
      pauseButton.style.display = "block";
      descargarAudio.style.display = "block";

    } else {
      console.error('Error al generar el audio:', response.status);
    }
  } catch (error) {
    console.error('Error de red:', error);
  }
});

//Generar Audio


//reproducir audio



playButton.addEventListener('click', () => {
  sound = new Audio();
  sound.src = 'poema.mp3';
  sound.play();
  playingText.style.display = "block";
});

pauseButton.addEventListener('click', () => {
  sound.pause();
  playingText.style.display = "none";
});


//reproducir audio


//Descargar Audio 
// Agregar evento click al botón de descarga
descargarAudio.addEventListener('click', () => {
  // Crear un enlace <a> para descargar el archivo de audio
  const downloadLink = document.createElement('a');
  downloadLink.href = sound.src; // Obtener la ruta del archivo de audio
  downloadLink.download = 'poema.mp3'; // Nombre de archivo para descargar
  document.body.appendChild(downloadLink); // Agregar el enlace al DOM
  downloadLink.click(); // Simular clic en el enlace para iniciar la descarga
  document.body.removeChild(downloadLink); // Eliminar el enlace después de la descarga
});

//Desacargar Audio



//grabar audios
const recordAnimo = document.getElementById("recordAnimo");
let mediaRecorder;
let audioChunks = [];


const server_url = '/generate'



button.addEventListener("click", async () => {

  const to = document.getElementById('to').value;
  const animo = document.querySelector("#animo").value;
  const tipo = document.querySelector("#tipoPoema").value;

  generateAudio.style.display = "block";
  // Mostrar los botones de reproducción y descarga
  playButton.style.display = "none";
  pauseButton.style.display = "none";
  descargarAudio.style.display = "none";
  playingText.style.display = "none";
  


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
    margin: 1,
    filename: 'poema.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
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