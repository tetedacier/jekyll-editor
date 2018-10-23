const request = require('request')
const errorReponse = (res, message) => {
    res.status(403)
    res.set({'Content-Type':'application/json'})
    return res.send(`{"message": "${message}"}`)
}
const githubAuthorize = (res, code) => {
  const {
    client_id,
    client_secret
  } = process.env
  console.warn({
    client_id,
    client_secret
  })
  return request.post(
    {
      url: 'https://github.com/login/oauth/access_token',
      json:true,
      body: {
        client_id,
        client_secret,
        code
      }
    }, (error, response, body) => {
      if (error) {
        return errorReponse(res, "invalid authorization parameters")
      }
      res.status(200)
      res.set({'Content-Type':'application/json'})
      return res.json(
        body
      )
    }
  )
}

module.exports = {
  githubAuthorize,
  errorReponse
}
