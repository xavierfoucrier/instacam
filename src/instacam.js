'use strict';

import defaults from './defaults.js';
import requirement from './support.js';

export default class Instacam {

  /**
    Class constructor
    @param {Object} viewport - selector or canvas element from the DOM
    @param {Object} properties - custom properties of the class
  */
  constructor(viewport, properties) {

    // assign custom user properties to defaults
    this._props = Object.assign({}, defaults, properties);

    // check for browser support
    if (!requirement) {
      if (typeof this._props.unsupported === 'function') {
        this._props.unsupported();
      }

      return;
    }

    // rewrite the viewport element if the user passed a selector to the constructor
    if (typeof viewport === 'string') {
      viewport = document.querySelector(viewport);
    }

    // check the viewport element
    if (typeof viewport === 'undefined' || viewport === null || viewport.nodeName.toLowerCase() !== 'canvas') {
      throw new Error('Invalid viewport, you need to pass a valid selector or HTML5 canvas element');
    }

    // initialize the viewport
    this.viewport = viewport;

    // create the media element
    this._media = document.createElement('video');
    this._media.setAttribute('data-instacam-stream', '');
    this._media.style.display = 'none';

    // attach the media element to the DOM
    this.viewport.parentNode.insertBefore(this._media, this.viewport.nextSibling);

    // create the container
    this._container = document.createElement('div');
    this._container.setAttribute('data-instacam', '');

    // attach the container element to the DOM
    this.viewport.parentNode.insertBefore(this._container, this.viewport);

    // attach the viewport and media elements to the container
    this._container.appendChild(this.viewport);
    this._container.appendChild(this._media);

    // apply the css mirror mode on the viewport
    this.mirror = this._props.mirror;

    // autostart the stream capture depending on the properties
    if (this._props.autostart === true) {

      // compute the css filter properties
      this._compute();

      // capture the device stream
      this._capture();
    }
  }

  /**
    Capture the media stream to the viewport through getUserMedia API
  */
  _capture() {

    // prevent from streaming errors
    try {

      // capture the media stream
      navigator.mediaDevices.getUserMedia({
        audio: this._props.sound,
        video: (() => {
          if (this._props.camera === false) {
            return false;
          }

          return {
            width: {
              ideal: this._props.width
            },
            height: {
              ideal: this._props.height
            },
            frameRate: this._props.framerate,
            aspectRatio: this._props.ratio,
            facingMode: this._props.mode === 'front' ? 'user' : 'environment'
          };
        })()
      }).then((stream) => {

        // store the blob stream
        this._stream = stream;

        // capture the blob stream
        this._media.srcObject = stream;
        this._media.play();

        // set the viewport size when the stream is ready
        this._media.addEventListener('loadeddata', () => {
          this.viewport.width = this._media.videoWidth;
          this.viewport.height = this._media.videoHeight;
        });

        // set the volume at start
        this.volume = this._props.volume;

        // animation loop used to properly render the viewport
        const loop = () => {

          // render the viewport with or without custom filter
          if (typeof this._props.filter !== 'function') {
            this.viewport.getContext('2d').drawImage(this._media, 0, 0, this._props.width, this._props.height);
          } else {

            // use a buffer when applying a custom filter to prevent the viewport from blinking or flashing
            if (typeof this._buffer === 'undefined') {
              this._buffer = document.createElement('canvas');
              this._buffer.setAttribute('data-instacam-buffer', '');
              this._buffer.style.display = 'none';
              this._buffer.width = this._props.width;
              this._buffer.height = this._props.height;
              this.viewport.parentNode.insertBefore(this._buffer, this.viewport.nextSibling);
            }

            this._buffer.getContext('2d').drawImage(this._media, 0, 0, this._props.width, this._props.height);
            this.viewport.getContext('2d').putImageData(this._filter(this._buffer.getContext('2d').getImageData(0, 0, this._props.width, this._props.height)), 0, 0);
          }

          // make this function run at 60fps
          requestAnimationFrame(loop);
        };

        // render the first frame
        requestAnimationFrame(loop);

        if (typeof this._props.done === 'function') {
          this._props.done();
        }
      }).catch((exception) => {
        if (typeof this._props.fail === 'function') {
          this._props.fail(exception);
        }
      });
    } catch(exception) {
      if (typeof this._props.fail === 'function') {
        this._props.fail(exception);
      }
    }
  }

