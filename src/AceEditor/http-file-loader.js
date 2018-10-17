/**
 * [XmlHttpRequest description]
 * @type {[type]}
 */

const XmlHttpRequest = class {
  constructor (domain, protocol) {
    this.baseUrl = `${['http', 'https'].indexOf(protocol)>-1?protocol:'https'}://${domain}`
  }

  list () {
    const connection = new XMLHttpRequest();
    return new Promise(function (resolve, reject) {
      connection.addEventListener('load', (event) => {
        if (connection.readyState === XMLHttpRequest.DONE) {
          if (connection.status === 200) {
            if (connection.responseJSON) {
              return resolve(connection.responseJSON)
            } else {
              return resolve(connection.responseText)
            }
          }
          return reject(connection.responseText)
        }
      })
      connection.open('GET', `${this.baseUrl}/`)
      connection.send()
    }.bind(this))
  }

  read (path) {
    return new Promise(function (resolve, reject) {
      const connection = new XMLHttpRequest()
      connection.addEventListener('load', (event) => {
        if (connection.readyState === XMLHttpRequest.DONE) {
          if (connection.status === 200) {
            if (connection.responseJSON) {
              resolve(connection.responseJSON)
            } else {
              resolve(connection.responseText)
            }
          } else {
            reject({status:connection.status,response: connection.responseText})
          }
        }
        // setTimeout(200)
      })
      connection.open('GET', `${this.baseUrl}${path}`)
      connection.send()
    }.bind(this))
  }

  save (path, content) {
    return new Promise(function (resolve, reject) {
      const connection = new XMLHttpRequest()
      connection.addEventListener('load', (event) => {
        if (connection.readyState === XMLHttpRequest.DONE) {
          if (connection.status === 200) {
            if (connection.responseJSON) {
              resolve(connection.responseJSON)
            } else {
              resolve(connection.responseText)
            }
          } else {
            reject({status:connection.status,response: connection.responseText})
          }
        }
        // setTimeout(200)
      })
      connection.open('POST', `${this.baseUrl}${path}`)
      connection.setRequestHeader('Content-Type', 'application/json')
      connection.send(JSON.stringify({newContent:content}))
    }.bind(this))
  }
}
export {
  XmlHttpRequest
}
