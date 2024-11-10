import { predecir, canvas, otrocanvas, ctx, tamano, resultadoElement } from "./common.js";

const imageInput = document.getElementById('imageInput');
const previewImage = document.getElementById('preview');
const form = document.getElementById('form');
const btn = document.getElementById('btn');

form.onsubmit = (e) => {
    e.preventDefault();
}

btn.onclick = (e) => {
    predecir(canvas, otrocanvas);
}

const drawImageScaled = (img, ctx) => {
    const cvParent = ctx.canvas;
    var hRatio = cvParent.width / img.width;
    var vRatio = cvParent.height / img.height;
    var ratio = Math.min(hRatio, vRatio);
    var centerShift_x = (cvParent.width - img.width * ratio) / 2;
    var centerShift_y = (cvParent.height - img.height * ratio) / 2;
    ctx.clearRect(0, 0, cvParent.width, cvParent.height);
    ctx.drawImage(img, 0, 0, img.width, img.height,
        centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
}

imageInput.addEventListener('change', function (event) {
    resultadoElement.innerHTML = '';
    const file = event.target.files[0];
    console.log('change');

    const reader = new FileReader();
    reader.onload = (e) => {
        const imgEl = new Image();
        imgEl.src = e.target.result;
        
        // Espera a que la imagen se cargue completamente antes de dibujarla
        imgEl.onload = () => {
            previewImage.src = e.target.result;
            drawImageScaled(imgEl, canvas.getContext('2d'));
            btn.removeAttribute('disabled')
        };
    };
    reader.readAsDataURL(file);
});
