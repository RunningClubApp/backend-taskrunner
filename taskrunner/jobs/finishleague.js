const League = require('../../mongo-database/Models/League')
const Exercise = require('../../mongo-database/Models/Exercise')
const calculate = require('../../distance-calculator')

module.exports = (agenda) => {
  agenda.define('finishleague', async (job, done) => {
    const { leagueID } = job.attrs.data
    const league = await League.findById(leagueID).catch((err) => { done(err) })
    const leagueEnd = Date.now()

    if (league === null) {
      done(new Error(`could not find league ${leagueID}`))
    }

    // Get results of every user
    const results = []
    for (let i = 0; i < league.participants.length; i++) {
      const user = league.participants[i]

      // find all the user's exercises in the time period
      const exercises = await Exercise
        .find({ 'timestamps.start_date': { $gte: league.league_start, $lte: leagueEnd }, owner: user })
        .select('path').catch(err => done(err))

      // map exercises to get [[{lat, lng}, ...], [...], ...]
      const paths = exercises.map((ex) => {
        return ex.path.map((pt) => {
          return { lat: pt.coords.lat, lng: pt.coords.lng }
        })
      })

      // reduce paths down to just distances
      let distance = 0
      if (paths.length > 0) {
        distance = paths.reduce((tot, path) => {
          return tot + calculate.DistanceOfPath(path)
        }, 0)
      }

      results.push({ userID: user, distance })
    }

    // Find Winner and rankings
    results.sort((a, b) => {
      return a.distance - b.distance
    })
    const winner = results[0].userID

    // Add to history
    const entry = {
      winner,
      rankings: results.map(x => x.user),
      start_date: league.league_start,
      length: league.league_length
    }
    league.history.push(entry)

    // Reset current data
    league.start_date = leagueEnd

    // Save league
    await league.save().catch(err => done(err))
    // TODO: Push notifications + emails

    done()
  })
}
