const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');
const PORT = process.env.PORT || process.env.server_port
const request = require('request')

const app = express()

app.use(bodyParser.json())
app.use(cors())
const errorReponse = (res, message) => {
  res.status(403)
  res.set({'Content-Type':'application/json'})
  return res.send(`{"message": "${message}"}`)
}
app.post('/authorize', (req, res) => {
  if (req.body.code) {
    return request.post(
      {
        url: 'https://github.com/login/oauth/access_token',
        json:true,
        body: {
          client_id: process.env.client_id,
          client_secret: process.env.client_secret,
          code: req.body.code
        }
      }, (error, response, body) => {
        if (error) {
          return errorReponse(res, "invalid authorization parameters")
        }

        res.status(200)
        res.set({'Content-Type':'application/json'})
        return res.send(
          `{"access_token": "${
            body.access_token
          }"}`
        )
      }
    )
  }
  return errorReponse(res, "missing code parameter")
})
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})
