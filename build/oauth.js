(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const {
  extractGithubOauthParameters,
} = require('./utils')

const {
  githubAccessToken,
} = require('./request')
if (localStorage && localStorage.appPrivateKey) {
  let parameter = extractGithubOauthParameters(window.location.search)
  if(parameter !== null) {
    githubAccessToken(parameter)
  }
  else {
    alert('/!\\ missing authentication code parameter')
  }
}

},{"./request":3,"./utils":4}],2:[function(require,module,exports){
const clientId = '101ee5181784e405d2dc'
module.exports = {
  clientId
}

},{}],3:[function(require,module,exports){
const {
  clientId
} = require('./parameters')

const githubAccessToken = (parameter) => {
    let oauth = new XMLHttpRequest();
    oauth.addEventListener('load', (event) => {
      if (oauth.readyState === XMLHttpRequest.DONE) {
        if (oauth.status === 200) {
          if (oauth.response === 'json') {
            console.log(JSON.parse(oauth.reponseText))
          } else {
            console.log(oauth.reponseText)
          }
        } else {
          alert(
            '/!\\ missing authentication state and/or code parameter:\n' + oauth.reponseText
          )
        }
      }
    })

    oauth.setRequestHeader('Accept', 'application/json')
    oauth.setRequestHeader('Content-type', 'application/json')
    oauth.open('POST', 'https://github.com/login/oauth/access_token');
    oauth.send(JSON.stringify({
      client_id: clientId,
      client_secret: localStorage.appPrivateKey,
      code: parameter.code
    }))
}
module.exports = {
  githubAccessToken
}

},{"./parameters":2}],4:[function(require,module,exports){
const extractGithubOauthParameters = (locationSearch) => {
    let parameter = {}
    let queryString = locationSearch.match(
      /^\?(code)=([^=\&]+)$/
    )

    if(queryString !== null) {
      parameter[queryString[1]] = queryString[2]
      return parameter;
    }

    return null;
}
module.exports = {
  extractGithubOauthParameters
}

},{}]},{},[1]);
