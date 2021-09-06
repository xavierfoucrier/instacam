// get some elements
let log = document.querySelector('.camera-log');
let input = document.querySelector('.camera-input');
let output = document.querySelector('.camera-output');

// define all custom filters
const filters = {
  'none': null,
  'noise': (pixel) => {
    let r = Math.random();
    return [r * pixel.red, r * pixel.green, r * pixel.blue, pixel.alpha];
  },
  'grayscale': (pixel) => {
    let g = 0.2126 * pixel.red + 0.7152 * pixel.green + 0.0722 * pixel.blue;
    return [g, g, g, pixel.alpha];
  },
  'invert': (pixel) => {
    return [255 - pixel.red, 255 - pixel.green, 255 - pixel.blue, pixel.alpha];
  },
  'threshold': (pixel) => {
    return (0.2126 * pixel.red + 0.7152 * pixel.green + 0.0722 * pixel.blue >= 100) ? [255, 255, 255, 255] : [0, 0, 0, 255];
  },
  'sobel': (pixel) => {
    let v = Math.abs(pixel.x);
    let h = Math.abs(pixel.y);
    return [pixel.red + v, pixel.green + h, pixel.blue + (v + h) / 4, 255];
  },
  'pixel': (pixel) => {
    if (pixel.offset % 10 !== 0) {
      return [window.red, window.green, window.blue, 255];
    } else {
      window.red = pixel.red;
      window.green = pixel.green;
      window.blue = pixel.blue;

      return [pixel.red, pixel.green, pixel.blue, 255];
    }
  },
};

// instantiate the class
let camera = new Instacam(
  document.querySelector('canvas'), {
    sound: true,
    volume: 0,
    done: () => {
      log.innerHTML = 'Instacam is working fine.';
    },
    fail: (exception) => {
      log.innerHTML = `Sorry, Instacam failed to start because you didn't accept the requested permissions to access your camera, or something went wrong. <strong class="camera-log-error">Error: ${exception.message}</strong>`;
    },
    unsupported: () => {
      log.innerHTML = 'Sorry, but it seems that your browser is not supporting requestAnimationFrame, mediaDevices or Promises. Try Instacam in another browser.';
    },
  },
);

// bind all property input to properly update the viewport
document.querySelectorAll('.field-property + [type="range"]').forEach((element) => {
  const value = element.parentNode.querySelector('.field-value');

  // define data default attribute automatically
  element.setAttribute('data-default', element.value);

  // update the current range value and the associated Instacam property when input is changing
  element.addEventListener('input', () => {
    value.innerHTML = element.value;
    camera[element.name] = Number.parseFloat(element.value);

    // update the volume icon to represent the volume state
    if (element.name === 'volume') {
      const state = document.querySelector('.volume-state use');

      if (element.value < 30) {
        state.setAttribute('xlink:href', 'picture/sprite.svg#volume-mute');
      } else if (element.value >= 30 && element.value <= 70) {
        state.setAttribute('xlink:href', 'picture/sprite.svg#volume-down');
      } else if (element.value > 70) {
        state.setAttribute('xlink:href', 'picture/sprite.svg#volume-up');
      }
    }
  });

  // show the current range value on mousedown
  ['mousedown', 'touchstart'].forEach((e) => {
    element.addEventListener(e, () => {
      value.innerHTML = element.value;
      value.classList.add('field-update');
    }, {
      passive: true,
    });
  });

  // hide the current range value on mouseup
  ['mouseup', 'touchend'].forEach((e) => {
    element.addEventListener(e, () => {
      value.classList.remove('field-update');
    });
  });
});

// bind all custom blend input to properly update the viewport
document.querySelectorAll('[name="blend"]').forEach((element) => {
  element.addEventListener('change', () => {

    // apply the custom blend layer
    camera.blend = element.value === 'none' ? {} : {
      mode: element.value,
      color: getComputedStyle(input).getPropertyValue('background-color'),
    };
  });
});

// bind all custom filter input to properly update the viewport
document.querySelectorAll('[name="filter"]').forEach((element) => {
  element.addEventListener('change', () => {

    // apply the custom filter
    camera.filter = filters[element.value];
  });
});

// apply the mirror mode to the viewport
document.querySelectorAll('[name="mirror"]').forEach((element) => {
  element.addEventListener('change', () => {
    camera.mirror = element.value === '1';
  });
});

// snap the viewport and display a thumbnail
document.querySelector('[name="snap"]').addEventListener('click', () => {

  // snap the camera
  let data = camera.snap();

  // create a canvas to paste the snapshot
  let canvas = document.createElement('canvas');
  canvas.setAttribute('width', camera.hardware.video.width);
  canvas.setAttribute('height', camera.hardware.video.height);
  canvas.getContext('2d').putImageData(data, 0, 0);
  canvas.classList.add('cell', 'camera-thumbnail');

  console.log(`${camera.hardware.video.width} x ${camera.hardware.video.height}`);

  // clean the area before displaying thumbnail
  output.innerHTML = '';

  // append the snapshot into the export area
  output.appendChild(canvas);
});

// save the viewport when the exported format is changing
document.querySelectorAll('[name="format"]').forEach((element) => {
  element.addEventListener('change', () => {
    save();
  });
});

// save the viewport when the exported quality is changing
document.querySelector('[name="quality"]').addEventListener('input', () => {
  save();
});

// save the viewport and display the exported image data
function save() {

  // activate the quality input
  document.querySelector('[name="quality"]').removeAttribute('disabled');
  document.querySelector('.size').classList.remove('disabled');

  // get the image data
  let data = camera.save(document.querySelector('[name="format"]:checked').value, Number.parseFloat(document.querySelector('[name="quality"]').value));

  // create the exported image in the specified format and quality
  let image = document.createElement('img');
  image.setAttribute('src', data);
  image.classList.add('camera-output-image');

  // append the image into the output area
  output.innerHTML = '';
  output.appendChild(image);

  // estimate the file size
  document.querySelector('.size span').innerHTML = Math.round(((data.length * 3) / 4) / 1024);
}
