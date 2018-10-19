(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const UserRequest = (path) => {
  if (!path) {
    path =''
  }
  let user = new XMLHttpRequest()
  user.addEventListener('load', (event) => {
    if (user.readyState === XMLHttpRequest.DONE) {
      if (user.status === 200) {
        console.group(`'${path}' gave`);
        if (user.response === 'json') {
          console.log(JSON.parse(user.responseText))
        } else {
          console.log(user.responseText)
        }
        console.groupEnd()
      } else {
        alert(
          `/!\\ issue with '${path}':\n ${user.responseText}`
        )
      }
    }
  })
  user.open('GET', `https://api.github.com/${path}`)
  user.setRequestHeader('Authorization', 'token ' + localStorage.accessToken)
  user.setRequestHeader('Accept', 'application/json')
  user.setRequestHeader('Content-type', 'application/json')
  user.send()
}

},{}]},{},[1]);