  /**
    Compute and apply the css filter effects to the viewport
  */
  _compute() {

    // build the css layer depending on the properties
    this._style = this._props.opacity !== defaults.opacity ? `opacity(${this._props.opacity}) ` : '';
    this._style += this._props.brightness !== defaults.brightness ? `brightness(${this._props.brightness}) ` : '';
    this._style += this._props.contrast !== defaults.contrast ? `contrast(${this._props.contrast}) ` : '';
    this._style += this._props.saturation !== defaults.saturation ? `saturate(${this._props.saturation}) ` : '';
    this._style += this._props.hue !== defaults.hue ? `hue-rotate(${this._props.hue}deg) ` : '';
    this._style += this._props.invert !== defaults.invert ? `invert(${this._props.invert}) ` : '';
    this._style += this._props.grayscale !== defaults.grayscale ? `grayscale(${this._props.grayscale}) ` : '';
    this._style += this._props.sepia !== defaults.sepia ? `sepia(${this._props.sepia}) ` : '';
    this._style += this._props.blur !== defaults.blur ? `blur(${this._props.blur}px) ` : '';
    this._style += this._props.url !== defaults.url ? `url(${this._props.url}) ` : '';

    // apply the css filter effects to the viewport
    this.viewport.style.filter = this._style;

    // build the blend layer depending on the properties
    if (Object.keys(this._props.blend).length !== 0) {

      // create the blending element
      if (typeof this._blend === 'undefined') {
        this._blend = document.createElement('div');
        this._blend.setAttribute('data-instacam-blend', '');

        // prepend the blending element to the viewport
        this.viewport.parentNode.insertBefore(this._blend, this.viewport);
      }

      // get the viewport bounds
      const bounds = this.viewport.getBoundingClientRect();

      // set the blending styles
      this._blend.style = `position:absolute;z-index:1;width:${bounds.width}px;height:${bounds.height}px;mix-blend-mode:${this._props.blend.mode};background:${this._props.blend.color};pointer-events:none;`;
    } else if (typeof this._blend !== 'undefined') {

      // remove the blend layer from the DOM if there is no blending applied
      this._blend.parentNode.removeChild(this._blend);
      delete this._blend;
    }
  }

