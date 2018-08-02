Instacam documentation
=======================
Here you will find the documentation describing on how to use the jQuery plugin.


Summary
-------
1. [How it works](#how-it-works)
2. [Markup](#markup)
3. [Calling](#calling)
4. [Options](#options)
5. [Methods](#methods)
6. [Examples](#examples)
7. [Demos](#demos)


How it works
------------
Instacam allows you to perform **instant canvas video** through the WebRTC API with a fresh touch of CSS filters: this means you can capture the webcam video stream *(media stream)* and broadcast it on an HTML5 `canvas` tag. Unlike the conventional HTML5 `video` tag, Instacam offers you the opportunity to **interact with the broadcasted media stream** by having the possibility to edit each pixels before they are drawn to the canvas. Moreover, Instacam can beautify the media stream by adding a fresh touch of CSS. Don't forget that Instacam only works on browsers that natively support the HTML5 `canvas` tag, `requestAnimationFrame` API, `HTMLMediaElement` API, `navigator.mediaDevices` and `Promises` API.


Markup
------
### Viewport
The viewport is a canvas representation of the media stream. Instacam captures the webcam video stream and replicates it on a canvas element, the viewport defined in the jQuery selector must matched **a valid canvas element** to properly replicate the stream.

```html
<!-- viewport -->
<canvas id="canvas1"></canvas>
```


Calling
-------
Instantiate and call the plugin is **very easy**. Just start by include the jQuery library and the plugin on your web page using the generic script markup:

```js
<script type="text/javascript" src="jquery.min.js"></script>
<script type="text/javascript" src="instacam.min.js"></script>
```

Then call the plugin by using the default plugin call syntax of jQuery:

```js
$(function(){
	$('#canvas1').instacam();
});
```

You can call the plugin with **multiple canvas identifiers** *(comma-separated)*, like this:

```js
$(function(){
	$('#canvas1,#canvas2,#canvas3').instacam();
});
```

The calling is different if you want to call the plugin with custom options:

```js
$(function(){
	$('#canvas1').instacam({
		width: 800,
		height: 600
	});
});
```


Options
-------
### Getting property
The plugin options can be **retrieved easily**. If you want to get the current level of the css saturation filter for example, you can do the following:

```js
var saturation = $('#canvas1').instacam('saturation');
```

### Setting property
The plugin options can be **setted easily**. If you want to set the current level of the css brightness filter for example, you can do the following:

```js
$('#canvas1').instacam({brightness:5});
```

### Quick reference
Instacam call with all default options as defined in the source.

```js
$('#canvas1').instacam({
	
	// width of the viewport
	width: 400,
	
	// height of the viewport
	height: 300,
	
	// miror mode
	mirror: false,
	
	// video property of the getUserMedia API
	camera: true,
	
	// refresh rate property of the camera in frames per second
	framerate: 30,
	
	// ratio of the viewport
	ratio: 4/3,
	
	// audio property of the getUserMedia API
	sound: false,
	
	// volume property of the camera
	volume: 100,
	
	// css filter used to set the opacity of the viewport
	opacity: 1,
	
	// css filter used to set the brightness of the viewport
	brightness: 1,
	
	// css filter used to set the contrast of the viewport
	contrast: 1,
	
	// css filter used to set the saturatation of the viewport
	saturation: 0,
	
	// css filter used to set the hue of the viewport
	hue: 0,
	
	// css filter used to invert colors of the viewport
	invert: 0,
	
	// css filter used to add a grayscale effect on the viewport
	grayscale: 0,
	
	// css filter used to add a sepia effect on the viewport
	sepia: 0,
	
	// css filter used to blur the viewport
	blur: 0,
	
	// css filter used to specify svg filtering on the viewport
	url: 0,
	
	// custom filter applied to the viewport
	filter: null,
	
	// callback's method used when the stream is fully captured
	done: null,
	
	// callback's method used when the stream capture failed
	fail: null,
	
	// callback's method used when a browser doesn't support getUserMedia or requestAnimationFrame features
	unsupported: null
});
```

### Complete reference
Instacam reference that details all options of the plugin.

#### width
Type: `Numeric`
Default: `400`

The width represents **the width of the viewport**. It must fit to the aspect ratio option, by default a **4:3 ratio**, to render a proper image of the media stream, depending on the webcam.

#### height
Type: `Numeric`
Default: `300`

The height represents **the height of the viewport**. It must fit to the aspect ratio option, by default a **4:3 ratio**, to render a proper image of the media stream, depending on the webcam.

#### mirror
Type: `Boolean`
Default: `false`
The mirror mode allows you to **flip the viewport horizontally**. This mode is using css transform property.

#### camera
Type: `Boolean`
Default: `true`

The camera option allows you to **capture video from the camera**. By default, Instacam is only capturing media stream from the webcam. If you want to capture only the microphone, you must set this option to `false` and set the sound option to `true`.

#### framerate
Type: `Numeric`
Default: `30`
Minimum: `1`
Maximum: `None`

The framerate option allows you to **change the refresh rate of the camera**. By default, Instacam will capture **30 frames per second**. The maximum framerate depends on the camera capabilities.

#### ratio
Type: `Numeric`
Default: `4/3`

The ratio option allows you yo **change the aspect ratio of the camera**. It must fit to the width/height ratio to render a proper image of the media stream. You can use float numbers (like 1.1, 1.7) or fractions (like 4/3, 16/9) for better reading.

#### sound
Type: `Boolean`
Default: `false`

The sound option allows you to **capture audio from the microphone**. By default, Instacam is only capturing media stream from the webcam. If you want to capture both the microphone and the camera, you must set this option to `true`.

#### volume
Type: `Numeric`
Default: `100`
Minimum: `0`
Maximum: `100`

The volume option allows you to **adapt the volume of the microphone**. By default, Instacam sets the volume to 100%. Note that the volume is set **one time**, when the camera is ready.

#### opacity
Type: `Numeric`
Default: `1`
Minimum: `0` or `0%`
Maximum: `1` or `100%`

The opacity option applies transparency to the viewport, making it **appear more or less transparent**. A value of 0% is completely transparent. A value of 100% leaves the viewport unchanged. Values between 0% and 100% are linear multipliers on the effect. Some browsers may provide **hardware acceleration** to render the opacity filter for better performance. If omitted, the css filter won't be applied.

#### brightness
Type: `Numeric`
Default: `1`
Minimum: `0` or `0%`
Maximum: `None`

The brightness option applies a linear multiplier to the viewport, making it **appear more or less bright**. A value of 0% will create an image that is completely black. A value of 100% leaves the viewport unchanged. Other values are linear multipliers on the effect. Values of an amount over 100% are allowed, providing **brighter results**. If omitted, the css filter won't be applied.

#### contrast
Type: `Numeric`
Default: `1`
Minimum: `0` or `0%`
Maximum: `None`

The contrast option **adjusts the contrast** of the viewport. A value of 0% will create an image that is completely black. A value of 100% leaves the viewport unchanged. Values of amount over 100% are allowed, providing **results with less contrast**. If omitted, the css filter won't be applied.

#### saturation
Type: `Numeric`
Default: `0`
Minimum: `0` or `0%`
Maximum: `None`

The saturation option **saturates** the viewport. A value of 0% is completely un-saturated. A value of 100% leaves the viewport unchanged. Other values are linear multipliers on the effect. Values of amount over 100% are allowed, providing **super-saturated results**. If omitted, the css filter won't be applied.

#### hue
Type: `Numeric`
Unit: `Degree`
Default: `0`
Minimum: `0`
Maximum: `360`

The hue option **applies a hue rotation** on the viewport. The value of angle defines the number of degrees around the color circle the viewport samples will be adjusted. A value of 0 degree leaves the viewport unchanged. The maximum value is 360 degree. If omitted, the css filter won't be applied.

#### invert
Type: `Numeric`
Default: `0`
Minimum: `0` or `0%`
Maximum: `1` or `100%`

The invert option **inverts the samples** in the viewport. A value of 100% is completely inverted. A value of 0% leaves the viewport unchanged. Values between 0% and 100% are linear multipliers on the effect. If omitted, the css filter won't be applied.

#### grayscale
Type: `Numeric`
Default: `0`
Minimum: `0` or `0%`
Maximum: `1` or `100%`

The grayscale option **converts the viewport to grayscale**. A value of 100% is completely grayscale. A value of 0% leaves the viewport unchanged. Values between 0% and 100% are linear multipliers on the effect. If omitted, the css filter won't be applied.

#### sepia
Type: `Numeric`
Default: `0`
Minimum: `0` or `0%`
Maximum: `1` or `100%`

The sepia option **converts the viewport to sepia**. A value of 100% is completely sepia. A value of 0 leaves the viewport unchanged. Values between 0% and 100% are linear multipliers on the effect. If omitted, the css filter won't be applied.

#### blur
Type: `Numeric`
Unit: `Pixel`
Default: `0`
Minimum: `0`
Maximum: `None`

The blur option **applies a Gaussian blur** to the viewport. The value of radius defines the value of the standard deviation to the Gaussian function, or how many pixels on the screen blend into each other, so **a larger value will create more blur**. The option is specified as a CSS length, but does not accept percentage values. If omitted, the css filter won't be applied.

#### url
Type: `String`
Default: `Empty`

The url option takes the **location of an XML file** that specifies an **SVG filter**, and may include an anchor to a specific filter element. If omitted, the css filter won't be applied.

#### filter
Type: `Function`
Return: `Array`
Default: `null`

The filter option allows you to applies a **custom filter** to the viewport, that is different than applying a CSS filter. The custom filter brings you the ability to edit each pixels of the media stream before they are drawn to the canvas. This option must take a `Function`, with one parameter called `pixel`, that corresponds to the current pixel parsed by the **plugin's filtering loop**. On that pixel, you can get some informations like the `offset` *(index of the pixel)*, the `x` and `y` positions, the `red`, `green` and `blue` color components and finally the `alpha` layer. With this informations, you can **edit the pixel's properties** and then return the edited informations. The return type of the function must be an `Array` with the red, green, blue components and the alpha layer: these new values will erase the previous informations of the pixel. You can also **combine several CCS filters with a custom filter** to obtain pretty effects. If omitted, the custom filter won't be applied. **Take a look at the custom filter demo** to see an example of how it works.

#### done
Type: `Function`
Return: `Nothing`
Default: `null`

Done is a callback method **called when the stream is fully captured**. You can override the default method of Instacam by adding your own function here. This function can takes two parameters: `media` that represents the `video` element created to stream the webcam, and `viewport` that represents the `canvas` element passed to the plugin when Instacam is instanciated.

#### fail
Type: `Function`
Return: `Nothing`
Default: `null`

Fail is a callback method **called when the stream capture failed**. You can override the default method of Instacam by adding your own function here. This function can takes three parameters: `exception` that represent the NavigatorUserMediaError object, `media` that represents the `video` element created to stream the webcam, and `viewport` that represents the `canvas` element passed to the plugin when Instacam is instanciated.

#### unsupported
Type: `Function`
Return: `Nothing`
Default: `null`

Unsupported is a callback method **called when a browser doesn't support a required API** to properly work. You can override the default method of Instacam by adding your own function here.


Methods
-------
### Quick reference
Instacam methods with all default parameters as defined in the source.

#### Snap
```js
$('#canvas1').data('instacam').snap(
	
	// left position of the snapping zone
	left: 0,
	
	// top position of the snapping zone
	top: 0,
	
	// width of the snapping zone
	width: plugin.settings.width,
	
	// height of the snapping zone
	height: plugin.settings.height
);
```

#### Save
```js
$('#canvas1').data('instacam').save(
	
	// image file format
	format: 'png',
	
	// image quality
	quality: 1
);
```

### Complete reference
Instacam reference that details all methods of the plugin.

#### snap ( left , top , width , height )
Type: `Function`
Return: `ImageData`

The snap method allows you to **capture image data from a portion of the viewport**. All the parameters are of type `Numeric`. By default, `left` and `top` are equals to 0, and `width` and `height` are equals to the width and height of the viewport defined in the plugin's options. If you call this function without parameters, you will get the image data of the entire viewport. **Take a look at the snap demo** to see an example of how it works.

#### save ( format , quality )
Type: `Function`
Return: `UTF-16 String`

The save method allows you to **save the viewport to a specific image format**. This method returns a `data:` URL containing a representation of the image in the format specified by `format`, default format is set to `png`. The returned image is **96dpi**. If the height or width of the viewport is 0, the empty string `data:,` is returned. If the format requested is not `image/png`, and the returned value starts with `data:image/png`, then the requested format is not supported. Chrome supports the `image/webp` format. If the requested format is `image/jpeg` or `image/webp`, then the second argument `quality`, if it is between 0 and 1, is treated as indicating **image quality**. By default, the image quality is set to 1. If you call this function without parameters, you will get a png file of good quality. **Take a look at the save demo** to see an example of how it works.


Examples
--------
Some examples working with the default plugin options.

### Basic example

```html
<canvas id="canvas1"></canvas>
```

```js
$(function(){
	$('#canvas1').instacam();
});
```

This example does the following:

- creation of an **instant canvas** instance
- broadcasting of the media stream to the viewport *(default resolution of 400x300)*

### Grayscale example

```html
<canvas id="canvas1"></canvas>
```

```js
$(function(){
	$('#canvas1').instacam({
		grayscale: 1
	});
});
```

This example does the following:

- creation of an **instant canvas** instance
- broadcasting of the media stream to the viewport *(default resolution of 400x300)*
- filtering of the viewport with CSS technology to reproduce a grayscale effect


Demos
-----
Some html demos are available and listed below. Please don't forget to read the **[compatibility section](https://github.com/xavierfoucrier/instacam/blob/master/README.md#compatibility)** before testing them.

1. [Basic demo](https://xavierfoucrier.github.io/instacam/index.html) - a simple demo with the camera
2. [CSS filter demo](https://xavierfoucrier.github.io/instacam/css-filter.html) - pretty css filtering demo
3. [Custom filter demo](https://xavierfoucrier.github.io/instacam/custom-filter.html) - pretty custom filtering demo
4. [Snap demo](https://xavierfoucrier.github.io/instacam/snap.html) - capture the viewport image data
5. [Save demo](https://xavierfoucrier.github.io/instacam/save.html) - save the viewport in different format and quality

Note that all demos are using jQuery 2.1.1 and the latest version of Instacam from the Github repository.