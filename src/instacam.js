'use strict';

import {defaults} from './defaults.js';
import {requirement} from './support.js';

export class Instacam {

  // class constructor
  constructor(viewport, options) {

    // assigns custom user options to defaults
    this.options = Object.assign({}, defaults, options);

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
    this._capture(media);
  }

  // captures the media stream to the viewport through getUserMedia API
  _capture(media) {

    // prevents from streaming errors
    try {

      // captures the media stream
      navigator.mediaDevices.getUserMedia({
        audio: this.options.sound,
        video: (() => {
          if (this.options.camera === false) {
            return false;
          }

          return true;
        })()
      }).then((stream) => {

        // captures the blob stream
        media.srcObject = stream;

        // sets the volume at start
        media.volume = (typeof this.options.volume === 'number' && this.options.volume >= 0 && this.options.volume <= 100 ? this.options.volume : defaults.volume) / 100;

        // animation loop used to properly render the viewport
        const loop = () => {

          // renders the viewport with or without custom filter
          if (typeof this.options.filter !== 'function') {
            this.viewport.getContext('2d').drawImage(media, 0, 0, this.options.width, this.options.height);
          } else {

            // uses a buffer when applying a custom filter to prevent the viewport from blinkings or flashes
            if (typeof this._buffer === 'undefined') {
              this._buffer = document.createElement('canvas');
              this._buffer.style.display = 'none';
              this._buffer.width = this.options.width;
              this._buffer.height = this.options.height;
              this.viewport.parentNode.insertBefore(this._buffer, this.viewport.nextSibling);
            }

            this._buffer.getContext('2d').drawImage(media, 0, 0, this.options.width, this.options.height);
            this.viewport.getContext('2d').putImageData(this._filter(this._buffer.getContext('2d').getImageData(0, 0, this.options.width, this.options.height)), 0, 0);
          }

          // creates the css filter effects on the viewport
          let filters = this.options.opacity !== defaults.opacity ? 'opacity(' + this.options.opacity + ') ' : '';
          filters += this.options.brightness !== defaults.brightness ? 'brightness(' + this.options.brightness + ') ' : '';
          filters += this.options.contrast !== defaults.contrast ? 'contrast(' + this.options.contrast + ') ' : '';
          filters += this.options.saturation !== defaults.saturation ? 'saturate(' + this.options.saturation + ') ' : '';
          filters += this.options.hue !== defaults.hue ? 'hue-rotate(' + this.options.hue + 'deg) ' : '';
          filters += this.options.invert !== defaults.invert ? 'invert(' + this.options.invert + ') ' : '';
          filters += this.options.grayscale !== defaults.grayscale ? 'grayscale(' + this.options.grayscale + ') ' : '';
          filters += this.options.sepia !== defaults.sepia ? 'sepia(' + this.options.sepia + ') ' : '';
          filters += this.options.blur !== defaults.blur ? 'blur(' + this.options.blur + 'px) ' : '';
          filters += this.options.url !== defaults.url ? 'url(' + this.options.url + ') ' : '';

          // applies the css filter effects on the viewport
          if (filters !== '' && this._css !== filters) {
            this.viewport.style.filter = filters;
            this._css = filters;
          } else if (filters === '') {
            this.viewport.style.filter = '';
            this._css = '';
          }

          // applies the css mirror mode on the viewport
          this.viewport.style.transform = this.options.mirror === true ? 'scale(-1, 1)' : '';

          // makes this function run at 60fps
          requestAnimationFrame(loop);
        };

        // renders the first frame
        requestAnimationFrame(loop);

        if (typeof this.options.done === 'function') {
          this.options.done();
        }
      }).catch((exception) => {
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
  _filter(image) {

    // gets the image data
    let data = image.data;

    // prevents from filtering errors
    try {

      // loops through all pixels and applies the filter
      for (let y = 0; y < this.options.height; y++) {
        for (let x = 0; x < this.options.width; x++) {

          // detects the pixel offset
          const offset = ((this.options.width * y) + x) * 4;

          // calls the filter
          const filter = this.options.filter({
            'offset': offset,
            'x': x,
            'y': y,
            'red': data[offset],
            'green': data[offset + 1],
            'blue': data[offset + 2],
            'alpha': data[offset + 3]
          });

          // applies the filter
          data[offset] = filter[0];
          data[offset + 1] = filter[1];
          data[offset + 2] = filter[2];
          data[offset + 3] = filter[3];
        }
      }

      return image;
    } catch(exception) {
      throw new Error('Invalid filter, you need to return a valid [red, green, blue, alpha] pixel array');
    }
  }

  // snaps and crops the viewport to return image data
  snap(left = 0, top = 0, width = this.options.width, height = this.options.height) {
    return this.viewport.getContext('2d').getImageData(left, top, width, height);
  }

  // saves the viewport to a specific image file format : png and high quality by default
  save(format = 'png', quality = '1') {
    return this.viewport.toDataURL('image/' + format, quality);
  }
}
