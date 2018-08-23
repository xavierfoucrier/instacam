'use strict';

import {defaults} from './defaults.js';

export class Instacam {

  // class constructor
  constructor(options) {

    // assigns custom user options to defaults
    this.options = Object.assign(options, defaults);
  }

  // captures the media stream to the viewport through getUserMedia API
  capture() {}

  // applies a custom filter to the viewport
  filter() {}

  // snaps the viewport and returns the image data
  snap() {}

  // saves the viewport to a specific image file format : png and high quality by default
  save() {}
}
