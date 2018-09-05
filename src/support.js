'use strict';

// browser requirement needed for Instacam to properly work
export let requirement = 'requestAnimationFrame' in window && 'mediaDevices' in navigator && 'Promise' in window;
