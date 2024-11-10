import { recognize, ctx, SIZE } from './common.js';

var video = document.getElementById("video");
var currentStream = null;

const DEVICE_IN_USE_CODE = 0;

window.onload = () => showCam();

const showCam = () => {
  let opciones = {
    audio: false,
    video: {
      width: SIZE,
      height: SIZE
    }
  }

  if (!navigator.mediaDevices.getUserMedia) {
    alert("No existe la funcion getUserMedia");
    return;
  }

  navigator.mediaDevices.getUserMedia(opciones)
    .then(function (stream) {
      currentStream = stream;
      video.srcObject = currentStream;
      processCamFrames();
      recognize(true);
    })
    .catch(function (err) {
      alert("No se pudo utilizar la camara :(");
      console.log(err);

      if (err.code == DEVICE_IN_USE_CODE)
        alert('Parece que otra aplicación está utilizando la cámara.\nCierrela y recargue la pagina');
      else
        alert(err);
    })
}

const processCamFrames = () => {
  ctx.drawImage(video, 0, 0, SIZE, SIZE, 0, 0, SIZE, SIZE);
  setTimeout(processCamFrames, 20);
}