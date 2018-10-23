(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const {
  extractGithubOauthParameters,
} = require('./utils')

const {
  githubAccessToken,
} = require('./request')

if (localStorage) {
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
          localStorage.setItem(
            'githubJekyllEditorAccessToken',
            JSON.parse(oauth.responseText).access_token
          )
        } else {
          alert(
            '/!\\ access token can\'t be retrieved:\n' + oauth.responseText
          )
        }
      }
    })
    oauth.open('POST', 'https://jekyll-editor.herokuapp.com/authorize');
    oauth.setRequestHeader('Accept', 'application/json')
    oauth.setRequestHeader('Content-type', 'application/json')
    oauth.send(JSON.stringify({
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

const last = (array) => array.slice(-1)[0]
/**
 * [strPad description]
 * @param  {String} str    Str to pad
 *
 * @param  {Object} length Length of resulting string
 * @param  {[type]} direction [description]
 * @return {[type]}        [description]
 */
const strPad = (str, {length, direction=true, pad=' '}) => {
    if (str.length > length) {
        return str
    }
    let padding = ((size) => {
        var ret = ''
        for(var i = 1; i < size; i++) {
            ret += pad
        }
        return ret
    })(length - str.length)
    return (direction)?`${str}${padding}`:`${padding}${str}`
}

const uuidGenerator = () => new Promise(function(resolveUuid, rejectUuid) {
  Promise.all(
    [
      {size:8, length:2},
      {size:4, length:4}
    ]
    .map(uuidPart => {
      let sizes = [];
      for (var i = 0; i < uuidPart.length ; i++) {
        sizes.push({size: uuidPart.size})
      }
      return sizes
    })
    .reduce((acc, current) =>  acc.concat(current), [])
    .map(chunk => new Promise((resolve, reject) => resolve({
      value: strPad(
        Math.trunc(
          (Math.pow(2, 4 * chunk.size) - 1) * Math.random(Date.now())
        ).toString(16),
        { length: chunk.size, direction: false, pad: '0' }
      ),
      size: chunk.size
    })))
  ).then((chunks) => {
    let classifiedValues = chunks.reduce((acc, current) => {
      if (acc[current.size] === undefined) {
        acc[current.size] = [current.value]
      } else {
        acc[current.size].push(current.value)
      }
      return acc
    }, {})
    resolveUuid(`${
      classifiedValues[8][0]
    }-${
      classifiedValues[4][0]
    }-${
      classifiedValues[4][1]
    }-${
      classifiedValues[4][2]
    }-${
      classifiedValues[4][3]
    }${
      classifiedValues[8][1]
    }`)
  }, $rejection => rejectUuid($rejection))
  .catch($globalRejection => rejectUuid($globalRejection))
})

module.exports = {
  extractGithubOauthParameters,
  uuidGenerator,
}

},{}]},{},[1]);
