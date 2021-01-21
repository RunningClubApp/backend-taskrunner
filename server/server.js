const express = require('express')
const app = express()
const cfg = require('../server.config')
const jobCFG = require('../jobs.config')

function Start (jobRunner) {
  jobCFG.jobTypes.forEach((job) => {
    const jobRouter = require(`./jobroutes/${job}`)(jobRunner)
    app.use(jobRouter)
  })

  app.listen(cfg.server.port)
  console.log(`server listening on ${cfg.server.port}`)
}

module.exports = { Start: Start }
