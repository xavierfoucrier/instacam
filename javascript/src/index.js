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
Array.from(document.querySelectorAll('.css-filter [type="range"]')).forEach(function(element) {
  element.addEventListener('input', function() {
    camera[this.name] = Number.parseFloat(this.value);
  });
});
