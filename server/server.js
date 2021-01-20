const express = require('express')
const app = express()
const cfg = require('../task.config')

function Start () {
  app.listen(cfg.server.port)
}

module.exports = { Start: Start }
