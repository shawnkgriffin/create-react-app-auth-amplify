/**
 * Description
 * @function initProject
 * @param {integer}  
 * @param {function} callback 
 * @param {string}  
 * @returns {string} status 200 success.
 **/
function parseCommand(commandString) {
  const commands = commandString.toUpperCase().split(".");
  let action = {
    actionObject: commands[0],
    actionIndex: parseInt(commands[1], 10),
    actionVerb: commands[2],
    actionLocation: commands.length === 4 ? commands[3] : ""
  }
  return (action);

}
function percentageQuestionsYes(questions) {
  let numberYes = questions.map((question) => (!question.skip && question.answer.toUpperCase() === "YES") ? 1 : 0 ).reduce((acc, val) => acc + val);;
  let numberSkipped = questions.map((question) => question.skip ? 1 : 0 ).reduce((acc, val) => acc + val);
  let numberQuestions = questions.length - numberSkipped;

  if (numberQuestions > 0 ) {
    let percentageResult = numberYes/numberQuestions*100.
    return(`(${percentageResult.toFixed(0)}%)`)

  } else {
    return('?/?')
  }

}
function createNewProject() {
  let project = require('./db/project.json');
  return (project);
}

export { percentageQuestionsYes, createNewProject, parseCommand }