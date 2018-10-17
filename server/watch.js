
const watchMardownFiles = (root) => {
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
module.exports = {
  watchMardownFiles
}
