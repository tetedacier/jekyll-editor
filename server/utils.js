const fs = require('fs');

const readFile = (path) => fs.readFileSync(path).toString('utf8')

const manage = (app, pattern, {read, save}) => new Promise(function(resolve, reject) {
    if(read === undefined) {
      return reject(new Error('at least read action must be provided'))
    }

    app.get(pattern, read)

    if(save !== undefined) {
      app.post(pattern, save)
    }
})
module.exports = {
  readFile,
  manage
}
