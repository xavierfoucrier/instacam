'use strict';

// uses pseudo node module for now as Instacam is not published yet on the NPM registry
import {Instacam} from '../../node_modules/instacam/src/instacam.js';

// gets some elements
let log = document.querySelector('.log');
let preview = document.querySelector('.preview');

// instantiate the class
let camera = new Instacam(
  document.querySelector('canvas'), {
    done: function() {
      log.innerHTML = 'Instacam is working fine.';
    },
    fail: function(exception) {
      log.innerHTML = `Sorry, Instacam failed to start because you didn't accept the requested permissions to access your camera, or something went wrong. Error: <strong>${exception.message}</strong>`;
    },
    unsupported: function() {
      log.innerHTML = 'Sorry, but it seems that your browser is not supporting requestAnimationFrame, mediaDevices or Promises. Try Instacam in another browser.';
    }
  }
);

// binds all css filter input to properly update the viewport
Array.from(document.querySelectorAll('.property + [type="range"]')).forEach(function(element) {
  const value = element.parentNode.querySelector('.value');

  // defines data default attribute automatically
  element.setAttribute('data-default', element.value);

  // updates the current range value and the associated Instacam property when input is changing
  element.addEventListener('input', function() {
    value.innerHTML = this.value;
    camera[this.name] = Number.parseFloat(this.value);
  });

  // shows the current range value on mousedown
  element.addEventListener('mousedown', function() {
    value.innerHTML = this.value;
    value.classList.add('update');
  });

  // hides the current range value on mouseup
  element.addEventListener('mouseup', function() {
    value.classList.remove('update');
  });
});

// binds all custom filter input to properly update the viewport
Array.from(document.querySelectorAll('[name="filter"]')).forEach(function(element) {
  element.addEventListener('change', function() {

    // defines all custom filters
    const filters = {
      'none': null,
      'noise': function(pixel) {
        let r = Math.random();
        return [r * pixel.red, r * pixel.green, r * pixel.blue, pixel.alpha];
      },
      'grayscale': function(pixel) {
        let g = 0.2126 * pixel.red + 0.7152 * pixel.green + 0.0722 * pixel.blue;
        return [g, g, g, pixel.alpha];
      },
      'invert': function(pixel) {
        return [255 - pixel.red, 255 - pixel.green, 255 - pixel.blue, pixel.alpha];
      },
      'threshold': function(pixel) {
        return (0.2126 * pixel.red + 0.7152 * pixel.green + 0.0722 * pixel.blue >= 100) ? [255, 255, 255, 255] : [0, 0, 0, 255];
      },
      'sobel': function(pixel) {
        let v = Math.abs(pixel.x);
        let h = Math.abs(pixel.y);
        return [pixel.red + v, pixel.green + h, pixel.blue + (v + h) / 4, 255];
      },
      'pixel': function(pixel) {
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

// snaps the viewportn and displays a thumbnail
document.querySelector('[name="snap"]').addEventListener('click', function() {

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
Array.from(document.querySelectorAll('[name="format"]')).forEach(function(element) {
  element.addEventListener('change', function() {
    save();
  });
});

// saves the viewport when the exported quality is changing
document.querySelector('[name="quality"]').addEventListener('input', function() {
  save();
});

// saves the viewport and displays the exported image data
function save() {

  // activates the quality input
  document.querySelector('[name="quality"]').removeAttribute('disabled');
  document.querySelector('.size').classList.remove('disabled');

  // gets the image data
  let data = camera.save(document.querySelector('[name="format"]:checked').value, parseFloat(document.querySelector('[name="quality"]').value));

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
