const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Card = require('../models/card');
const mid = require('../middleware');


// GET /cpanel
router.get('/', mid.requireRole, (req, res, next) => {
  return res.redirect('/cpanel/add');
});

// GET /cpanel/add
router.get('/add', mid.requireRole, (req, res, next) => {
  return res.render('add', {
    title: 'Adaugă Conţinut',
    session: req.session || req.session.userId
  });
});

// POST /cpanel/add
router.post('/add', (req, res, next) => {
  if(req.body.title &&
    req.body.author &&
    req.body.selectGenre &&
    req.body.question1 &&
    req.body.answer1) {

      let cardData = {
        title: req.body.title,
        author: req.body.author,
        year: req.body.year,
        genre: req.body.selectGenre,
        questions: [
          {
            question: req.body.question1,
            answer: req.body.answer1
          }
        ]
      };

      cardData.search = cardData.title.toSearch();

      /* push extra questions if exists */
      let i = 2;
      while(eval(`req.body.question${i}`)) {
        cardData.questions.push({
          question: eval(`req.body.question${i}`),
          answer: eval(`req.body.answer${i}`)
        });
        i++;
      }


      Card.create(cardData, function(error, card) {
        if(error) {
          return next(error);
        } else {
          const err = new Error('Conţinut adăugat cu succes!');
          err.status = 201;
          return next(err);
        }
      });
  }
});

module.exports = router;
