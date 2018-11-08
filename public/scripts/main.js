'use strict';
/*====================
  Form
====================*/
const $input = $('input, textarea');
const $form = $('form');
const email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const $password = $('#password');
const $confirmPassword = $('#confirmPassword');

/* check if passwords match */
function validatePassword() {
  if($password.val() != $confirmPassword.val()) {
    confirmPassword.setCustomValidity('Parolele nu se potrivesc');
  } else {
    confirmPassword.setCustomValidity('');
  }
}

$password.on('invalid change', validatePassword);
$confirmPassword.on('invalid keyup', validatePassword);


/* add or remove hasValue class */
$(document).on('focusout','input, textarea', function(e) {
  if($(this).val().length > 0) {
    $(this).addClass('hasValue');
  } else {
    $(this).removeClass('hasValue');
  }
});




$input.each(function() {
  if($(this).val().length > 0) {
    $(this).addClass('hasValue');
  } else {
    $(this).removeClass('hasValue');
  }
});

/*====================
  Quiz
====================*/

/* disable buttons previous and next */
$(document).ready(function() {
  const $currentQuestion = $('.current-question');
  const $totalQuestions = $('.total-questions');
  const current_question = parseInt($currentQuestion.text());
  const total_questions = parseInt($totalQuestions.text());
  const $previousQuestion = $('.previous-question');
  const $nextQuestion = $('.next-question');

  if(current_question === 1) {
    //$previousQuestion.prop('disabled', true).addClass('disabled-button');
    $previousQuestion.addClass('disabled-button').click(function(event){
      event.preventDefault();
    });

  } else {
    $previousQuestion.removeClass('disabled-button');
  }

  if(current_question === total_questions) {
    $nextQuestion.addClass('disabled-button').click(function(event){
      event.preventDefault();
    });
  } else {
    $nextQuestion.removeClass('disabled-button');
  }
});

/* Show answer */
$('.show-answer').on('click', function() {
  $(this).css('display', 'none');
  $('.answer').css('visibility', 'visible');
});



/* add */
let i = 1;
$('#addFields').on('click', function() {

  i=i+1;
  $(`
  <div class="question-container">
    <div class="question-number">
      <h2 class="color-purple">Întrebarea ${i}</h2>
    </div>
    <div class="input-container">
      <input id="question${i}" type="text" name="question${i}">
      <label for="question${i}" class="color-gray noselect">Întrebare</label>
      <div class="line bgcolor-purple"></div>
    </div> <!-- end question -->
    <div class="input-container input-answer">
      <textarea id="answer${i}" name="answer${i}"></textarea>
      <label for="answer${i}" class="color-gray noselect">Răspuns</label>
      <div class="line bgcolor-purple"></div>
    </div>
  </div>

  `).insertBefore('.addFields-container');
});
