const questionSchema = {
  name: 'Do you have what you need before you can start this step?',
  validAnswers: ' ',
  answer: ' ',
  note: 'Note',
  help: ' ',
  answerHistory: [],
};
const workPackageSchema = {
  name: 'Work Package',
  note: 'Note',
  help: 'How was this project initiated? Basic PM Slides',
  started: false,
  startedDate: '',
  completed: false,
  completedDate: '',
  assignedTo: '',
  questions: [
    {
      name:
        'Is someone assigned to ensure this work package is completed?',
      validAnswers: ' ',
      answer: ' ',
      note: 'Note',
      help: ' ',
      answerHistory: [],
    },
    {
      name:
        'Do you have what you need before you can start this work package?',
      validAnswers: ' ',
      answer: ' ',
      note: 'Note',
      help: ' ',
      answerHistory: [],
    },
    {
      name:
        'Are there any tasks or work packages that need to be completed before this work package can start?',
      validAnswers: ' ',
      answer: ' ',
      note: 'Note',
      help: ' ',
      answerHistory: [],
    },
    {
      name: 'Has this work package started?',
      validAnswers: ' ',
      answer: ' ',
      note: 'Note',
      help: ' ',
      answerHistory: [],
    },

    {
      name: '(Enter a work package related question)',
      validAnswers: ' ',
      answer: ' ',
      note: 'Note',
      help: ' ',
      answerHistory: [],
    },
    {
      name:
        'Have you determined the completion criteria for this work package?',
      validAnswers: ' ',
      answer: ' ',
      note: 'Note',
      help: ' ',
      answerHistory: [],
    },
    {
      name: 'Has this work package been completed?',

      validAnswers: ' ',
      answer: ' ',
      note: 'Note',
      help: ' ',
      answerHistory: [],
    },
  ],
};
const deliverableSchema = {
  name: 'Define the Project',
  note: 'Note',
  help: 'How was this project initiated? Basic PM Slides',
  started: false,
  startedDate: '',
  completed: false,
  completedDate: '',
  assignedTo: '',
  workPackages: [workPackageSchema],
};

const projectSchema = {
  creator: 'Shawn Griffin',
  deliverables: [deliverableSchema],
  end: '2019-10-17',
  goalsAndObjectives: 'Goals And Objectives',
  help:
    'How was this project initiated? Basic PM Slides\nWho will be the sponsor?\n',
  name: 'New Project',
  note: 'notes',
  problemOpportunity: 'Presenting problem / Opportunity',
  projectManager: 'Harry Belafonte',
  projectPriorities: 'Project Priorities',
  sharedWith: [],
  sponsor: 'Stephen Stofanak',
  start: '2019-09-17',
  template: false,
  templateName: 'Standard',
  version: '191127',
};

export {
  projectSchema,
  deliverableSchema,
  workPackageSchema,
  questionSchema,
};
