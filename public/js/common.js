export const canvas = document.getElementById("canvas");
export const otrocanvas = document.getElementById("otrocanvas");
export const resultadoElement = document.getElementById("resultado");
export const ctx = canvas.getContext("2d", { willReadFrequently: true });

const toastLive = document.getElementById('liveToast')
const toastLive2 = document.getElementById('liveToast2')

const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLive)
const toastBootstrap2 = bootstrap.Toast.getOrCreateInstance(toastLive2)

export const SIZE = 400;

(async() => {
  toastBootstrap.show()
  modelo = await tf.loadLayersModel("model/model.json");
  toastBootstrap2.show()
})();

export var modelo = null;

export const recognize = (isStream) => {
    if (modelo != null) {
      reescale(canvas, 100, 100, otrocanvas);
  
      let ctx2 = otrocanvas.getContext("2d", { willReadFrequently: true });
      let imgData = ctx2.getImageData(0,0, 100, 100);
  
      let arr = [];
      let arr100 = [];
  
      for (let p=0; p < imgData.data.length; p+= 4) {
        let red = imgData.data[p] / 255;
        let green = imgData.data[p+1] / 255;
        let blue = imgData.data[p+2] / 255;
  
        let gray = (red+green+blue)/3;
  
        arr100.push([gray]);
        if (arr100.length == 100) {
          arr.push(arr100);
          arr100 = [];
        }
      }
  
      arr = [arr];
  
      let tensor = tf.tensor4d(arr);
      let resultado = modelo.predict(tensor).dataSync();
      resultadoElement.innerHTML = (resultado <= .5) ? 'Gato' : 'Perro';
    }
  
    if (isStream)
      setTimeout(() => recognize(isStream), 150);
}

/**
   * Reescala el canvas a otro más pequeño ajustandolo para coincidir con el tamaño en el que entrenó el modelo 100, 100, 1
   * Es decir 100 x 100 a un canal de color (gris)
   * 
   * @param {HtmlElement} canvas
   * @param {int} width
   * @param {int} height
   * @param {boolean} resize_canvas si es true, el canvas será reescalado.
   */
export function reescale(canvas, width, height, resize_canvas) {
    var width_source = canvas.width;
    var height_source = canvas.height;
    width = Math.round(width);
    height = Math.round(height);

    var ratio_w = width_source / width;
    var ratio_h = height_source / height;
    var ratio_w_half = Math.ceil(ratio_w / 2);
    var ratio_h_half = Math.ceil(ratio_h / 2);

    var ctx = canvas.getContext("2d", { willReadFrequently: true });
    var ctx2 = resize_canvas.getContext("2d", { willReadFrequently: true });
    var img = ctx.getImageData(0, 0, width_source, height_source);
    var img2 = ctx2.createImageData(width, height);
    var data = img.data;
    var data2 = img2.data;

    for (var j = 0; j < height; j++) {
        for (var i = 0; i < width; i++) {
            var x2 = (i + j * width) * 4;
            var weight = 0;
            var weights = 0;
            var weights_alpha = 0;
            var gx_r = 0;
            var gx_g = 0;
            var gx_b = 0;
            var gx_a = 0;
            var center_y = (j + 0.5) * ratio_h;
            var yy_start = Math.floor(j * ratio_h);
            var yy_stop = Math.ceil((j + 1) * ratio_h);
            for (var yy = yy_start; yy < yy_stop; yy++) {
                var dy = Math.abs(center_y - (yy + 0.5)) / ratio_h_half;
                var center_x = (i + 0.5) * ratio_w;
                var w0 = dy * dy; //pre-calc part of w
                var xx_start = Math.floor(i * ratio_w);
                var xx_stop = Math.ceil((i + 1) * ratio_w);
                for (var xx = xx_start; xx < xx_stop; xx++) {
                    var dx = Math.abs(center_x - (xx + 0.5)) / ratio_w_half;
                    var w = Math.sqrt(w0 + dx * dx);
                    if (w >= 1) {
                        //pixel too far
                        continue;
                    }
                    //hermite filter
                    weight = 2 * w * w * w - 3 * w * w + 1;
                    var pos_x = 4 * (xx + yy * width_source);
                    //alpha
                    gx_a += weight * data[pos_x + 3];
                    weights_alpha += weight;
                    //colors
                    if (data[pos_x + 3] < 255)
                        weight = weight * data[pos_x + 3] / 250;
                    gx_r += weight * data[pos_x];
                    gx_g += weight * data[pos_x + 1];
                    gx_b += weight * data[pos_x + 2];
                    weights += weight;
                }
            }
            data2[x2] = gx_r / weights;
            data2[x2 + 1] = gx_g / weights;
            data2[x2 + 2] = gx_b / weights;
            data2[x2 + 3] = gx_a / weights_alpha;
        }
    }


    ctx2.putImageData(img2, 0, 0);
}