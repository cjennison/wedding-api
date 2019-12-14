var express = require('express');
var router = express.Router();
const _ = require('lodash')

const ADMIN_SECRET = process.env.NODE_ENV === 'production' ? process.env.ADMIN_SECRET : 'LOCAL'
const ENROLL_SECRET = process.env.NODE_ENV === 'production' ? process.env.ENROLL_SECRET : 'LOCAL'

const db = require('../database')

router.get('/attendees', function(req, res, next) {
  const secret = req.body.secret
  if (secret !== ADMIN_SECRET) return res.sendStatus(403)

  db.from('attendees').select('*').then((list) => {
    res.send(list)
  })
});

router.get('/attendees/check-confirmed', function(req, res, next) {
  const secret = req.body.secret
  if (secret !== ADMIN_SECRET) return res.sendStatus(403)

  db.from('attendees').select('*').where({
    first_name: req.query.first_name.toLowerCase(),
    last_name: req.query.last_name.toLowerCase(),
  }).then((list) => {
    if (list[0]) {
      res.send(list[0].confirmed)
    }
    res.send(false)
  })
});

router.get('/attendees/:id/confirm', async function(req, res, next) {
  const secret = req.body.secret
  if (secret !== ADMIN_SECRET) return res.sendStatus(403)

  await db('attendees').where('id', req.params.id).update({ confirmed: req.body.confirmed })
  res.send(true)
});

router.get('/rsvps/:email', async function(req, res, next) {
  let rsvp = await db.from('rsvps').select('*').where({ email: req.params.email })
  rsvp = rsvp[0]

  const attendees = await db('attendees').select('*').where('rsvp_id', rsvp.id)

  res.send({
    rsvp,
    attendees,
  })
});

router.get('/rsvps', function(req, res, next) {
  const secret = req.body.secret
  if (secret !== ADMIN_SECRET) return res.sendStatus(403)

  db.from('rsvps').select('*').then((list) => {
    res.send(list)
  })
});

router.post('/rsvps', async function(req, res, next) {
  const secret = req.body.secret
  //  if (secret !== ENROLL_SECRET) return res.status(404).send({ error: 'bad_secret' })

  const newRsvp = req.body.rsvp
  const attendees = req.body.attendees

  //  Check if the RSVP doesnt exist
  let rsvp = await db.from('rsvps').select('*').where({ email: newRsvp.email })
  rsvp = rsvp[0]

  if (!rsvp) {
    //  Create rsvpv
    await db('rsvps').insert({
      email: newRsvp.email,
      phone: newRsvp.phone,
      attending: newRsvp.attending,
    })

    rsvp = await db.from('rsvps').select('*').where({ email: newRsvp.email })
    rsvp = rsvp[0]
    if (!rsvp) {
      return res.status(400).send({ error: 'unable_to_rsvp' })
    }
  }

  await db('rsvps').where({ id: rsvp.id }).update({ party_size: attendees.length, phone: newRsvp.phone })
  await db('attendees').where({ rsvp_id: rsvp.id }).del()

  for(var i = 0; i < attendees.length; i++) {
    const a = attendees[i]
    await db('attendees').insert({
      first_name: a.first_name.toLowerCase(),
      last_name: a.last_name.toLowerCase(),
      vegetarian: a.vegetarian,
      vegan: a.vegan,
      gluten_free: a.gluten_free,
      rsvp_id: rsvp.id
    })
  }

  res.send(true)

});

module.exports = router;
