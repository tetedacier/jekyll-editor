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
      let { access_token } = body;
      return res.json(
        { access_token }
      )
    }
  )
}

module.exports = {
  githubAuthorize,
  errorReponse
}
