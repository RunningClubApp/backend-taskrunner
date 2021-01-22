const express = require('express')
const app = express()
const jobCFG = require('../jobs.config')

function Start (port, jobRunner) {
  jobCFG.jobTypes.forEach((job) => {
    const jobRouter = require(`./jobroutes/${job}`)(jobRunner)
    app.use(jobRouter)
  })

  app.listen(port)
  console.log(`server listening on ${port}`)
  return app
}

module.exports = { Start: Start }
