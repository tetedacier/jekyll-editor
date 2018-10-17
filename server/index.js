/**
* @file
 * This is the REST repository server
 */
const express = require('express')
const cors = require('cors')
const app = express()
var cache = {};
const fs = require('fs');
const port = 8081
const glob = require("glob")
const pkg = require("../package.json")
const extWatch = 'markdown'
const readFile = (path) => fs.readFileSync(path).toString('utf8')
const rootPathExtraction_RE = new RegExp(`^${pkg.servedMarkdown}/(.*)$`)
const bodyParser = require('body-parser');
const memoizeResponse = (cacheItem, update) => {

  return {
    save: (req, res) => {
      res.set({
        'Access-Control-Allow-Origin': '*'
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
        console.log('jdjdjd')
        return res.send(`${req.path} write, no body nor content`)
      }
    },
    read: (req, res) => {
      res.set({
        'Access-Control-Allow-Origin': '*'
      })
      if(cacheItem.unknown){
        return res.send(`${req.path} unknown`)
      }
      return res.send(cacheItem.content)
    }
  }
}

const manage = (app, pattern, {read, save}) => new Promise(function(resolve, reject) {
    if(read === undefined) {
      return reject(new Error('at least read action must be provided'))
    }

    app.get(pattern, read)

    if(save !== undefined) {
      app.post(pattern, save)
    }
})

const checkMardownFiles = () => {
  fs.watch(pkg.servedMarkdown, { recursive: true }, (eventType, fileName) => {
    if (fileName.replace(/^.*\.(.+)$/,'$1') === extWatch) {
      fs.stat(`${pkg.servedMarkdown}/${fileName}`, (err, stats) => {
        if (err) {
          if (err.code === 'ENOENT' && cache[fileName]) {
            console.log(`unregistering getter for '/${fileName}'`)
            cache[fileName].unknown = true
          }
          console.log(eventType, fileName, err)
        } else {
          if(cache[fileName]) {
            cache[fileName].unknown = false
            // cache[fileName].unknown = false
            console.log(`updating getter for '/${fileName}'`)
            cache[fileName].content = readFile(`${pkg.servedMarkdown}/${fileName}`)
          } else {
            cache[fileName]= {
              content : readFile(`${pkg.servedMarkdown}/${fileName}`),
              unknown : false
            }
            console.log(`registering getter for '/${fileName}'`)
            manage(
              app,
              `/${fileName}`,
              {
                read: memoizeResponse(cache[fileName]),
                save: memoizeResponse(cache[fileName], true)
              }
            )
          }
          console.log(eventType, fileName, stats)
        }
      })
    }
  })
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
          memoizeResponse(cache[file])
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

searchMardownFiles().then(({files})=>{
  checkMardownFiles()
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
  })
}, (rejection) => {
  console.error(rejection)
})
