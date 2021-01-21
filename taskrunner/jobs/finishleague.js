module.exports = (agenda) => {
  agenda.define('finishleague', async (job, done) => {
    console.log('league finished')
    done()
  })
}