  /**
    Apply a custom filter to the viewport
    @param {Object} image - image object from the canvas element
    @return {Object} image data object containing pixels informations
  */
  _filter(image) {

    // get the image data
    let data = image.data;

    // prevent from filtering errors
    try {

      // loop through all pixels and apply the filter
      for (let y = 0; y < this._props.height; y++) {
        for (let x = 0; x < this._props.width; x++) {

          // detect the pixel offset
          const offset = ((this._props.width * y) + x) * 4;

          // call the filter
          const filter = this._props.filter({
            'offset': offset,
            'x': x,
            'y': y,
            'red': data[offset],
            'green': data[offset + 1],
            'blue': data[offset + 2],
            'alpha': data[offset + 3]
          });

          // apply the filter
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
    Start the stream capture
  */
  start() {

    // compute the css filter properties
    this._compute();

    // capture the device stream
    this._capture();
  }

  /**
    Stop the stream capture
  */
  stop() {

    // exit if no stream is active
    if (typeof this._stream === 'undefined') {
      return;
    }

    // loop through all stream tracks (audio + video) and stop them
    this._stream.getTracks().forEach(function(track) {
      track.stop();
    });

    // reset the media element
    this._media.srcObject = null;
  }

  /**
    Snap and crop the viewport to return image data
    @param {Number} left - left position of the snapping area
    @param {Number} top - top position of the snapping area
    @param {Number} width - width of the snapping area
    @param {Number} height - height of the snapping area
    @return {Object} image data object containing pixels informations
  */
  snap(left = 0, top = 0, width = this._props.width, height = this._props.height) {

    // check the snap size area
    if (width <= 0 || height <= 0) {
      throw new Error('Invalid snap area, you need to specify a positive width and height for your image capture');
    }

    return this.viewport.getContext('2d').getImageData(left, top, width, height);
  }

  /**
    Save the viewport to a specific image file format
    @param {String} format - png|jpeg|webp image file format
    @param {Number} quality - [0..1] image quality
    @return {String} UTF-16 data image URI (DOMString)
  */
  save(format = 'png', quality = 1) {
    return this.viewport.toDataURL('image/' + format, quality);
  }

  /**
    Mute the microphone
  */
  mute() {
    this._props.muted = this._media.muted = true;
  }

  /**
    Unmute the microphone
  */
  unmute() {
    this._props.muted = this._media.muted = false;
  }

  /**
    Get the camera facing mode
    @return {String} front|back facing mode of the camera
  */
  get mode() {
    return this._props.mode;
  }

  /**
    Set the camera facing mode
    @param {String} mode - front|back facing mode of the camera
  */
  set mode(mode) {
    if (typeof mode !== 'string' || (mode !== 'front' && mode !== 'back')) {
      throw new Error('Invalid facing mode, you need to give a valid string front|back');
    }

    this._props.mode = mode;

    // stop all video tracks
    this._stream.getVideoTracks().forEach(function(track) {
      track.stop();
    });

    // restart the capture
    this._capture();
  }

  /**
    Get the microphone mute state
    @return {Boolean} true|false microphone mute state
  */
  get muted() {
    return this._media.muted;
  }

  /**
    Get the camera volume
    @return {Number} [0..100] volume of the camera audio stream
  */
  get volume() {
    return this._props.volume;
  }

  /**
    Set the camera volume
    @param {Number} volume - [0..100] volume of the camera audio stream
  */
  set volume(volume) {
    if (typeof volume !== 'number' || volume < 0 || volume > 100) {
      throw new Error('Invalid volume, you need to give a number between 0 and 100');
    }

    this._media.volume = this._props.volume = volume / 100;
  }

  /**
    Get the camera mirror mode
    @return {Boolean} true|false, mirror mode of the viewport (css transform)
  */
  get mirror() {
    return this._props.mirror;
  }

  /**
    Set the camera mirror mode
    @param {Boolean} mirror - true|false, mirror mode of the viewport (css transform)
  */
  set mirror(mirror) {
    if (typeof mirror !== 'boolean') {
      throw new Error('Invalid mirror mode, you need to give a boolean to enable or disable the mirror mode');
    }

    let transform = getComputedStyle(this.viewport).getPropertyValue('transform');
    transform = transform !== 'none' ? transform : '';

    this.viewport.style.transform = mirror === true ? `${transform} scale(-1, 1)` : '';
    this._props.mirror = mirror;
  }

  /**
    Get the viewport opacity
    @return {Number} [0..1] opacity of the viewport (css)
  */
  get opacity() {
    return this._props.opacity;
  }

  /**
    Set the viewport opacity
    @param {Number} opacity - [0..1] opacity of the viewport (css)
  */
  set opacity(opacity) {
    if (typeof opacity !== 'number' || opacity < 0 || opacity > 1) {
      throw new Error('Invalid opacity, you need to give a number between 0 and 1');
    }

    this._props.opacity = opacity;
    this._compute();
  }

  /**
    Get the viewport brightness
    @return {Number} [0..*] brightness of the viewport (css filter)
  */
  get brightness() {
    return this._props.brightness;
  }

  /**
    Set the viewport brightness
    @param {Number} brightness - [0..*] brightness of the viewport (css filter)
  */
  set brightness(brightness) {
    if (typeof brightness !== 'number' || brightness < 0) {
      throw new Error('Invalid brightness, you need to give a number above 0');
    }

    this._props.brightness = brightness;
    this._compute();
  }

  /**
    Get the viewport contrast
    @return {Number} [0..*] contrast of the viewport (css filter)
  */
  get contrast() {
    return this._props.contrast;
  }

  /**
    Set the viewport contrast
    @param {Number} contrast - [0..*] contrast of the viewport (css filter)
  */
  set contrast(contrast) {
    if (typeof contrast !== 'number' || contrast < 0) {
      throw new Error('Invalid contrast, you need to give a number above 0');
    }

    this._props.contrast = contrast;
    this._compute();
  }

  /**
    Get the viewport saturation
    @return {Number} [0..*] saturation of the viewport (css filter)
  */
  get saturation() {
    return this._props.saturation;
  }

  /**
    Set the viewport saturation
    @param {Number} saturation - [0..*] saturation of the viewport (css filter)
  */
  set saturation(saturation) {
    if (typeof saturation !== 'number' || saturation < 0) {
      throw new Error('Invalid saturation, you need to give a number above 0');
    }

    this._props.saturation = saturation;
    this._compute();
  }

  /**
    Get the viewport hue
    @return {Number} [0..360] hue of the viewport (css filter)
  */
  get hue() {
    return this._props.hue;
  }

  /**
    Set the viewport hue
    @param {Number} hue - [0..360] hue of the viewport (css filter)
  */
  set hue(hue) {
    if (typeof hue !== 'number' || hue < 0 || hue > 360) {
      throw new Error('Invalid hue, you need to give a number between 0 and 360');
    }

    this._props.hue = hue;
    this._compute();
  }

  /**
    Get the viewport color inversion
    @return {Number} [0..1] invert the color of the viewport (css filter)
  */
  get invert() {
    return this._props.invert;
  }

  /**
    Set the viewport color inversion
    @param {Number} invert - [0..1] invert the color of the viewport (css filter)
  */
  set invert(invert) {
    if (typeof invert !== 'number' || invert < 0 || invert > 1) {
      throw new Error('Invalid invert, you need to give a number between 0 and 1');
    }

    this._props.invert = invert;
    this._compute();
  }

  /**
    Get the viewport grayscale
    @return {Number} [0..1] grayscale of the viewport (css filter)
  */
  get grayscale() {
    return this._props.grayscale;
  }

  /**
    Set the viewport grayscale
    @param {Number} grayscale - [0..1] grayscale of the viewport (css filter)
  */
  set grayscale(grayscale) {
    if (typeof grayscale !== 'number' || grayscale < 0 || grayscale > 1) {
      throw new Error('Invalid grayscale, you need to give a number between 0 and 1');
    }

    this._props.grayscale = grayscale;
    this._compute();
  }

  /**
    Get the viewport sepia
    @return {Number} [0..1] sepia of the viewport (css filter)
  */
  get sepia() {
    return this._props.sepia;
  }

  /**
    Set the viewport sepia
    @param {Number} sepia - [0..1] sepia of the viewport (css filter)
  */
  set sepia(sepia) {
    if (typeof sepia !== 'number' || sepia < 0 || sepia > 1) {
      throw new Error('Invalid sepia, you need to give a number between 0 and 1');
    }

    this._props.sepia = sepia;
    this._compute();
  }

  /**
    Get the viewport blur
    @return {Number} [0..*] blur of the viewport (css filter)
  */
  get blur() {
    return this._props.blur;
  }

  /**
    Set the viewport blur
    @param {Number} blur - [0..*] blur of the viewport (css filter)
  */
  set blur(blur) {
    if (typeof blur !== 'number' || blur < 0) {
      throw new Error('Invalid blur, you need to give a number above 0');
    }

    this._props.blur = blur;
    this._compute();
  }

  /**
    Get the viewport svg filtering
    @return {String} svg filtering of the viewport (css filter)
  */
  get url() {
    return this._props.url;
  }

  /**
    Set the viewport svg filtering
    @param {String} url - svg filtering of the viewport (css filter)
  */
  set url(url) {
    if (typeof url !== 'string') {
      throw new Error('Invalid url, you need to give a string');
    }

    this._props.url = url;
    this._compute();
  }

  /**
    Get the viewport blend layer
    @return {Object} blend layer of the viewport (css mix blend mode)
  */
  get blend() {
    return this._props.blend;
  }

  /**
    Set the viewport blend layer
    @param {Object} blend - blend layer of the viewport (css mix blend mode)
  */
  set blend(blend) {
    if (typeof blend !== 'object') {
      throw new Error('Invalid blend, you need to give a valid object with {mode|color} or an empty object to disable blending');
    }

    this._props.blend = blend;
    this._compute();
  }

  /**
    Get the custom filter
    @return {Function} custom filter of the viewport
  */
  get filter() {
    return this._props.filter;
  }

  /**
    Set the custom filter
    @param {Function} filter - custom filter applied to the viewport
  */
  set filter(filter) {
    if (filter !== null && typeof filter !== 'function') {
      throw new Error('Invalid filter, you need to give a function or null to disable the custom filtering');
    }

    this._props.filter = filter;
  }

  /**
    Get style applied to the viewport
    @return {Array} style applied to the viewport (css)
  */
  get style() {
    return this._style.length !== 0 ? this._style.trim().split(' ') : [];
  }

  /**
    Get the current camera audio/video hardware data
    @return {Object} hardware informations from the current audio/video tracks
  */
  get hardware() {

    // return null if no stream is active
    if (typeof this._stream === 'undefined') {
      return null;
    }

    // get the current audio and video tracks
    let audio = this._stream.getAudioTracks().filter(track => track.readyState === 'live')[0];
    let video = this._stream.getVideoTracks().filter(track => track.readyState === 'live')[0];

    // create the hardware object
    return {
      audio: typeof audio === 'undefined' ? null : {
        id: audio.id,
        name: audio.label,
        track: audio
      },
      video: typeof video === 'undefined' ? null : {
        id: video.id,
        name: video.label,
        track: video
      }
    };
  }
}
