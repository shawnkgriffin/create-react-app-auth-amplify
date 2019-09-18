/**
 * Description
 * @function initProject
 * @param {integer}  
 * @param {function} callback 
 * @param {string}  
 * @returns {string} status 200 success.
 **/

function percentageQuestionsYes(questions) {
  let numberYes = questions.map((question) => question.answer.toUpperCase() === "YES" ? 1 : 0 ).reduce((acc, val) => acc + val);;
  let numberSkipped = questions.map((question) => question.skip ? 1 : 0 ).reduce((acc, val) => acc + val);
  let numberQuestions = questions.length - numberSkipped;

  if (numberQuestions > 0 ) {
    let percentageResult = numberYes/numberQuestions*100.
    return(`(Y=${percentageResult.toFixed(0)}%)`)

  } else {
    return('?/?')
  }

}

export { percentageQuestionsYes }