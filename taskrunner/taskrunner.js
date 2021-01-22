const Agenda = require('agenda')

const dbCFG = require('../db.config')
const jobCFG = require('../jobs.config')

// Or override the default collection name:
// const agenda = new Agenda({db: {address: mongoConnectionString, collection: 'jobCollectionName'}});

// or pass additional connection options:
// const agenda = new Agenda({db: {address: mongoConnectionString, collection: 'jobCollectionName', options: {ssl: true}}});

// or pass in an existing mongodb-native MongoClient instance
// const agenda = new Agenda({mongo: myMongoClient});

function Start (envProd = false) {
  let url
  if (envProd) {
    url = `mongodb+srv://${dbCFG.user}:${dbCFG.pwd}@${dbCFG.url}/${dbCFG.db}-jobs`
  } else {
    url = `mongodb://${dbCFG.url}:${dbCFG.port}/${dbCFG.db}-jobs`
  }

  const agenda = new Agenda({ db: { address: url } })

  jobCFG.jobTypes.forEach((job) => {
    require(`./jobs/${job}`)(agenda)
    console.log('Registered job %s', job)
  })

  agenda.on('ready', () => {
    console.log('agenda is ready.')
  })

  agenda.on('start', async (job) => {
    console.log(`job ${job.attrs.name} is started.`)
  })

  agenda.on('complete', (job) => {
    console.log(`job ${job.attrs.name} is finished.`)
  })

  agenda.on('success', (job) => {
    console.log(`job ${job.attrs.name} was successfull.`)
  })

  agenda.on('error', (job) => {
    console.log(`job ${job.attrs.name} was failed.`)
  })

  const startRunner = async () => { // IIFE to give access to async/await
    await agenda.start()
  }
  startRunner()
  return agenda
}

module.exports = { Start }
