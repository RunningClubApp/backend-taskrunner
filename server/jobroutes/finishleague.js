const express = require('express')
const moment = require('moment')

const OIDValidator = require('../../type-validators/ObjectIdValidator')
const BoolValidator = require('../../type-validators/BoolValidator')
const LenValidator = require('../../type-validators/LeagueLengthValidator')

module.exports = (agenda) => {
  const router = express.Router()

  router.post('/schedule-finish-league', (req, res, next) => {
    const leagueID = req.query.lge
    const length = req.query.ln
    const repeat = req.query.r === undefined ? 'false' : req.query.r

    let valid = OIDValidator(leagueID)
    if (valid.err) {
      return res.status(400).json({ success: false, errors: { league: valid.errors } })
    }

    valid = LenValidator(length)
    if (valid.err) {
      return res.status(400).json({ success: false, errors: { date: valid.errors } })
    }

    valid = BoolValidator(repeat)
    if (valid.err) {
      return res.status(400).json({ success: false, errors: { repeat: valid.errors } })
    }

    const lnToAdd = ({ Weekly: 'w', Monthly: 'm', Yearly: 'y', Quaterly: 'Q' })[length]
    const date = moment().add(1, lnToAdd).toDate()

    const job = agenda.create('finishleague', { leagueID })
    job.schedule(date)
    if (repeat) {
      const repeatTime = ({ Weekly: 'week', Monthly: 'month', Yearly: 'year', Quaterly: '3 months' })[length]
      job.repeatEvery(`${repeatTime}`)
    }
    job.save()

    return res.status(201).json({ success: true })
  })

  return router
}
