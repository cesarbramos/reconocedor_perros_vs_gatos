import { recognize, canvas, resultadoElement } from "./common.js";

const imageInput = document.getElementById('imageInput');
const previewImage = document.getElementById('preview');
const form = document.getElementById('form');
const btn = document.getElementById('btn');

form.onsubmit = (e) => {
    e.preventDefault();
}

btn.onclick = () => {
    recognize();
}

const drawImageScaled = (img, ctx) => {
    const cvParent = ctx.canvas;
    let hRatio = cvParent.width / img.width;
    let vRatio = cvParent.height / img.height;
    let ratio = Math.min(hRatio, vRatio);
    let centerShift_x = (cvParent.width - img.width * ratio) / 2;
    let centerShift_y = (cvParent.height - img.height * ratio) / 2;
    ctx.clearRect(0, 0, cvParent.width, cvParent.height);
    ctx.drawImage(img, 0, 0, img.width, img.height,
        centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
}

imageInput.onchange = (event) => {
    resultadoElement.innerHTML = '';
    const file = event.target.files[0];
    if (!file) return;

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
}