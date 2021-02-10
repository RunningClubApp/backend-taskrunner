const Agendash = require('agendash2')
const server = require('./server/server')
const tasks = require('./taskrunner/taskrunner')
require('./mongo-database/db')
const cfg = require('./server.config')

const runner = tasks.Start(process.env.NODE_ENV === 'production')
const webApp = server.Start(cfg.port, runner)

if (cfg.useDebugDash) {
  webApp.use('/dash', Agendash(runner))
}

async function graceful () {
  await runner.stop()
  process.exit(0)
}

process.on('SIGTERM', graceful)
process.on('SIGINT', graceful)
