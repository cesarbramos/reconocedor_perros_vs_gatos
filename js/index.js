import { predecir, ctx, tamano } from './common';

var video = document.getElementById("video");
var currentStream = null;
var facingMode = "user";

var modelo = null;

(async() => {
  console.log("Cargando modelo...");
  modelo = await tf.loadLayersModel("model.json");
  console.log("Modelo cargado");
})();

window.onload = function() {
  mostrarCamara();
}

function mostrarCamara() {
  var opciones = {
    audio: false,
    video: {
      width: tamano, height: tamano
    }
  }

  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia(opciones)
        .then(function(stream) {
          currentStream = stream;
          video.srcObject = currentStream;
          procesarCamara();
          predecir();
        })
        .catch(function(err) {
          alert("No se pudo utilizar la camara :(");
          console.log(err);
          alert(err);
        })
  } else {
    alert("No existe la funcion getUserMedia");
  }
}

function cambiarCamara() {
      if (currentStream) {
          currentStream.getTracks().forEach(track => {
              track.stop();
          });
      }

      facingMode = facingMode == "user" ? "environment" : "user";

      var opciones = {
          audio: false,
          video: {
              facingMode: facingMode, width: tamano, height: tamano
          }
      };


      navigator.mediaDevices.getUserMedia(opciones)
          .then(function(stream) {
              currentStream = stream;
              video.srcObject = currentStream;
          })
          .catch(function(err) {
              console.log("Oops, hubo un error", err);
          })
  }

function procesarCamara() {
    ctx.drawImage(video, 0, 0, tamano, tamano, 0, 0, tamano, tamano);
    setTimeout(procesarCamara, 20);
}


