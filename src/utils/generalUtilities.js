import { makeStyles } from '@material-ui/core/styles';
import * as Yup from 'yup';
import * as schema from './db/projectSchema.js';
/**
 * Description
 * @function formatDate
 * @param {date}  date
 * @returns {string} YYY-MM-DD
 **/
function formatDate(date) {
  let dd = date.getDate();
  let mm = date.getMonth() + 1;
  const yyyy = date.getFullYear();
  if (dd < 10) {
    dd = `0${dd}`;
  }

  if (mm < 10) {
    mm = `0${mm}`;
  }
  return `${yyyy}-${mm}-${dd}`;
}

const projectInfoValidationSchema = Yup.object({
  name: Yup.string('Enter a name').required('Name is required'),
  sponsor: Yup.string("Enter project sponsor's name."),
  projectManager: Yup.string("Enter project Manager's name."),
  projectType: Yup.string('Enter project type.'),
  creator: Yup.string('Project creator.'),
  problemOpportunity: Yup.string(
    'Describe the problem or opportunity this project addresses.',
  ),
  note: Yup.string('Notes on this project.'),
  start: Yup.date().default(() => new Date()),
  end: Yup.date()
    .default(() => new Date())
    .when(
      'start',
      (startDate, schema) => startDate && schema.min(startDate),
    ),
});
const stepNoteValidationSchema = Yup.object({
  note: Yup.string('Enter step notes.'),
});

