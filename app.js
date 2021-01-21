const server = require('./server/server')
const tasks = require('./taskrunner/taskrunner')

const runner = tasks.Start()
server.Start(runner)

async function graceful () {
  await runner.stop()
  process.exit(0)
}

process.on('SIGTERM', graceful)
process.on('SIGINT', graceful)
