(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const {
  userRequest
} =  require('./request')

userRequest('user').then(
  result => {
    console.log(result)
    userRequest(`search/repositories?q=user:${result.content.login}%20${result.content.login}.github.io`).then(
      repository => {
        if (repository.content.total_count === 1) {
          userRequest(`repos/${result.content.login}/${result.content.login}.github.io/contents/_posts`).then(
            postList => {
              var posts = document.createElement('ul')
              postList.content.forEach(post => {
                let postLink = document.createElement('li')
                postLink.appendChild(document.createTextNode(post.path))
                posts.appendChild(postLink)
              })
              document.getElementsByTagName('body')[0].appendChild(posts)
            },
            postListRejection => console.error(postListRejection)
          )
        }
      },
      searchRejection => console.error(searchRejection)
    )
  },
  rejection => console.error(rejection)
)

},{"./request":3}],2:[function(require,module,exports){
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
          window.location = './editor.html'
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

const userRequest = (path, options) => new Promise((resolve, reject) => {
  var method = 'GET'
  var parameters = {}
  if (!path) {
    path =''
  }
  if (options && options.method) {
    method = options.method
  }
  if (options && options.parameters) {
    parameters = options.parameters
  }
  let user = new XMLHttpRequest()
  user.addEventListener('load', (event) => {
    if (user.readyState === XMLHttpRequest.DONE) {
      if (user.status === 200) {
        resolve({
          content:JSON.parse(user.responseText),
          headers: user.getAllResponseHeaders().split(/\r\n/).reduce(
            (acc, header) => {
              let matches = header.match(/^([^:]+):\s*(.*)$/)
              if (matches !== null) {
                let [full, key, value] = matches
                acc[key] = value
              }
              return acc
            },
            {}
          )
        })
      } else {
        reject(new Error(`issue with '${path}':\n ${user.responseText}`))
      }
    }
  })
  if (localStorage && localStorage.githubJekyllEditorAccessToken) {
    user.open(method, `https://api.github.com/${path}`)
    user.setRequestHeader('Authorization', 'token ' + localStorage.githubJekyllEditorAccessToken)
    user.setRequestHeader('Accept', 'application/json')
    user.setRequestHeader('Content-type', 'application/json')
    user.send(Object.keys(parameters).length>0?
      JSON.stringify(parameters):
      undefined
    )
  } else {
    reject(new Error('no access_token found, require one through https://tetedacier.github.io/jekyll-editor/'))
  }
})

module.exports = {
  githubAccessToken,
  userRequest,
}

},{"./parameters":2}]},{},[1]);
