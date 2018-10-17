
const express = require('express')
const cors = require('cors')
const app = express()
var cache = {};
const fs = require('fs');
const port = 8081
const glob = require("glob")
const pkg = require("../package.json")
const extWatch = 'markdown'
const {
  readFile,
  manage
} = require('./utils')
const rootPathExtraction_RE = new RegExp(`^${pkg.servedMarkdown}/(.*)$`)
const bodyParser = require('body-parser');
const memoizeResponse = (cacheItem, update) => {
  if (update) {
    return (req, res) => {
      res.set({
        'Content-Type':'application/json'
      })
      if(req.body){
        const { newContent } = req.body
        if (newContent) {
          fs.writeFile(`${pkg.servedMarkdown}${req.path}`, newContent, (err) => {
            if (err) {

              return res.send(`${req.path} write failed:\n${err}`)
            }
            return res.send(`${req.path} write success`)
          })
        }
      } else {
        return res.send(`${req.path} write, no body nor content`)
      }
    }
  }
  return (req, res) => {
    res.set({
      'Access-Control-Allow-Origin': '*',
      'Content-Type':'application/json'
    })
    if(cacheItem.unknown){
      return res.send(`${req.path} unknown`)
    }
    return res.send(cacheItem.content)
  }
}




const searchMardownFiles = () => new Promise((resolve, reject) => {
  glob(`${pkg.servedMarkdown}/**/*.${extWatch}`,{dot: true}, function (err, files) {
    if(err) {
      reject(new Error(err))
    }

    let localFiles = files.map(value => value.replace(rootPathExtraction_RE,'$1'))
    Object.keys(cache).forEach((key)=> {
      if (localFiles.indexOf(key) === -1) {
        console.log(`unregistering getter for '/${key}'`)
        cache[key].unknown = true
      }
    })

    localFiles.forEach((file) => {
      if (cache[file] === undefined) {
        cache[file] = {
          content: readFile(`${pkg.servedMarkdown}/${file}`)
        }
        console.log(`registering getter for '/${file}'`)
        manage(
          app,
          `/${file}`,
          {
            read: memoizeResponse(cache[file]),
            save: memoizeResponse(cache[file], true)
          }
        )
      }
    })
    resolve({files:localFiles})
  })
})

app.use(bodyParser.json())

app.use(cors())

app.get('/', (req, res) => {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Content-Type':'application/json'
  })
  searchMardownFiles().then(({files})=>{
    return res.json(files)
  }, (rejection) => {
    res.status(503)
    return res.json(rejection)
  })
})


module.exports = {
  app
}
