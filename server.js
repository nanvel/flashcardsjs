const express = require('express')
const path = require('path')


const staticFolder = path.join(__dirname, 'build')


const app = express()


app.use(express.static(staticFolder, {index: 'index.html'}))


app.listen(8000, function () {
  console.log('Listening on port 8000!')
})
