const express = require('express');
const router = express.Router();
const Card = require('../models/card');
const mid = require('../middleware');


router.get('/random', (req, res, next) => {
    Card.find().exec(function(error, card) {
      if(error) {
        return next(error);
      } else {
        let randomCard = card[Math.floor(Math.random()*card.length)].search.toURI();
        return res.redirect(`/${randomCard}`);
      }
    });
});

router.get('/:card', mid.requireLogin,  mid.logoutNoSession, (req, res, next) => {
  let question = req.query.question; // query string
  let cards = req.params.card; // :card paramater

  // Convert the req.params.card so that we can find in database
  /*let uri_card = req.params.card.toLowerCase().trim(); // lower case and trim
  uri_card = uri_card.replace(/-/g, ' '); // replace "-" with " "*/
  let uri_card = req.params.card.fromURItoString();

  Card.findOne({'search': {$regex: new RegExp(uri_card, 'i')}
}, function(error, card) {
    if(error) {
      return next(error);
    }
    if(!card) {
      return next();
    } else {
        if(!question) {
          return res.redirect(`/${cards}?question=1`);
        }

        /*let URI_card = card.title.toLowerCase().trim(); // lower case and trim
        URI_card = URI_card.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,""); // remove punctuation
        URI_card = URI_card.replace(/\s+/g, '-'); //replace the space with "-"*/
        let URI_card = card.title.toURI().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        let query_question = parseInt(req.query.question); // convert from string to number
        let questions_length = card.questions.length; // total questions


        if(!query_question || // if query_question is NaN
           query_question > questions_length  // if current question is higher than total number of questions
           || query_question < 1) { // if current question value is less than 1
          return next(); // will return a 404 error
        }

        const templateData = {
          title: card.title, // set a title
          session: req.session || req.session.userId, // show navigation
          current_question: query_question, // current question
          total_questions: questions_length, // total questions
          question: card.questions[query_question - 1].question, // question
          answer: card.questions[query_question - 1].answer, // answer
          cardName: URI_card
        }
        if(req.params.card === URI_card.toLowerCase()) {
          res.render('card', templateData);
        } else {
          return next();
        }
      }
  });
});

module.exports = router;
