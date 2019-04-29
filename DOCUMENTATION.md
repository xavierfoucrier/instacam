# Instacam documentation
Here you will find the documentation describing how to use the module.


## Summary
1. [How it works](#how-it-works)
2. [Markup](#markup)
3. [Usage](#usage)
4. [Properties](#properties)
5. [Methods](#methods)
6. [Callbacks](#callbacks)
7. [Demo](#demo)


## How it works
Instacam allows you to perform **instant canvas video** through the WebRTC API with a fresh touch of CSS filters: this means you can capture the webcam video stream *(media stream)* and broadcast it on an HTML5 `canvas` tag. Unlike the conventional HTML5 `video` tag, Instacam offers you the opportunity to **interact with the broadcasted media stream** by having the possibility to edit each pixels before they are drawn to the canvas. Moreover, Instacam can beautify the media stream by adding a fresh touch of CSS. Don't forget that Instacam only works on browsers that natively support the HTML5 `canvas` tag, `requestAnimationFrame` API, `HTMLMediaElement` API, `navigator.mediaDevices` and `Promises` API.


## Markup
### Viewport
The viewport is a canvas representation of the media stream. Instacam captures the webcam media stream and replicates it on a canvas element, the viewport defined in the query selector must matched **a valid canvas element** to properly replicate the stream. An exception will be thrown on invalid viewport.

```html
<canvas id="canvas1"></canvas>
```


## Usage
### Use with Webpack
Instacam is using the **UMD** *(Unified Module Definition)* pattern, making it capable of working everywhere and compatible with webpack. The module is published on the **NPM** *(Node Package Manager)* registry, so you can install it through the command line interpreter using:

```console
npm install instacam
```

This will **download and install** Instacam into the `node_modules` folder under your project directory. When it's done, you can start to use the module in one of your javascript file like this:

```js
import {Instacam} from 'instacam';

let camera = new Instacam(
  document.querySelector('#canvas1')
);
```

Using webpack has **many advantages** like output compression, code splitting, tree shaking, etc., so I encourage you to use this great tool with Instacam.

### Use with ESM
As of May 2017, all major browsers have shipped a working implementation of **ESM** *(ECMAScript modules)*: this is another way of using Instacam directly in your browser:

```html
<script type="module">
  import {Instacam} from 'src/instacam.js';

  let camera = new Instacam(
    document.querySelector('#canvas1')
  );
</script>
```

### Use as a library
The old way, but still relevant, is to **include the minified production** file on your web page using the generic script markup:

```html
<script src="dist/instacam.min.js"></script>
```

Then **instanciate the class** by using this javascript syntax:

```js
let camera = new Instacam(
  document.querySelector('#canvas1')
);
```

You can also **pass a selector** to the constructor, and Instacam will get the DOM element for you:

```js
let camera = new Instacam('#canvas1');
```

**Custom defined properties** are passed through the second parameter:

```js
let camera = new Instacam(
  document.querySelector('#canvas1'), {
    width: 800,
    height: 600
  }
);
```


## Properties
### Getting property
The class properties are stored in the private `_options` attribute but can be **retrieved easily**. If you want to get the current level of the saturation CSS filter, you can do the following:

```js
// get the saturation (pretend that `camera` is the instance of the Instacam class)
let saturation = camera.saturation;
```

### Setting property
The class properties can be **setted easily**. If you want to set the current level of the brightness CSS filter, you can do the following:

```js
// set the brightness (pretend that `camera` is the instance of the Instacam class)
camera.brightness = 5;
```

### API
Instacam reference that details all properties of the class.

#### width
Type: `Length`
Default: `400`

The width represents **the width of the viewport**. It must fit to the aspect ratio property, by default a **4:3 ratio**, to render a proper image of the media stream, depending on the webcam specifications.

#### height
Type: `Length`
Default: `300`

The height represents **the height of the viewport**. It must fit to the aspect ratio property, by default a **4:3 ratio**, to render a proper image of the media stream, depending on the webcam specifications.

#### autostart
Type: `Boolean`
Default: `true`

The autostart property allows you to **change the start behavior**. By default, Instacam capture the webcam stream when the class is instanciated. If you set this property to `false`, you will need to call the `start()` method to run the capture.

#### camera
Type: `Boolean`
Default: `true`

The camera property allows you to **capture the media stream of the camera**. By default, Instacam only captures media stream from the webcam. If you want to only capture the microphone, you need to set this property to `false` and set the sound property to `true`.

#### mode
Type: `String`
Default: `front`

The mode property allows you to **select the camera used to capture the media stream**. By default, Instacam uses the front camera. If you set the mode to `back` and no camera is found, Instacam will automatically switch to the default one.

#### framerate
Type: `Number`
Default: `30`
Minimum: `1`
Maximum: `None`

The framerate property allows you to **change the refresh rate of the camera**. By default, Instacam will capture the media stream at **30 frames per second**. The maximum framerate depends on the camera capabilities.

#### ratio
Type: `Number`
Default: `4/3`

The ratio property allows you yo **change the aspect ratio of the camera**. It must fit to the width/height ratio to render a proper image of the media stream. You can use float numbers (like 1.1, 1.7) or fractions (like 4/3, 16/9) for better syntax reading.

#### sound
Type: `Boolean`
Default: `false`

The sound property allows you to **capture the audio stream from the microphone**. By default, Instacam only captures media stream from the webcam. If you want to capture both the microphone and the camera, you need to set this property to `true`.

#### muted
Type: `Boolean`
Default: `false`

The muted property **indicate if the microphone is currently muted**.

#### volume
Type: `Number`
Default: `100`
Minimum: `0`
Maximum: `100`

The volume property allows you to **adapt the volume of the microphone**. By default, Instacam sets the volume to 100. Note that you can set the volume at **any time** as soon as the camera is ready.

#### mirror
Type: `Boolean`
Default: `false`
The mirror mode allows you to **flip the viewport horizontally**. This mode uses CSS transform property.

#### opacity
Type: `Number`
Default: `1`
Minimum: `0`
Maximum: `1`

The opacity property applies transparency to the viewport, making it **appear more or less transparent**. A value of 0 is completely transparent. A value of 1 leaves the viewport unchanged. Values between 0 and 1 are linear multipliers on the effect. Some browsers may provide **hardware acceleration** to render the opacity filter for better performance. If omitted, the CSS filter won't be applied.

#### brightness
Type: `Number`
Default: `1`
Minimum: `0`
Maximum: `None`

The brightness property applies a linear multiplier to the viewport, making it **appear more or less bright**. A value of 0 will create an image that is completely black. A value of 1 leaves the viewport unchanged. Other values are linear multipliers on the effect. Values of an amount over 1 are allowed, providing **brighter results**. If omitted, the CSS filter won't be applied.

#### contrast
Type: `Number`
Default: `1`
Minimum: `0`
Maximum: `None`

The contrast property **adjusts the contrast** of the viewport. A value of 0 will create an image that is completely black. A value of 1 leaves the viewport unchanged. Values of amount over 1 are allowed, providing **results with less contrast**. If omitted, the CSS filter won't be applied.

#### saturation
Type: `Number`
Default: `1`
Minimum: `0`
Maximum: `None`

The saturation property **saturates** the viewport. A value of 0 is completely un-saturated. A value of 1 leaves the viewport unchanged. Other values are linear multipliers on the effect. Values of amount over 1 are allowed, providing **super-saturated results**. If omitted, the CSS filter won't be applied.

#### hue
Type: `Number`
Unit: `Degree`
Default: `0`
Minimum: `0`
Maximum: `360`

The hue property **applies a hue rotation** on the viewport. The value of angle defines the number of degrees around the color circle the viewport samples will be adjusted. A value of 0 degree leaves the viewport unchanged. The maximum value is 360 degree. If omitted, the CSS filter won't be applied.

#### invert
Type: `Number`
Default: `0`
Minimum: `0`
Maximum: `1`

The invert property **inverts the samples** in the viewport. A value of 1 is completely inverted. A value of 0 leaves the viewport unchanged. Values between 0 and 1 are linear multipliers on the effect. If omitted, the CSS filter won't be applied.

#### grayscale
Type: `Number`
Default: `0`
Minimum: `0`
Maximum: `1`

The grayscale property **converts the viewport to grayscale**. A value of 1 is completely grayscale. A value of 0 leaves the viewport unchanged. Values between 0 and 1 are linear multipliers on the effect. If omitted, the CSS filter won't be applied.

#### sepia
Type: `Number`
Default: `0`
Minimum: `0`
Maximum: `1`

The sepia property **converts the viewport to sepia**. A value of 1 is completely sepia. A value of 0 leaves the viewport unchanged. Values between 0 and 1 are linear multipliers on the effect. If omitted, the CSS filter won't be applied.

#### blur
Type: `Number`
Unit: `Pixel`
Default: `0`
Minimum: `0`
Maximum: `None`

The blur property **applies a Gaussian blur** to the viewport. The value of radius defines the value of the standard deviation to the Gaussian function, or how many pixels on the screen blend into each other, so **a larger value will create more blur**. The property is specified as a CSS length, but does not accept percentage values. If omitted, the CSS filter won't be applied.

#### url
Type: `String`
Default: `Empty`

The url property takes the **location of an XML file** that specifies an **SVG filter**, and may include an anchor to a specific filter element. If omitted, the CSS filter won't be applied.

#### blend
Type: `Object`
Default: `Empty`

The blend property **applies a CSS mix blend mode filter** to the viewport. You need to define the blend mode and color to enable blending:

```js
blend: {
  mode: 'lighten',
  color: 'darkslateblue'
}
```

To properly blend the viewport, Instacam need to create **a layout above the canvas**. Blending can be disable at any time by simply set the blend property to an empty object `{}`.

#### filter
Type: `Function`
Return: `Array`
Default: `null`

The filter property allows you to applies a **custom filter** to the viewport, that is different than applying a CSS filter. The custom filter brings you the ability to edit each pixels of the media stream before they are drawn to the canvas. This property takes a `Function` with one parameter called `pixel` that corresponds to the current pixel parsed by the **class filtering loop**. On that pixel, you can get some informations like the `offset` *(index of the pixel)*, the `x` and `y` positions, the `red`, `green` and `blue` color components and finally the `alpha` layer. With this informations, you can **edit the pixel properties** and then return the edited informations. The return type of the function must be a pixel, represented by an `Array` with the red, green, blue components and the alpha layer: these new values will erase the previous informations of the pixel and will be drawn to the canvas. You can also **combine several CSS filters with a custom filter** to obtain pretty effects. If omitted, the custom filter won't be applied.

Build a custom filter is very easy, because you can code **your own logic** inside the function, for example:
```js
// grayscale
filter: (pixel) => {
  let g = 0.2126 * pixel.red + 0.7152 * pixel.green + 0.0722 * pixel.blue;
  return [g, g, g, pixel.alpha];
}

// invert
filter: (pixel) => {
  return [255 - pixel.red, 255 - pixel.green, 255 - pixel.blue, pixel.alpha];
}

// threshold
filter: (pixel) => {
  let threshold = 0.2126 * pixel.red
                + 0.7152 * pixel.green
                + 0.0722 * pixel.blue;

  return (threshold >= 100) ? [255, 255, 255, 255] : [0, 0, 0, 255];
}
```

> If you want to contribute and share cool filters, you can send me your code or create a **pull request** on the `gh-pages` branch, and it will be added to the **[Instacam demo site](#demo)**. Thanks for contributing! :tada: :+1:

#### style
Type: `Array`
Return: `Array`
Default: `[]`

The style property returns **styles that are applied to the viewport**.

#### hardware
Type: `Object`
Return: `Object`
Default: `null`

The hardware property returns **a set of hardware informations** from the current audio/video tracks. Note that this property will only be available after camera initialization: if the capture fails, hardware informations won't be accessible.


## Methods
### API
Instacam reference that details all methods of the class.

#### start ( )
Type: `Function`

The start method allows you to **start the capture of the webcam stream**. If the `autostart` parameter is set to `true`, you don't need to call this method, Instacam will do it for you. Note that both camera and sound will be started, depending on the properties you have defined.

```js
camera.start();
```

#### stop ( )
Type: `Function`

The stop method allows you to **stop the capture of the webcam stream**. Note that both camera and sound will be stopped.

```js
camera.stop();
```

#### snap ([ *left, top, width, height* ])
Type: `Function`
Return: `ImageData`

The snap method allows you to **capture image data from a portion of the viewport**. All the parameters are of type `Number`. By default, `left` and `top` are equals to 0, and `width` and `height` are equals to the width and height of the viewport defined in the class properties. If you call this function without parameters, you will get the image data of the entire viewport. **[Take a look at the demo](#demo)** to see how it works.

```js
// capture the entire viewport
let snapshot = camera.snap();

// capture an area of 100x200 from the top left side of the viewport
let snapshot = camera.snap(0, 0, 100, 200);
```

#### save ([ *format, quality* ])
Type: `Function`
Return: `UTF-16 String`

The save method allows you to **save the viewport in a specific image format**. This method returns a `data:` URI, also called `DOMString`, containing a representation of the image in the specified `format`, default is set to `png`. The returned image is at **96dpi**. If the height or width of the viewport is 0, an empty string `data:,` is returned. If the format requested is not `image/png`, and the returned value starts with `data:image/png`, then the requested format is not supported. Chrome supports the `image/webp` format. If the requested format is `image/jpeg` or `image/webp`, then the second argument `quality`, if defined between 0 and 1, is treated as indicating **image quality**. By default, the image quality is set to 1. If you call this function without parameters, you will get a png file of good quality. **[Take a look at the demo](#demo)** to see how it works.

```js
// convert the viewport and returns a DOMString
let data = camera.save('png', 0.75);
```

#### mute ( )
Type: `Function`

 The mute method allows you to **mute the microphone** of the camera. Note that this method will only mute the `<video>` media element rather than disabling the microphone.

```js
camera.mute();
```

#### unmute ( )
Type: `Function`

The unmute method allows your to unmute the microphone of the camera. Note that this method will only mute the `<video>` media element rather than enabling the microphone.

```js
camera.unmute();
```


## Callbacks
### API
Instacam reference that details all callbacks of the class.

#### done ( )
Type: `Function`
Return: `Nothing`
Default: `null`

A callback method **called when the stream is fully captured**. You can override the default method of Instacam by adding your own logic here.

```js
let camera = new Instacam(
  done: () => {
    console.log(`Camera ${camera.hardware.video.name} is ready.`);
  }
);
```

#### fail ( *NavigatorUserMediaError* )
Type: `Function`
Return: `Nothing`
Default: `null`

A callback method **called when the stream capture failed**. You can override the default method of Instacam by adding your own logic here. Note that this function pass an `exception` argument that represent the NavigatorUserMediaError object, allowing you to detect the source of the problem.

```js
let camera = new Instacam(
  failure: (exception) => {
    if (exception.name === 'NotAllowedError') {
      // the user has restricted access to the camera
    }
  }
);
```

> For a full list of exceptions, see the **Mozilla MediaDevices.getUserMedia** reference
> https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#Exceptions

#### unsupported ( )
Type: `Function`
Return: `Nothing`
Default: `null`

A callback method **called when a browser doesn't support a required API** to properly work. You can override the default method of Instacam by adding your own logic here.

```js
let camera = new Instacam(
  unsupported: () => {
    // the browser does not match the requirements
  }
);
```


## Demo
This site is hosted on Github pages and allow you to play with **most Instacam properties**: display the camera, add pretty CSS and custom filters simultaneously, capture and export the image in different formats. You will need to **allow the site to access your camera** in order to use the library.

📷 [Play with Instacam](https://instacam.js.org)

> Note that this demo is using **vanilla javascript** and the latest version of Instacam from the **NPM registry**. Don't forget to read the **[compatibility section](README.md#compatibility)** before diving into the library.
