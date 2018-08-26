'use strict';

export let requirement = 'requestAnimationFrame' in window && 'mediaDevices' in navigator && 'Promise' in window;
