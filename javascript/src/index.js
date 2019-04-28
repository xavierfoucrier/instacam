'use strict';

// imports the library
import { Instacam } from 'instacam';

// gets some elements
let log = document.querySelector('.log');
let preview = document.querySelector('.preview');

// instantiate the class
let camera = new Instacam(
  document.querySelector('canvas'), {
    sound: true,
    volume: 0,
    done: () => {
      log.innerHTML = 'Instacam is working fine.';
    },
    fail: (exception) => {
      log.innerHTML = `Sorry, Instacam failed to start because you didn't accept the requested permissions to access your camera, or something went wrong. Error: <strong>${exception.message}</strong>`;
    },
    unsupported: () => {
      log.innerHTML = 'Sorry, but it seems that your browser is not supporting requestAnimationFrame, mediaDevices or Promises. Try Instacam in another browser.';
    }
  }
);

// binds all property input to properly update the viewport
Array.from(document.querySelectorAll('.property + [type="range"]')).forEach((element) => {
  const value = element.parentNode.querySelector('.value');

  // defines data default attribute automatically
  element.setAttribute('data-default', element.value);

  // updates the current range value and the associated Instacam property when input is changing
  element.addEventListener('input', () => {
    value.innerHTML = element.value;
    camera[element.name] = Number.parseFloat(element.value);

    // updates the volume icon to represent the volume state
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

  // shows the current range value on mousedown
  element.addEventListener('mousedown', () => {
    value.innerHTML = element.value;
    value.classList.add('update');
  });

  // hides the current range value on mouseup
  element.addEventListener('mouseup', () => {
    value.classList.remove('update');
  });
});

// binds all custom filter input to properly update the viewport
Array.from(document.querySelectorAll('[name="filter"]')).forEach((element) => {
  element.addEventListener('change', () => {

    // defines all custom filters
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
      }
    };

    // applies the custom filter
    camera.filter = filters[this.value];
  });
});

// applies the mirror mode to the viewport
Array.from(document.querySelectorAll('[name="mirror"]')).forEach((element) => {
  element.addEventListener('change', () => {
    camera.mirror = element.value === '1';
  });
});

// snaps the viewport and displays a thumbnail
document.querySelector('[name="snap"]').addEventListener('click', () => {

  // snaps the camera
  let data = camera.snap();

  // creates a canvas to paste the snapshot
  let canvas = document.createElement('canvas');
  canvas.setAttribute('width', 400);
  canvas.setAttribute('height', 300);
  canvas.getContext('2d').putImageData(data, 0, 0);

  // cleans the area before displaying thumbnail
  if (preview.querySelector('img') !== null || (preview.querySelectorAll('canvas').length >= 16)) {
    preview.innerHTML = '';
  }

  // appends the snapshot into the export area
  preview.appendChild(canvas);
});

// saves the viewport when the exported format is changing
Array.from(document.querySelectorAll('[name="format"]')).forEach((element) => {
  element.addEventListener('change', () => {
    save();
  });
});

// saves the viewport when the exported quality is changing
document.querySelector('[name="quality"]').addEventListener('input', () => {
  save();
});

// saves the viewport and displays the exported image data
function save() {

  // activates the quality input
  document.querySelector('[name="quality"]').removeAttribute('disabled');
  document.querySelector('.size').classList.remove('disabled');

  // gets the image data
  let data = camera.save(document.querySelector('[name="format"]:checked').value, Number.parseFloat(document.querySelector('[name="quality"]').value));

  // creates the exported image in the specified format and quality
  let image = document.createElement('img');
  image.setAttribute('width', 400);
  image.setAttribute('height', 300);
  image.setAttribute('src', data);

  // appends the image into the preview area
  preview.innerHTML = '';
  preview.appendChild(image);

  // estimates the file size
  document.querySelector('.size span').innerHTML = Math.round(((data.length * 3) / 4) / 1024);
}
