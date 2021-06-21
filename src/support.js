// browser requirement needed for Instacam to properly work
export default 'requestAnimationFrame' in window && 'mediaDevices' in navigator && 'Promise' in window;
