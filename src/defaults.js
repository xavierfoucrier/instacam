'use strict';

// default options
export let defaults = {

  // {Number} width of the viewport element
  width: 400,

  // {Number} height of the viewport element
  height: 300,

  // {Boolean} true|false, defines if the camera video stream is enabled
  camera: true,

  // {Number} refresh rate in frames per second of the camera video stream
  framerate: 30,

  // {Number} ratio of the camera video stream
  ratio: 4 / 3,

  // {Boolean} true|false, defines if the camera audio stream is enabled
  sound: false,

  // {Number} [0..100] volume of the camera audio stream
  volume: 100,

  // {Boolean} true|false, mirror mode of the viewport (css transform)
  mirror: false,

  // {Number} [0..1] opacity of the viewport (css)
  opacity: 1,

  // {Number} [0..*] brightness of the viewport (css filter)
  brightness: 1,

  // {Number} [0..*] contrast of the viewport (css filter)
  contrast: 1,

  // {Number} [0..*] saturation of the viewport (css filter)
  saturation: 1,

  // {Number} [0..360] hue of the viewport (css filter)
  hue: 0,

  // {Number} [0..1] inverts the color of the viewport (css filter)
  invert: 0,

  // {Number} [0..1] grayscale of the viewport (css filter)
  grayscale: 0,

  // {Number} [0..1] sepia of the viewport (css filter)
  sepia: 0,

  // {Number} [0..*] blur of the viewport (css filter)
  blur: 0,

  // {String} svg filtering of the viewport (css filter)
  url: '',

  // {Function} custom filter applied to the viewport
  filter: null,

  // {Function} callback's method used when the stream is fully captured
  done: null,

  // {Function} callback's method used when the stream capture fails
  fail: null,

  // {Function} callback's method used when a browser doesn't support the requirements
  unsupported: null
};
