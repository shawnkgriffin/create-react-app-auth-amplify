import { makeStyles } from "@material-ui/core/styles";
import * as Yup from "yup";

const projectInfoValidationSchema = Yup.object({
  name: Yup.string("Enter a name").required("Name is required"),
  sponsor: Yup.string("Enter project sponsor's name."),
  projectManager: Yup.string("Enter project Manager's name."),
  projectType: Yup.string("Enter project type."),
  creator: Yup.string("Project creator."),
  problemOpportunity: Yup.string(
    "Describe the problem or opportunity this project addresses."
  ),
  note: Yup.string("Notes on this project."),
  start: Yup.date().default(() => new Date()),
  end: Yup.date()
    .default(() => new Date())
    .when("start", (startDate, schema) => startDate && schema.min(startDate))
});

const projectStyles = makeStyles(theme => ({
  progress: {
    margin: theme.spacing(2),
  },
  root: {
    width: "100%"
  },
  formControl: {
    marginTop: 5,
    minWidth: 300,
    padding: 20,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  },
  buttonList: {
    width: 64,
    height: 64,
    paddingTop: 50
  },
  button: {
    margin: theme.spacing(0),
    width: "100%",
    overflowX: "auto"
  },
  paper: {
    margin: 10,
    width: "100%",
    overflowX: "auto",
    padding: 20
  },
  inputLabel: {
    padding: 30,
    margin: 20
  },
  table: {
    marginTop: 10,
    marginBottom: 10,
    minWidth: 650
  },
  container: {
    margin: 10,
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    width: 400,
  },
  dense: {
    marginTop: theme.spacing(2)
  },
  fab: {
    margin: theme.spacing(2)
  },
  absolute: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(3)
  }
}));

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
  let numberYes = questions.map((question) => (!question.skip && question.answer.toUpperCase() === "YES") ? 1 : 0).reduce((acc, val) => acc + val);;
  let numberSkipped = questions.map((question) => question.skip ? 1 : 0).reduce((acc, val) => acc + val);
  let numberQuestions = questions.length - numberSkipped;

  if (numberQuestions > 0) {
    let percentageResult = numberYes / numberQuestions * 100.
    return (`(${percentageResult.toFixed(0)}%)`)

  } else {
    return ('?/?')
  }

}
function createNewProject() {
  let project = require('./db/project.json');
  return (project);
}

export {
  percentageQuestionsYes, createNewProject,
  parseCommand, projectStyles, projectInfoValidationSchema
}