const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');
const PORT = process.env.PORT || process.env.server_port

// const request = require('request')
const app = express()
app.use(bodyParser.json())
app.use(cors())
app.post('/authorize', (req, res) => {
  console.warn(req.body)
  if (req.body.code) {
    let fake_gihub_access_token = '123445678'
    res.status(200)
    res.set({'Content-Type':'application/json'})
    return res.send(
      `{"gihub_access_token": "${
        fake_gihub_access_token
      }", "given_code": "${
        req.body.code
      }"}`
    )
  }
  res.status(403)
  res.set({'Content-Type':'application/json'})
  return res.send(`{"message": "missing code parameter"}`)
})
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})
