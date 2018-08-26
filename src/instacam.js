'use strict';

import {defaults} from './defaults.js';
import {requirement} from './support.js';

export class Instacam {

  // class constructor
  constructor(viewport, options) {

    // assigns custom user options to defaults
    this.options = Object.assign(defaults, options);

    // checks for browser support
    if (!requirement) {
      if (typeof this.options.unsupported === 'function') {
        this.options.unsupported();
      }

      return;
    }

    // checks the viewport element
    if (typeof viewport === 'undefined' || viewport === null || viewport.nodeName.toLowerCase() !== 'canvas') {
      throw new Error('Invalid viewport, you need to pass a valid HTML5 canvas element');
    }

    // initializes the viewport
    this.viewport = viewport;
    this.viewport.width = this.options.width;
    this.viewport.height = this.options.height;

    // creates the media element
    let media = document.createElement('video');

    // sets some media element properties
    media.style.display = 'none';
    media.autoplay = true;
    media.width = this.options.width;
    media.height = this.options.height;

    // attaches the media element to the DOM
    this.viewport.parentNode.insertBefore(media, this.viewport.nextSibling);

    // captures the webcam stream
    this.capture(media);
  }

  // captures the media stream to the viewport through getUserMedia API
  capture() {

    // prevents from streaming errors
    try {

      // captures the media stream
      navigator.mediaDevices.getUserMedia({
        //
      }).then(function() {
        audio: true,
        video: true
        if (typeof this.options.done === 'function') {
          this.options.done();
        }
      }).catch(function(exception) {
        if (typeof this.options.fail === 'function') {
          this.options.fail(exception);
        }
      });
    } catch(exception) {
      if (typeof this.options.fail === 'function') {
        this.options.fail(exception);
      }
    }
  }

  // applies a custom filter to the viewport
  filter() {}

  // snaps the viewport and returns the image data
  snap() {}

  // saves the viewport to a specific image file format : png and high quality by default
  save() {}
}
