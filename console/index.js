import '../shared/scss/application.scss';

window.$ = window.jQuery = require('jquery');
window._ = require('lodash');
require('bootstrap');

window.paceOptions = {
  ajax: true,
  document: true,
  eventLag: true,
  elements: true,
  restartOnRequestAfter: false,
};
require('../shared/venders/pace');
require('../shared/venders/jquery.nicescroll');

function removeLoader() {
  let i = 0;
  function handleLoader() {
    if (i < 2) {
      setTimeout(() => {
        document.querySelector('.sp-container').classList.add(`sp-${i}`);
        i++;
        handleLoader();
      }, 500);
    }
  }
  handleLoader();
}

removeLoader();