const projectStyles = makeStyles(theme => ({
  progress: {
    margin: theme.spacing(2),
  },
  root: {
    width: '100%',
  },
  formControl: {
    marginTop: 5,
    minWidth: 300,
    padding: 20,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  buttonList: {
    width: 64,
    height: 64,
    paddingTop: 50,
  },
  button: {
    margin: theme.spacing(0),
    width: '100%',
    overflowX: 'auto',
  },
  paper: {
    margin: 10,
    width: '100%',
    overflowX: 'auto',
    padding: 20,
  },
  inputLabel: {
    padding: 30,
    margin: 20,
  },
  table: {
    marginTop: 10,
    marginBottom: 10,
    minWidth: 650,
  },
  container: {
    margin: 10,
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  dense: {
    marginTop: theme.spacing(2),
  },
  fab: {
    margin: theme.spacing(2),
  },
  absolute: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(3),
  },
}));

/**
 * Description
 * @function parseCommand
 * @param {string} commandString object.index.verb.location  project.0.delete workPackage.1.add.above
 * @returns {object} {actionObject, actionIndex, actionVerb, actionLocation}
 **/
function parseCommand(commandString) {
  const commands = commandString.toUpperCase().split('.');
  const actionObject = commands[0];
  const actionIndex = parseInt(commands[1], 10);
  let actionSecondIndex = parseInt(commands[2], 10);
  if (isNaN(actionSecondIndex)) actionSecondIndex = 0;
  const actionVerb = commands[2];
  const actionLocation = commands.length === 4 ? commands[3] : '';
  let action = {
    actionObject,
    actionIndex,
    actionSecondIndex,
    actionVerb,
    actionLocation,
  };
  return action;
}
/**
 * Description
 * @function percentageQuestionsYes
 * @param {array} questions
 * @returns {string}'50%' percentage of questions answered yes.
 **/
function percentageQuestionsYes(questions) {
  const numberYes = questions
    .map(question =>
      !question.skip && question.answer.toUpperCase() === 'YES'
        ? 1
        : 0,
    )
    .reduce((acc, val) => acc + val);

  const numberQuestions = questions.length;

  if (numberQuestions > 0) {
    const percentageResult = (numberYes / numberQuestions) * 100;
    return `${percentageResult.toFixed(0)}%`;
  } else {
    return '?/?';
  }
}

function percentageDeliverableQuestionsYes(deliverable) {
  let numberYes = 0;
  let numberQuestions = 0;
  deliverable.workPackages.forEach(workPackage => {
    numberYes += workPackage.questions
      .map(question =>
        !question.skip && question.answer.toUpperCase() === 'YES'
          ? 1
          : 0,
      )
      .reduce((acc, val) => acc + val);

    numberQuestions += workPackage.questions.length;
  });

  if (numberQuestions > 0) {
    const percentageResult = (numberYes / numberQuestions) * 100;
    return `${percentageResult.toFixed(0)}%`;
  } else {
    return '?/?';
  }
}

function percentageProjectQuestionsYes(project) {
  let numberYes = 0;
  let numberQuestions = 0;
  if (!project) return '?/?';
  project.deliverables.forEach(deliverable => {
    deliverable.workPackages.forEach(workPackage => {
      numberYes += workPackage.questions
        .map(question =>
          !question.skip && question.answer.toUpperCase() === 'YES'
            ? 1
            : 0,
        )
        .reduce((acc, val) => acc + val);

      numberQuestions += workPackage.questions.length;
    });
  });

  if (numberQuestions > 0) {
    let percentageResult = (numberYes / numberQuestions) * 100;
    return `${percentageResult.toFixed(0)}%`;
  } else {
    return '?/?';
  }
}
/**
 * Description
 * @function createNewProject
 * @param {string}  name of project
 * @param {string}  creator of project
 * @returns {project}
 **/

function createNewProject(
  name = 'New Project',
  creator = '',
  template = null,
) {
  let newProject = JSON.parse(
    JSON.stringify(template ? template : schema.projectSchema),
  );
  newProject.name = name;
  newProject.creator = creator;
  newProject.template = false;
  let today = new Date();
  let thirtyDaysFromNow = new Date(
    new Date().setDate(today.getDate() + 30),
  );
  newProject.start = formatDate(today);
  newProject.end = formatDate(thirtyDaysFromNow);
  return newProject;
}
/**
 * Description
 * @function copyProject
 * @param {object}  name of project
 * @param {string}  creator of project
 * @returns {project}
 **/

function copyProject(creator = '', oldProject = null) {
  let newProject = JSON.parse(JSON.stringify(oldProject));
  newProject.name = oldProject.name.concat(' (Copy)');
  newProject.creator = creator;
  return newProject;
}
/**
 * Description
 * @function updateProjectSchema
 * @param {object}  project
 * @returns {object} project project upgraded to latest schema
 **/

function updateProjectSchema(oldProject = null) {
  if (oldProject === null) {
    console.log(`updateProjectSchema(project === null)`);
    return null;
  }
  console.log(
    `updateProjectSchema for ${oldProject.name} from ${
      oldProject.version ? oldProject.version : '??'
    } to ${schema.SCHEMA_VERSION}`,
  );
  if (
    oldProject.version &&
    oldProject.version === schema.SCHEMA_VERSION
  )
    return oldProject; // already up to date

  // upgrading 191127
  if (oldProject.version && oldProject.version === '191127') {
    oldProject.learnings = '';
    return oldProject;
  }

  // create the project structure
  let newProject = JSON.parse(
    JSON.stringify(schema.projectSchemaEmpty),
  );

  // Copy all the values of the project
  Object.getOwnPropertyNames(newProject).forEach(key => {
    if (
      key !== 'deliverables' &&
      key !== 'version' &&
      oldProject.hasOwnProperty(key)
    )
      newProject[key] = oldProject[key];
  });

  // create the deliverable structure
  oldProject.stepTypes.forEach(stepType => {
    let newDeliverable = JSON.parse(
      JSON.stringify(schema.deliverableSchemaEmpty),
    );
    newDeliverable.name = stepType;
    newProject.deliverables.push(newDeliverable);
  });

  // change steps to workPackages
  oldProject.steps.forEach(step => {
    let deliverableIndex = newProject.deliverables.findIndex(
      deliverable => deliverable.name === step.stepType,
    );
    if (deliverableIndex === -1) deliverableIndex = 0;
    let newWorkPackage = JSON.parse(JSON.stringify(step));
    delete newWorkPackage.stepType; // not needed anymore
    newProject.deliverables[deliverableIndex].workPackages.push(
      newWorkPackage,
    );
  });
  return newProject;
}
/**
 * Description
 * @function createNewTemplate
 * @param {string}  name of project
 * @param {string}  creator of project
 * @param {object}  project to create template from
 * @returns {template}
 **/

function createNewTemplate(
  name = 'New Template',
  creator = '',
  project = null,
) {
  let newTemplate = JSON.parse(
    JSON.stringify(project ? project : schema.projectSchema),
  );
  newTemplate.name = name;
  newTemplate.creator = creator;
  newTemplate.template = true;
  return newTemplate;
}
/**
 * Description
 * @function createNewDeliverable
 * @param {string}  name of step
 * @param {string}  stepType
 * @returns {step}
 **/

function createNewDeliverable(name = 'New Deliverable') {
  let newDeliverable = JSON.parse(
    JSON.stringify(schema.deliverableSchema),
  );
  newDeliverable.name = name;
  return newDeliverable;
}
/**
 * Description
 * @function createNewWorkPackage
 * @param {string}  name of step
 * @param {string}  stepType
 * @returns {step}
 **/

function createNewWorkPackage(name = 'New Work Package') {
  let newWorkPackage = JSON.parse(
    JSON.stringify(schema.workPackageSchema),
  );
  newWorkPackage.name = name;
  return newWorkPackage;
}
/**
 * Description
 * @function createNewQuestion
 * @param {string}  name of question
 * @returns {question}
 **/

function createNewQuestion(name = 'New Step') {
  let newQuestion = JSON.parse(JSON.stringify(schema.questionSchema));
  newQuestion.name = name;
  return newQuestion;
}
/**
 * Description
 * @function toTitleCase
 * @param {string}  phrase
 * @returns {string} phrase with each first letter capitalized.
 **/
const toTitleCase = phrase => {
  return phrase
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
export {
  percentageQuestionsYes,
  percentageDeliverableQuestionsYes,
  percentageProjectQuestionsYes,
  parseCommand,
  projectStyles,
  projectInfoValidationSchema,
  stepNoteValidationSchema,
  formatDate,
  createNewProject,
  copyProject,
  createNewTemplate,
  createNewWorkPackage,
  createNewDeliverable,
  createNewQuestion,
  toTitleCase,
  updateProjectSchema,
};
