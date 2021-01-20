const server = require('./server/server')
const tasks = require('./taskrunner/taskrunner')

tasks.Start()
server.Start()
