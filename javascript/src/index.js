'use strict';

// uses pseudo node module for now as Instacam is not published yet on the NPM registry
import {Instacam} from '../../node_modules/instacam/src/instacam.js';

// gets the log element
let log = document.querySelector('.log');

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
      }
    };

    // applies the custom filter
    camera.filter = filters[this.value];
  });
});
