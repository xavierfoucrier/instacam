'use strict';

import {defaults} from './defaults.js';
import {requirement} from './support.js';

export class Instacam {

  /**
    Class constructor
    @param {Object} viewport - selector or canvas element from the DOM
    @param {Object} options - custom options of the class
  */
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

    // rewrites the viewport element if the user passed a selector to the constructor
    if (typeof viewport === 'string') {
      viewport = document.querySelector(viewport);
    }

    // checks the viewport element
    if (typeof viewport === 'undefined' || viewport === null || viewport.nodeName.toLowerCase() !== 'canvas') {
      throw new Error('Invalid viewport, you need to pass a valid selector or HTML5 canvas element');
    }

    // initializes the viewport
    this.viewport = viewport;
    this.viewport.width = this.options.width;
    this.viewport.height = this.options.height;

    // creates the media element
    this.media = document.createElement('video');

    // sets some media element properties
    this.media.style.display = 'none';
    this.media.autoplay = true;
    this.media.width = this.options.width;
    this.media.height = this.options.height;

    // attaches the media element to the DOM
    this.viewport.parentNode.insertBefore(this.media, this.viewport.nextSibling);

    // applies the css mirror mode on the viewport
    this.mirror = this.options.mirror;

    // computes the css filter options
    this._compute();

