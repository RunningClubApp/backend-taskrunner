const express = require('express')

module.exports = (agenda) => {
  const router = express.Router()

  router.post('/schedule-finish-league', (req, res, next) => {
    const leagueID = req.query.lge
    agenda.now('finishleague')
    res.json({ success: true })
  })

  return router
}
