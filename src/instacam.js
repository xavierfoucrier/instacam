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
    this._options = Object.assign({}, defaults, options);

    // checks for browser support
    if (!requirement) {
      if (typeof this._options.unsupported === 'function') {
        this._options.unsupported();
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
    this.viewport.width = this._options.width;
    this.viewport.height = this._options.height;

    // creates the media element
    this._media = document.createElement('video');

    // sets some media element properties
    this._media.style.display = 'none';
    this._media.autoplay = true;
    this._media.width = this._options.width;
    this._media.height = this._options.height;

    // attaches the media element to the DOM
    this.viewport.parentNode.insertBefore(this._media, this.viewport.nextSibling);

    // applies the css mirror mode on the viewport
    this.mirror = this._options.mirror;

    // autostart the stream capture depending on the options
    if (this._options.autostart === true) {

      // computes the css filter options
      this._compute();

      // captures the device stream
      this._capture();
    }
  }

  /**
    Captures the media stream to the viewport through getUserMedia API
  */
  _capture() {

    // prevents from streaming errors
    try {

      // captures the media stream
      navigator.mediaDevices.getUserMedia({
        audio: this._options.sound,
        video: (() => {
          if (this._options.camera === false) {
            return false;
          }

          return {
            frameRate: this._options.framerate,
            aspectRatio: this._options.ratio
          };
        })()
      }).then((stream) => {

        // stores the blob stream
        this._stream = stream;

        // captures the blob stream
        this._media.srcObject = stream;

        // sets the volume at start
        this.volume = this._options.volume;

        // animation loop used to properly render the viewport
        const loop = () => {

          // renders the viewport with or without custom filter
          if (typeof this._options.filter !== 'function') {
            this.viewport.getContext('2d').drawImage(this._media, 0, 0, this._options.width, this._options.height);
          } else {

            // uses a buffer when applying a custom filter to prevent the viewport from blinkings or flashes
            if (typeof this._buffer === 'undefined') {
              this._buffer = document.createElement('canvas');
              this._buffer.style.display = 'none';
              this._buffer.width = this._options.width;
              this._buffer.height = this._options.height;
              this.viewport.parentNode.insertBefore(this._buffer, this.viewport.nextSibling);
            }

            this._buffer.getContext('2d').drawImage(this._media, 0, 0, this._options.width, this._options.height);
            this.viewport.getContext('2d').putImageData(this._filter(this._buffer.getContext('2d').getImageData(0, 0, this._options.width, this._options.height)), 0, 0);
          }

          // makes this function run at 60fps
          requestAnimationFrame(loop);
        };

        // renders the first frame
        requestAnimationFrame(loop);

        if (typeof this._options.done === 'function') {
          this._options.done();
        }
      }).catch((exception) => {
        if (typeof this._options.fail === 'function') {
          this._options.fail(exception);
        }
      });
    } catch(exception) {
      if (typeof this._options.fail === 'function') {
        this._options.fail(exception);
      }
    }
  }

  /**
    Computes and applies the css filter effects to the viewport
  */
  _compute() {

    // builds the css layer depending on the options
    this._style = this._options.opacity !== defaults.opacity ? `opacity(${this._options.opacity}) ` : '';
    this._style += this._options.brightness !== defaults.brightness ? `brightness(${this._options.brightness}) ` : '';
    this._style += this._options.contrast !== defaults.contrast ? `contrast(${this._options.contrast}) ` : '';
    this._style += this._options.saturation !== defaults.saturation ? `saturate(${this._options.saturation}) ` : '';
    this._style += this._options.hue !== defaults.hue ? `hue-rotate(${this._options.hue}deg) ` : '';
    this._style += this._options.invert !== defaults.invert ? `invert(${this._options.invert}) ` : '';
    this._style += this._options.grayscale !== defaults.grayscale ? `grayscale(${this._options.grayscale}) ` : '';
    this._style += this._options.sepia !== defaults.sepia ? `sepia(${this._options.sepia}) ` : '';
    this._style += this._options.blur !== defaults.blur ? `blur(${this._options.blur}px) ` : '';
    this._style += this._options.url !== defaults.url ? `url(${this._options.url}) ` : '';

    // applies the css filter effects to the viewport
    this.viewport.style.filter = this._style;

    // builds the blend layer depending on the options
    if (Object.keys(this._options.blend).length !== 0) {

      // creates the blending element
      if (typeof this._blend === 'undefined') {
        this._blend = document.createElement('div');

        // prepends the blending element to the viewport
        this.viewport.parentNode.insertBefore(this._blend, this.viewport);
      }

      // gets the viewport bounds
      const bounds = this.viewport.getBoundingClientRect();

      // sets the blending styles
      this._blend.style = `position:absolute;z-index:1;left:${bounds.left}px;top:${bounds.top}px;width:${bounds.width}px;height:${bounds.height}px;mix-blend-mode:${this._options.blend.mode};background:${this._options.blend.color};pointer-events:none;`;
    } else if (typeof this._blend !== 'undefined') {

      // removes the blend layer from the DOM if there is no blending applied
      this._blend.parentNode.removeChild(this._blend);
      delete this._blend;
    }
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
      for (let y = 0; y < this._options.height; y++) {
        for (let x = 0; x < this._options.width; x++) {

          // detects the pixel offset
          const offset = ((this._options.width * y) + x) * 4;

          // calls the filter
          const filter = this._options.filter({
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
    Starts the stream capture
  */
  start() {

    // computes the css filter options
    this._compute();

    // captures the device stream
    this._capture();
  }

  /**
    Stops the stream capture
  */
  stop() {

    // exits if no stream is active
    if (typeof this._stream === 'undefined') {
      return;
    }

    // loops through all stream tracks (audio + video) and stop them
    this._stream.getTracks().forEach(function(track) {
      track.stop();
    });

    // resets the media element
    this._media.srcObject = null;
  }

  /**
    Snaps and crops the viewport to return image data
    @param {Number} left - left position of the snapping area
    @param {Number} top - top position of the snapping area
    @param {Number} width - width of the snapping area
    @param {Number} height - height of the snapping area
    @returns {Object} image data object containing pixels informations
  */
  snap(left = 0, top = 0, width = this._options.width, height = this._options.height) {

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
    return this._options.volume;
  }

  /**
    Sets the camera volume
    @param {Number} volume - [0..100] volume of the camera audio stream
  */
  set volume(volume) {
    if (typeof volume !== 'number' || volume < 0 || volume > 100) {
      throw new Error('Invalid volume, you need to give a number between 0 and 100');
    }

    this._media.volume = this._options.volume = volume / 100;
  }

  /**
    Gets the camera mirror mode
    @returns {Boolean} true|false, mirror mode of the viewport (css transform)
  */
  get mirror() {
    return this._options.mirror;
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
    this._options.mirror = mirror;
  }

  /**
    Gets the viewport opacity
    @returns {Number} [0..1] opacity of the viewport (css)
  */
  get opacity() {
    return this._options.opacity;
  }

  /**
    Sets the viewport opacity
    @param {Number} opacity - [0..1] opacity of the viewport (css)
  */
  set opacity(opacity) {
    if (typeof opacity !== 'number' || opacity < 0 || opacity > 1) {
      throw new Error('Invalid opacity, you need to give a number between 0 and 1');
    }

    this._options.opacity = opacity;
    this._compute();
  }

  /**
    Gets the viewport brightness
    @returns {Number} [0..*] brightness of the viewport (css filter)
  */
  get brightness() {
    return this._options.brightness;
  }

  /**
    Sets the viewport brightness
    @param {Number} brightness - [0..*] brightness of the viewport (css filter)
  */
  set brightness(brightness) {
    if (typeof brightness !== 'number' || brightness < 0) {
      throw new Error('Invalid brightness, you need to give a number above 0');
    }

    this._options.brightness = brightness;
    this._compute();
  }

  /**
    Gets the viewport contrast
    @returns {Number} [0..*] contrast of the viewport (css filter)
  */
  get contrast() {
    return this._options.contrast;
  }

  /**
    Sets the viewport contrast
    @param {Number} contrast - [0..*] contrast of the viewport (css filter)
  */
  set contrast(contrast) {
    if (typeof contrast !== 'number' || contrast < 0) {
      throw new Error('Invalid contrast, you need to give a number above 0');
    }

    this._options.contrast = contrast;
    this._compute();
  }

  /**
    Gets the viewport saturation
    @returns {Number} [0..*] saturation of the viewport (css filter)
  */
  get saturation() {
    return this._options.saturation;
  }

  /**
    Sets the viewport saturation
    @param {Number} saturation - [0..*] saturation of the viewport (css filter)
  */
  set saturation(saturation) {
    if (typeof saturation !== 'number' || saturation < 0) {
      throw new Error('Invalid saturation, you need to give a number above 0');
    }

    this._options.saturation = saturation;
    this._compute();
  }

  /**
    Gets the viewport hue
    @returns {Number} [0..360] hue of the viewport (css filter)
  */
  get hue() {
    return this._options.hue;
  }

  /**
    Sets the viewport hue
    @param {Number} hue - [0..360] hue of the viewport (css filter)
  */
  set hue(hue) {
    if (typeof hue !== 'number' || hue < 0 || hue > 360) {
      throw new Error('Invalid hue, you need to give a number between 0 and 360');
    }

    this._options.hue = hue;
    this._compute();
  }

  /**
    Gets the viewport color inversion
    @returns {Number} [0..1] inverts the color of the viewport (css filter)
  */
  get invert() {
    return this._options.invert;
  }

  /**
    Sets the viewport color inversion
    @param {Number} invert - [0..1] inverts the color of the viewport (css filter)
  */
  set invert(invert) {
    if (typeof invert !== 'number' || invert < 0 || invert > 1) {
      throw new Error('Invalid invert, you need to give a number between 0 and 1');
    }

    this._options.invert = invert;
    this._compute();
  }

  /**
    Gets the viewport grayscale
    @returns {Number} [0..1] grayscale of the viewport (css filter)
  */
  get grayscale() {
    return this._options.grayscale;
  }

  /**
    Sets the viewport grayscale
    @param {Number} grayscale - [0..1] grayscale of the viewport (css filter)
  */
  set grayscale(grayscale) {
    if (typeof grayscale !== 'number' || grayscale < 0 || grayscale > 1) {
      throw new Error('Invalid grayscale, you need to give a number between 0 and 1');
    }

    this._options.grayscale = grayscale;
    this._compute();
  }

  /**
    Gets the viewport sepia
    @returns {Number} [0..1] sepia of the viewport (css filter)
  */
  get sepia() {
    return this._options.sepia;
  }

  /**
    Sets the viewport sepia
    @param {Number} sepia - [0..1] sepia of the viewport (css filter)
  */
  set sepia(sepia) {
    if (typeof sepia !== 'number' || sepia < 0 || sepia > 1) {
      throw new Error('Invalid sepia, you need to give a number between 0 and 1');
    }

    this._options.sepia = sepia;
    this._compute();
  }

  /**
    Gets the viewport blur
    @returns {Number} [0..*] blur of the viewport (css filter)
  */
  get blur() {
    return this._options.blur;
  }

  /**
    Sets the viewport blur
    @param {Number} blur - [0..*] blur of the viewport (css filter)
  */
  set blur(blur) {
    if (typeof blur !== 'number' || blur < 0) {
      throw new Error('Invalid blur, you need to give a number above 0');
    }

    this._options.blur = blur;
    this._compute();
  }

  /**
    Gets the viewport svg filtering
    @returns {String} svg filtering of the viewport (css filter)
  */
  get url() {
    return this._options.url;
  }

  /**
    Sets the viewport svg filtering
    @param {String} url - svg filtering of the viewport (css filter)
  */
  set url(url) {
    if (typeof url !== 'string') {
      throw new Error('Invalid url, you need to give a string');
    }

    this._options.url = url;
    this._compute();
  }

  /**
    Gets the viewport blend layer
    @returns {Object} blend layer of the viewport (css mix blend mode)
  */
  get blend() {
    return this._options.blend;
  }

  /**
    Sets the viewport blend layer
    @param {Object} blend - blend layer of the viewport (css mix blend mode)
  */
  set blend(blend) {
    if (typeof blend !== 'object') {
      throw new Error('Invalid blend, you need to give a valid object with {mode|color} or an empty object to disable blending');
    }

    this._options.blend = blend;
    this._compute();
  }

  /**
    Gets the custom filter
    @returns {Function} custom filter of the viewport
  */
  get filter() {
    return this._options.filter;
  }

  /**
    Sets the custom filter
    @param {Function} filter - custom filter applied to the viewport
  */
  set filter(filter) {
    if (filter !== null && typeof filter !== 'function') {
      throw new Error('Invalid filter, you need to give a function or null to disable the custom filtering');
    }

    this._options.filter = filter;
  }

  /**
    Gets style applied to the viewport
    @returns {Array} style applied to the viewport (css)
  */
  get style() {
    return this._style.length !== 0 ? this._style.trim().split(' ') : [];
  }

  /**
    Gets the current camera audio/video hardware data
    @returns {Object} hardware informations from the current audio/video tracks
  */
  get hardware() {

    // returns null if no stream is active
    if (typeof this._stream === 'undefined') {
      return null;
    }

    // gets the current audio and video tracks
    let audio = this._stream.getAudioTracks().filter(track => track.readyState === 'live')[0];
    let video = this._stream.getVideoTracks().filter(track => track.readyState === 'live')[0];

    // creates the hardware object
    return {
      audio: typeof audio === 'undefined' ? null : {
        id: audio.id,
        name: audio.label
      },
      video: typeof video === 'undefined' ? null : {
        id: video.id,
        name: video.label
      }
    };
  }
}
