(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const {
  clientId
} = require('./parameters')
if (localStorage) {
  if (localStorage.accessToken) {
    document.getElementById('authorize').parentNode.removeChild(document.getElementById('authorize'))

    appFrame = document.createElement('iframe')
    appFrame.src = "editor.html"
    document.getElementsByTagName('body')[0].appendChild(appFrame)
  } else {
    if (localStorage.appPrivateKey) {
      if (window.location.host !== 'tetedacier.github.io') {
        alert('/!\\ `' + window.location.host + '` is a wrong realm')
      } else {
        let authorizeButton = document.getElementById('authorize')
        let eventName = 'click'
        authorizeButton.addEventListener(eventName, (event) => {
          window.location.href = 'https://github.com/login/oauth/authorize' + '?' +
            'client_id=' + clientId + '&'
            'state=' + localStorage.getItem('defaultState')
        })
        localStorage.setItem('defaultState', 'st-'+ Math.random()*1e9)
        authorizeButton.removeAttribute('disabled')
      }
    }
    else {
      console.info('ask gently for my app private key by email: tetedacier<fabien.jacq@gmail.com>')
    }
  }
}

},{"./parameters":2}],2:[function(require,module,exports){
const clientId = '101ee5181784e405d2dc'
module.exports = {
  clientId
}

},{}]},{},[1]);
