(function($) {
	"use strict";
	
	$.instacam = function(viewport, options) {
		
		// to avoid scope issues, use 'plugin' instead of 'this'
		var plugin = this;
		
		// default plugin options
		var defaults = {
			width: 400,
			height: 300,
			sound: false,
			opacity: 1,
			brightness: 1,
			contrast: 1,
			saturation: 0,
			hue: 0,
			invert: 0,
			grayscale: 0,
			sepia: 0,
			blur: 0,
			url: '',
			filter: null,
			done: null,
			fail: null,
			unsupported: null
		};
		
		// initializes the plugin
		var init = function() {
			
			// extends default plugin options with user's custom options
			plugin.settings = $.extend({}, defaults, options);
			
			// detects user media
			navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
			
			// detects request animation frame
			window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
			
			// exit the plugin if it does not support getUserMedia or requestAnimationFrame features
			if (!navigator.getUserMedia || !window.requestAnimationFrame) {
				if (typeof plugin.settings.unsupported == 'function') {
					plugin.settings.unsupported();
				}
				
				return;
			}
			
			// initializes the viewport
			viewport.setAttribute('width', plugin.settings.width);
			viewport.setAttribute('height', plugin.settings.height);
			
			// creates the media element
			var media = document.createElement('video');
			
			// sets media element properties
			media.setAttribute('autoplay', '1');
			media.setAttribute('width', plugin.settings.width);
			media.setAttribute('height', plugin.settings.height);
			
			// hides the media element
			$(media).hide();
			
			// attaches the media element to the DOM
			viewport.parentNode.insertBefore(media, viewport.nextSibling);
			
			// captures the webcam stream
			capture(media);
		};
		
		// captures the media stream to the viewport through getUserMedia API
		var capture = function(media) {
			
			// prevents from streaming errors
			try {
				
				// captures the media stream
				navigator.getUserMedia({
					video: true,
					audio: plugin.settings.sound
				}, function(stream) {
					
					// captures the blob stream
					media.src = window.URL.createObjectURL(stream);
					
					// animation loop used to properly render the viewport
					var loop = function() {
						
						// waits for the next frame and loop
						requestAnimationFrame(loop);
						
						// renders the viewport with or without custom filter
						if (typeof plugin.settings.filter != 'function') {
							viewport.getContext('2d').drawImage(media, 0, 0, plugin.settings.width, plugin.settings.height);
						} else {
							
							// use of a buffer when applying a custom filter to prevent from some blinkings or flashes of the canvas
							if (typeof plugin.buffer == 'undefined') {
								plugin.buffer = document.createElement('canvas');
								plugin.buffer.setAttribute('width', plugin.settings.width);
								plugin.buffer.setAttribute('height', plugin.settings.height);
								viewport.parentNode.insertBefore(plugin.buffer, viewport.nextSibling);
								$(plugin.buffer).hide();
							}
							
							plugin.buffer.getContext('2d').drawImage(media, 0, 0, plugin.settings.width, plugin.settings.height);
							viewport.getContext('2d').putImageData(filter(plugin.buffer.getContext('2d').getImageData(0, 0, plugin.settings.width, plugin.settings.height)), 0, 0);
						}
						
						// creates css filter effects over the viewport
						var filters = plugin.settings.opacity != defaults.opacity ? 'opacity(' + plugin.settings.opacity + ') ' : '';
						filters += plugin.settings.brightness != defaults.brightness ? 'brightness(' + plugin.settings.brightness + ') ' : '';
						filters += plugin.settings.contrast != defaults.contrast ? 'contrast(' + plugin.settings.contrast + ') ' : '';
						filters += plugin.settings.saturation != defaults.saturation ? 'saturate(' + plugin.settings.saturation + ') ' : '';
						filters += plugin.settings.hue != defaults.hue ? 'hue-rotate(' + plugin.settings.hue + 'deg) ' : '';
						filters += plugin.settings.invert != defaults.invert ? 'invert(' + plugin.settings.invert + ') ' : '';
						filters += plugin.settings.grayscale != defaults.grayscale ? 'grayscale(' + plugin.settings.grayscale + ') ' : '';
						filters += plugin.settings.sepia != defaults.sepia ? 'sepia(' + plugin.settings.sepia + ') ' : '';
						filters += plugin.settings.blur != defaults.blur ? 'blur(' + plugin.settings.blur + 'px) ' : '';
						filters += plugin.settings.url != defaults.url ? 'url(' + plugin.settings.url + ') ' : '';
						
						// adds the css filter effects to the viewport
						if (filters !== '' && plugin.css != filters) {
							$(viewport).css({
								'filter': filters,
								'-webkit-filter': filters
							});
							
							plugin.css = filters;
						}
						
						// removes the css filter effects from the viewport if there is no filters
						if (filters === '') {
							$(viewport).css({
								'filter': '',
								'-webkit-filter': ''
							});
							
							plugin.css = '';
						}
					};
					
					// renders the first frame
					requestAnimationFrame(loop);
					
					if (typeof plugin.settings.done == 'function') {
						plugin.settings.done(media, viewport);
					}
				}, function() {
					if (typeof plugin.settings.fail == 'function') {
						plugin.settings.fail(media, viewport);
					}
				});
			} catch(e) {
				if (typeof plugin.settings.fail == 'function') {
					plugin.settings.fail(media, viewport);
				}
			}
		};
		
		// applies a custom filter to the viewport
		var filter = function(image) {
			var data = image.data;
			
			// loops through all pixels and applies the filter
			for (var y = 0; y < plugin.settings.height; y++) {
				for (var x = 0; x < plugin.settings.width; x++) {
					
					// detects the pixel offset
					var offset = ((plugin.settings.width * y) + x) * 4;
					
					// calls the filter
					var filtered = plugin.settings.filter({
						'offset': offset,
						'x': x,
						'y': y,
						'red': data[offset],
						'green': data[offset + 1],
						'blue': data[offset + 2],
						'alpha': data[offset + 3]
					});
					
					// applies the filter
					data[offset] = filtered[0];
					data[offset + 1] = filtered[1];
					data[offset + 2] = filtered[2];
					data[offset + 3] = filtered[3];
				}
			}
			
			return image;
		};
		
		// snaps the viewport and returns the image data
		plugin.snap = function(left, top, width, height) {
			
			// verifies the crop informations before snapping the viewport
			if (typeof left == 'undefined' || typeof top == 'undefined' || typeof width == 'undefined' || typeof height == 'undefined') {
				left = 0;
				top = 0;
				width = plugin.settings.width;
				height = plugin.settings.height;
			}
			
			return viewport.getContext('2d').getImageData(left, top, width, height);
		};
		
		// saves the viewport to a specific image file format : png and high quality by default
		plugin.save = function(format, quality) {
			if (typeof format == 'undefined') {
				format = 'png';
			}
			
			if (typeof quality == 'undefined') {
				quality = 1;
			}
			
			return viewport.toDataURL('image/' + format, quality);
		};
		
		// initializes the plugin
		init();
	};
	
	// instacam jquery function
	$.fn.instacam = function(options) {
		var base = $(this).data('instacam');
		
		// declares and instanciates the plugin or get/set plugin options
		if (base === undefined) {
			return this.each(function() {
				var plugin = new $.instacam(this, options);
				$(this).data('instacam', plugin);
			});
		} else {
			if (typeof options == 'object') {
				$.each(options, function(key, value) {
					base.settings[key] = value;
				});
			} else {
				return base.settings[options];
			}
		}
	};
})(jQuery);