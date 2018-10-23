const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 6000
const {
  githubAuthorize,
  errorReponse
} = require('./github-authorize')
const app = express()

app.use(bodyParser.json())
app.use(cors())

app.post('/authorize', (req, res) => {
  if (req.body && req.body.code) {
    return githubAuthorize(res, req.body.code)
  }
  return errorReponse(res, "missing code parameter")
})

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})
