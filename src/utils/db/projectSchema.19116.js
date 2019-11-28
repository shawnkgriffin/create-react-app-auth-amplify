const projectSchema = {
  creator: 'Shawn Griffin',
  end: '2019-10-17',
  help:
    'How was this project initiated? Basic PM Slides\nWho will be the sponsor?\n',
  id: '',
  name: 'New Project',
  note: 'notes',
  problemOpportunity: 'Presenting problem / Opportunity',
  projectManager: 'Harry Belafonte',
  sharedWith: [],
  sponsor: 'Stephen Stofanak',
  start: '2019-09-17',
  template: false,
  templateName: 'Standard',
  stepTypes: [
    'Define the Project',
    'Deliverables',
    'Analyze the Project',
    'Implement the Project',
  ],
  version: '191116',
  phases: [
    { name: 'Define the Project', help: 'Phase help.' },
    { name: 'Deliverables', help: 'Phase help.' },
    { name: 'Analyze the Projec', help: 'Phase help.' },
    { name: 'Implement the Project', help: 'Phase help.' },
  ],
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