    // captures the webcam stream
    this._capture();
  }

  /**
    Captures the media stream to the viewport through getUserMedia API
  */
  _capture() {

    // prevents from streaming errors
    try {

      // captures the media stream
      navigator.mediaDevices.getUserMedia({
        audio: this.options.sound,
        video: (() => {
          if (this.options.camera === false) {
            return false;
          }

          return {
            frameRate: this.options.framerate,
            aspectRatio: this.options.ratio
          };
        })()
      }).then((stream) => {

        // captures the blob stream
        this.media.srcObject = stream;

        // sets the volume at start
        this.volume = this.options.volume;

        // animation loop used to properly render the viewport
        const loop = () => {

          // renders the viewport with or without custom filter
          if (typeof this.options.filter !== 'function') {
            this.viewport.getContext('2d').drawImage(this.media, 0, 0, this.options.width, this.options.height);
          } else {

            // uses a buffer when applying a custom filter to prevent the viewport from blinkings or flashes
            if (typeof this._buffer === 'undefined') {
              this._buffer = document.createElement('canvas');
              this._buffer.style.display = 'none';
              this._buffer.width = this.options.width;
              this._buffer.height = this.options.height;
              this.viewport.parentNode.insertBefore(this._buffer, this.viewport.nextSibling);
            }

            this._buffer.getContext('2d').drawImage(this.media, 0, 0, this.options.width, this.options.height);
            this.viewport.getContext('2d').putImageData(this._filter(this._buffer.getContext('2d').getImageData(0, 0, this.options.width, this.options.height)), 0, 0);
          }

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

  /**
    Computes and applies the css filter effects to the viewport
  */
  _compute() {

    // builds the css layer depending on the options
    this._style = this.options.opacity !== defaults.opacity ? `opacity(${this.options.opacity}) ` : '';
    this._style += this.options.brightness !== defaults.brightness ? `brightness(${this.options.brightness}) ` : '';
    this._style += this.options.contrast !== defaults.contrast ? `contrast(${this.options.contrast}) ` : '';
    this._style += this.options.saturation !== defaults.saturation ? `saturate(${this.options.saturation}) ` : '';
    this._style += this.options.hue !== defaults.hue ? `hue-rotate(${this.options.hue}deg) ` : '';
    this._style += this.options.invert !== defaults.invert ? `invert(${this.options.invert}) ` : '';
    this._style += this.options.grayscale !== defaults.grayscale ? `grayscale(${this.options.grayscale}) ` : '';
    this._style += this.options.sepia !== defaults.sepia ? `sepia(${this.options.sepia}) ` : '';
    this._style += this.options.blur !== defaults.blur ? `blur(${this.options.blur}px) ` : '';
    this._style += this.options.url !== defaults.url ? `url(${this.options.url}) ` : '';

    // applies the css filter effects to the viewport
    this.viewport.style.filter = this._style;
  }

  /**
    Applies a custom filter to the viewport
    @param {Object} image - image object from the canvas element
    @returns {Object} image data object containing pixels informations
  */
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

  /**
    Snaps and crops the viewport to return image data
    @param {Number} left - left position of the snapping area
    @param {Number} top - top position of the snapping area
    @param {Number} width - width of the snapping area
    @param {Number} height - height of the snapping area
    @returns {Object} image data object containing pixels informations
  */
  snap(left = 0, top = 0, width = this.options.width, height = this.options.height) {

    // checks the snap size area
    if (width <= 0 || height <= 0) {
      throw new Error('Invalid snap area, you need to specify a positive width and height for your image capture');
    }

    return this.viewport.getContext('2d').getImageData(left, top, width, height);
  }

  /**
    Saves the viewport to a specific image file format
    @param {String} format - png|jpeg|webp image file format
    @param {Number} quality - [0..1] image quality
    @returns {String} UTF-16 data image URI (DOMString)
  */
  save(format = 'png', quality = 1) {
    return this.viewport.toDataURL('image/' + format, quality);
  }

  /**
    Gets the camera volume
    @returns {Number} [0..100] volume of the camera audio stream
  */
  get volume() {
    return this.options.volume;
  }

  /**
    Sets the camera volume
    @param {Number} volume - [0..100] volume of the camera audio stream
  */
  set volume(volume) {
    if (typeof volume !== 'number' || volume < 0 || volume > 100) {
      throw new Error('Invalid volume, you need to give a number between 0 and 100');
    }

    this.media.volume = this.options.volume = volume / 100;
  }

  /**
    Gets the camera mirror mode
    @returns {Boolean} true|false, mirror mode of the viewport (css transform)
  */
  get mirror() {
    return this.options.mirror;
  }

  /**
    Sets the camera mirror mode
    @param {Boolean} mirror - true|false, mirror mode of the viewport (css transform)
  */
  set mirror(mirror) {
    if (typeof mirror !== 'boolean') {
      throw new Error('Invalid mirror mode, you need to give a boolean to enable or disable the mirror mode');
    }

    let transform = getComputedStyle(this.viewport).getPropertyValue('transform');
    transform = transform !== 'none' ? transform : '';

    this.viewport.style.transform = mirror === true ? `${transform} scale(-1, 1)` : '';
    this.options.mirror = mirror;
  }

  /**
    Gets the viewport opacity
    @returns {Number} [0..1] opacity of the viewport (css)
  */
  get opacity() {
    return this.options.opacity;
  }

  /**
    Sets the viewport opacity
    @param {Number} opacity - [0..1] opacity of the viewport (css)
  */
  set opacity(opacity) {
    if (typeof opacity !== 'number' || opacity < 0 || opacity > 1) {
      throw new Error('Invalid opacity, you need to give a number between 0 and 1');
    }

    this.options.opacity = opacity;
    this._compute();
  }

  /**
    Gets the viewport brightness
    @returns {Number} [0..*] brightness of the viewport (css filter)
  */
  get brightness() {
    return this.options.brightness;
  }

  /**
    Sets the viewport brightness
    @param {Number} brightness - [0..*] brightness of the viewport (css filter)
  */
  set brightness(brightness) {
    if (typeof brightness !== 'number' || brightness < 0) {
      throw new Error('Invalid brightness, you need to give a number above 0');
    }

    this.options.brightness = brightness;
    this._compute();
  }

  /**
    Gets the viewport contrast
    @returns {Number} [0..*] contrast of the viewport (css filter)
  */
  get contrast() {
    return this.options.contrast;
  }

  /**
    Sets the viewport contrast
    @param {Number} contrast - [0..*] contrast of the viewport (css filter)
  */
  set contrast(contrast) {
    if (typeof contrast !== 'number' || contrast < 0) {
      throw new Error('Invalid contrast, you need to give a number above 0');
    }

    this.options.contrast = contrast;
    this._compute();
  }

  /**
    Gets the viewport saturation
    @returns {Number} [0..*] saturation of the viewport (css filter)
  */
  get saturation() {
    return this.options.saturation;
  }

  /**
    Sets the viewport saturation
    @param {Number} saturation - [0..*] saturation of the viewport (css filter)
  */
  set saturation(saturation) {
    if (typeof saturation !== 'number' || saturation < 0) {
      throw new Error('Invalid saturation, you need to give a number above 0');
    }

    this.options.saturation = saturation;
    this._compute();
  }

  /**
    Gets the viewport hue
    @returns {Number} [0..360] hue of the viewport (css filter)
  */
  get hue() {
    return this.options.hue;
  }

  /**
    Sets the viewport hue
    @param {Number} hue - [0..360] hue of the viewport (css filter)
  */
  set hue(hue) {
    if (typeof hue !== 'number' || hue < 0 || hue > 360) {
      throw new Error('Invalid hue, you need to give a number between 0 and 360');
    }

    this.options.hue = hue;
    this._compute();
  }

  /**
    Gets the viewport color inversion
    @returns {Number} [0..1] inverts the color of the viewport (css filter)
  */
  get invert() {
    return this.options.invert;
  }

  /**
    Sets the viewport color inversion
    @param {Number} invert - [0..1] inverts the color of the viewport (css filter)
  */
  set invert(invert) {
    if (typeof invert !== 'number' || invert < 0 || invert > 1) {
      throw new Error('Invalid invert, you need to give a number between 0 and 1');
    }

    this.options.invert = invert;
    this._compute();
  }

  /**
    Gets the viewport grayscale
    @returns {Number} [0..1] grayscale of the viewport (css filter)
  */
  get grayscale() {
    return this.options.grayscale;
  }

  /**
    Sets the viewport grayscale
    @param {Number} grayscale - [0..1] grayscale of the viewport (css filter)
  */
  set grayscale(grayscale) {
    if (typeof grayscale !== 'number' || grayscale < 0 || grayscale > 1) {
      throw new Error('Invalid grayscale, you need to give a number between 0 and 1');
    }

    this.options.grayscale = grayscale;
    this._compute();
  }

  /**
    Gets the viewport sepia
    @returns {Number} [0..1] sepia of the viewport (css filter)
  */
  get sepia() {
    return this.options.sepia;
  }

  /**
    Sets the viewport sepia
    @param {Number} sepia - [0..1] sepia of the viewport (css filter)
  */
  set sepia(sepia) {
    if (typeof sepia !== 'number' || sepia < 0 || sepia > 1) {
      throw new Error('Invalid sepia, you need to give a number between 0 and 1');
    }

    this.options.sepia = sepia;
    this._compute();
  }

  /**
    Gets the viewport blur
    @returns {Number} [0..*] blur of the viewport (css filter)
  */
  get blur() {
    return this.options.blur;
  }

  /**
    Sets the viewport blur
    @param {Number} blur - [0..*] blur of the viewport (css filter)
  */
  set blur(blur) {
    if (typeof blur !== 'number' || blur < 0) {
      throw new Error('Invalid blur, you need to give a number above 0');
    }

    this.options.blur = blur;
    this._compute();
  }

  /**
    Gets the viewport svg filtering
    @returns {String} svg filtering of the viewport (css filter)
  */
  get url() {
    return this.options.url;
  }

  /**
    Sets the viewport svg filtering
    @param {String} url - svg filtering of the viewport (css filter)
  */
  set url(url) {
    if (typeof url !== 'string') {
      throw new Error('Invalid url, you need to give a string');
    }

    this.options.url = url;
    this._compute();
  }

  /**
    Gets the custom filter
    @returns {Function} custom filter of the viewport
  */
  get filter() {
    return this.options.filter;
  }

  /**
    Sets the custom filter
    @param {Function} filter - custom filter applied to the viewport
  */
  set filter(filter) {
    if (filter !== null && typeof filter !== 'function') {
      throw new Error('Invalid filter, you need to give a function or null to disable the custom filtering');
    }

    this.options.filter = filter;
  }
}
