'use strict';

// uses pseudo node module for now as Instacam is not published yet on the NPM registry
import {Instacam} from '../../node_modules/instacam/src/instacam.js';

// instantiate the class
let camera = new Instacam(
  document.querySelector('canvas')
);

// binds all css filter input to properly update the viewport
Array.from(document.querySelectorAll('.css-filter [type="range"]')).forEach(function(element) {
  element.addEventListener('input', function() {
    camera[this.name] = Number.parseFloat(this.value);
  });
});
