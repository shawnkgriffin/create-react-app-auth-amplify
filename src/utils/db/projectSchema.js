const projectSchema = {
  version: '191116',
  name: 'New Project',
  problemOpportunity: 'Presenting problem / Opportunity',
  creator: 'Shawn Griffin',
  note: 'notes',
  sponsor: 'Stephen Stofanak',
  projectManager: 'Harry Belafonte',
  templateName: 'Standard',
  template: false,
  start: '2019-09-17',
  end: '2019-10-17',
  stepTypes: [
    'Define the Project',
    'Deliverables',
    'Analyze the Project',
    'Implement the Project',
  ],
  sharedWith: [],
  phases: [
    { name: 'Define the Project', help: 'Phase help.' },
    { name: 'Deliverables', help: 'Phase help.' },
    { name: 'Analyze the Projec', help: 'Phase help.' },
    { name: 'Implement the Project', help: 'Phase help.' },
  ],
  help:
    'How was this project initiated? Basic PM Slides\nWho will be the sponsor?\n',
  steps: [
    {
      name: 'Project Background',
      note: 'Note.',
      stepType: 'Define the Project',
      help: 'How was this project initiated? Basic PM Slides',
      started: false,
      startedDate: '',
      completed: false,
      completedDate: '',
      assignedTo: '',
      questions: [
        {
          name:
            'Do you have what you need before you can start this step?',
          validAnswers: ' ',
          answer: ' ',
          note: 'Note',
          help: ' ',
          answerHistory: [],
        },
      ],
    },
  ],
};

const stepSchema = {
  name: 'Work Package',
  note: 'Note',
  stepType: 'Define the Project',
  help: 'How was this project initiated? Basic PM Slides',
  started: false,
  startedDate: '',
  completed: false,
  completedDate: '',
  assignedTo: '',
  questions: [
    {
      name:
        'Do you have what you need before you can start this step?',
      validAnswers: ' ',
      answer: ' ',
      note: 'Note',
      help: ' ',
      answerHistory: [],
    },
  ],
};

const questionSchema = {
  name: 'Do you have what you need before you can start this step?',
  validAnswers: ' ',
  answer: ' ',
  note: 'Note',
  help: ' ',
  answerHistory: [],
};
export { projectSchema, stepSchema, questionSchema };
