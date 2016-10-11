const bowser = require('bowser');

function detectUnsupportedHandler() {
  window.location = '/browser-unsupport.html';
}

if (bowser.msie) {
  detectUnsupportedHandler();
} else if (bowser.chrome && bowser.version <= 44) {
  detectUnsupportedHandler();
} else if (bowser.firefox && bowser.version <= 40) {
  detectUnsupportedHandler();
} else if (bowser.safari && bowser.version < 9) {
  detectUnsupportedHandler();
}
