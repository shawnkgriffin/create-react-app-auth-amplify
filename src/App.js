import './App.css';
import React, { Component } from 'react';
import { Formik } from 'formik';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  createMuiTheme,
  MuiThemeProvider,
} from '@material-ui/core/styles';

// Project components
import ProjectInfo from './components/ProjectInfo';
import ProjectWorkPackages from './components/ProjectWorkPackages';
import ProjectQuestions from './components/ProjectQuestions';
import ProjectWorkPackageInfo from './components/ProjectWorkPackageInfo';
import Alert from './components/Alert';
import FormDialog from './components/FormDialog';
import Help from './components/Help';
import SignIn from './components/SignIn';
import ButtonAppBar from './components/ButtonAppBar';

//Project database and utilities
import * as utils from './utils/generalUtilities.js';
import * as schema from './utils/db/projectSchema';

// Firebase components
// import app from 'firebase/app';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};
firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();

const theme = createMuiTheme({
  overrides: {
    // Style sheet name
    sizeSmall: { padding: '6px 6px 6px 6x' },
  },
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      templates: [],
      currentProject: 0,
      currentDeliverable: 0,
      currentWorkPackage: 0,
      isAuthenticated: false,
      isAuthenticating: true,
      authEditTemplate: false,
      user: null,
      commandString: '',
      alert: false,
      alertYesButton: true,
      permissionEditTemplate: false,
      title: '',
      text: '',
      textLabel: '',
      form: false,
      formType: '',
      help: false,
      projectInfoEdit: false,
      changed: false,
    };
    this.handleQuestionChange = this.handleQuestionChange.bind(this);
    this.handleWorkPackageStartEnd = this.handleWorkPackageStartEnd.bind(
      this,
    );
    this.handleProjectInfoChange = this.handleProjectInfoChange.bind(
      this,
    );
    this.handleWorkPackageChange = this.handleWorkPackageChange.bind(
      this,
    );
    this.handleMenu = this.handleMenu.bind(this);
    this.handleYes = this.handleYes.bind(this);
    this.handleNo = this.handleNo.bind(this);
    this.getUserData = this.getUserData.bind(this);
  }

  getUserData(user) {
    console.log(`  getUserData(${user})`);
    if (!user) {
      this.setState(prevState => {
        return {
          ...prevState,
          user,
        };
      });
      return;
    }

    console.log(
      `componentDidMount/onAuthStateChanged(${user.email})`,
    );
    //TODO when auth switched to google set up permissions.
    const authEditTemplate =
      user.email === 'shawn@shawngriffin.com' ||
      user.email === 'stephen@continuousbusinesschange.com';

    // get the users projects
    db.collection('projects')
      .where('creator', '==', user.email)
      .get()
      .then(querySnapshot => {
        let projects = [];
        querySnapshot.forEach(doc => {
          let project = doc.data();
          project.id = doc.id;
          console.log(
            `componentDidMount/onAuthStateChanged/db.collection projects(${project.id})`,
          );
          if (!project.template)
            projects.push(utils.updateProjectSchema(project)); // handle templates next
        });

        // get shared projects
        db.collection('projects')
          .where('sharedWith', 'array-contains', user.email)
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              let project = doc.data();
              project.id = doc.id;
              console.log(
                `componentDidMount/onAuthStateChanged/db.collection projects(${project.id})`,
              );
              if (!project.template) {
                projects.push(project); // handle templates next
              }
            });

            if (projects.length === 0) {
              let newProject = utils.createNewProject(
                'New Project',
                user.email,
              );

              db.collection('projects')
                .add(newProject)
                .then(docRef => {
                  newProject.id = docRef.id;
                  projects.push(newProject);
                  projects.sort((p1, p2) =>
                    p1.template === p2.template
                      ? p1.name < p2.name
                        ? -1
                        : p1.name === p2.name
                        ? 0
                        : 1
                      : p1.template
                      ? 1
                      : -1,
                  );

                  this.setState(prevState => {
                    return {
                      ...prevState,
                      projects: projects,
                      currentProject: 0,
                      currentWorkPackage: 0,
                      user,
                      authEditTemplate,
                    };
                  });
                });
            } else
              this.setState(prevState => {
                if (this.state.templates.length && authEditTemplate)
                  this.state.templates.forEach(template =>
                    projects.push(template),
                  );
                projects.sort((p1, p2) =>
                  p1.template === p2.template
                    ? p1.name < p2.name
                      ? -1
                      : p1.name === p2.name
                      ? 0
                      : 1
                    : p1.template
                    ? 1
                    : -1,
                );
                return {
                  ...prevState,
                  projects: projects,
                  currentProject: 0,
                  user,
                  authEditTemplate,
                };
              });
          })
          .catch(function(error) {
            console.log('Error getting projects: ', error);
          });
      });

    // get templates
    db.collection('projects')
      .where('template', '==', true)
      .get()
      .then(querySnapshot => {
        let templates = [];
        querySnapshot.forEach(doc => {
          let template = doc.data();
          template.id = doc.id;
          console.log(
            `componentDidMount/onAuthStateChanged/db.collection templates(${template.id})`,
          );
          templates.push(template);
        });

        if (templates.length === 0) {
          let newTemplate = utils.createNewTemplate(
            'New Template',
            user.email,
          );

          db.collection('projects')
            .add(newTemplate)
            .then(docRef => {
              newTemplate.id = docRef.id;
              templates.push(newTemplate);
              this.setState(prevState => {
                templates.sort((p1, p2) =>
                  p1.name < p2.name
                    ? -1
                    : p1.name === p2.name
                    ? 0
                    : 1,
                );
                return {
                  ...prevState,
                  templates: templates,
                };
              });
            });
        } else
          this.setState(prevState => {
            templates.sort((p1, p2) =>
              p1.name < p2.name ? -1 : p1.name === p2.name ? 0 : 1,
            );
            return {
              ...prevState,
              templates: templates,
            };
          });
      })
      .catch(function(error) {
        console.log('Error getting templates: ', error);
      });
  }

  componentDidMount() {
    firebase
      .auth()
      .onAuthStateChanged(user => this.getUserData(user));
  }

  handleQuestionChange(e) {
    e.preventDefault();
    e.stopPropagation();

    if (this.state != null) {
      let { projects, currentProject } = this.state;
      let project = projects[currentProject];
      const [
        deliverableString,
        workPackageString,
        questionString,
        answer,
      ] = e.target.value.split('.');
      const deliverableIndex = parseInt(deliverableString, 10);
      const workPackageIndex = parseInt(workPackageString, 10);
      const questionNumber = parseInt(questionString, 10);
      console.log(
        `handleQuestionChange(${e.target.value},${workPackageIndex},${deliverableIndex},${questionNumber})`,
      );
      if (
        deliverableIndex >= 0 &&
        deliverableIndex < project.deliverables.length &&
        workPackageIndex >= 0 &&
        workPackageIndex <
          project.deliverables[deliverableIndex].workPackages
            .length &&
        questionNumber >= 0 &&
        questionNumber <
          project.deliverables[deliverableIndex].workPackages[
            workPackageIndex
          ].questions.length
      ) {
        project.deliverables[deliverableIndex].workPackages[
          workPackageIndex
        ].questions[questionNumber].answer = answer;
        projects[currentProject] = project;
        this.setState(prevState => {
          return {
            ...prevState,
            projects: projects,
            changed: false,
          };
        });
        db.collection('projects')
          .doc(project.id)
          .set(project)
          .catch(function(error) {
            console.log(
              `Error writing project ${project.id}${error}`,
            );
          });
      }
    }
  }

  handleWorkPackageStartEnd(response) {
    if (this.state != null) {
      let {
        projects,
        currentProject,
        currentDeliverable,
        currentWorkPackage,
      } = this.state;
      let workPackage =
        projects[currentProject].deliverables[currentDeliverable]
          .workPackages[currentWorkPackage];

      // handle the case where the person has clicked off started but completed was still checked
      if (!response.started) response.completed = false;
      workPackage = { ...workPackage, ...response };
      projects[currentProject].deliverables[
        currentDeliverable
      ].workPackages[currentWorkPackage] = workPackage;

      db.collection('projects')
        .doc(projects[currentProject].id)
        .set(projects[currentProject])
        .then(() =>
          this.setState(prevState => {
            return {
              ...prevState,
              projects: projects,
              changed: false,
            };
          }),
        )
        .catch(function(error) {
          console.log(
            `Error writing  project ${projects[currentProject].id}${error}`,
          );
        });
    }
  }

  handleProjectInfoChange(changedProjectInfo) {
    if (this.state != null) {
      let { projects, currentProject } = this.state;

      let project = {
        ...projects[currentProject],
        ...changedProjectInfo,
      };
      const currentProjectId = project.id;
      projects[currentProject] = project;
      projects.sort((p1, p2) =>
        p1.template === p2.template
          ? p1.name < p2.name
            ? -1
            : p1.name === p2.name
            ? 0
            : 1
          : p1.template
          ? 1
          : -1,
      );
      currentProject = projects.findIndex(
        project => project.id === currentProjectId,
      );
      if (currentProject < 0 || currentProject >= projects.length)
        currentProject = 0;

      this.setState(prevState => {
        return {
          ...prevState,
          projects: projects,
          currentProject: currentProject,
          changed: true,
        };
      });
    }
  }

  handleWorkPackageChange(newDeliverable, newWorkPackage) {
    if (this.state != null) {
      console.log(
        `handleWorkPackageChange(${newDeliverable}, ${newWorkPackage})`,
      );
      let { projects, currentProject } = this.state;
      let project = projects[currentProject];
      if (
        newDeliverable < 0 ||
        newDeliverable >= project.deliverables.length
      )
        newDeliverable = 0;
      if (
        newWorkPackage < 0 ||
        newWorkPackage >=
          project.deliverables[newDeliverable].workPackages.length
      )
        newWorkPackage = 0;
      this.setState(prevState => {
        return {
          ...prevState,
          changed: false,
          currentDeliverable: newDeliverable,
          currentWorkPackage: newWorkPackage,
        };
      });
    }
  }
  handleYes(response) {
    let newText = response.newText;
    console.log(
      `handleYes(e=${newText},commandString=${this.state.commandString}`,
    );
    let action = utils.parseCommand(this.state.commandString);
    let {
      projects,
      currentWorkPackage,
      currentDeliverable,
      currentProject,
      commandString,
      templates,
    } = this.state;
    let project = projects[currentProject];

    if (action.target === 'QUESTION') {
      switch (action.verb) {
        case 'ADD':
          const newQuestion = utils.createNewQuestion(newText);
          action.index =
            action.index + (action.location === 'ABOVE' ? 0 : 1);
          project.deliverables[currentDeliverable].workPackages[
            currentWorkPackage
          ].questions.splice(action.index, 0, newQuestion);
          break;
        case 'EDIT':
          project.deliverables[currentDeliverable].workPackages[
            currentWorkPackage
          ].questions[action.index].name = newText;
          break;
        case 'EDITHELP':
          project.deliverables[currentDeliverable].workPackages[
            currentWorkPackage
          ].questions[action.index].help = newText;
          break;
        case 'DELETE':
          if (
            project.deliverables[currentDeliverable].workPackages[
              currentWorkPackage
            ].questions.length > 1
          )
            project.deliverables[currentDeliverable].workPackages[
              currentWorkPackage
            ].questions.splice(action.index, 1);
          else
            console.error(
              `Cannot delete last question ${commandString}`,
            );
          break;
        default:
      }
      projects[currentProject] = project;
      this.setState(prevState => {
        return {
          ...prevState,
          projects: projects,
          alert: false,
          alertYesButton: true,
          form: false,
          formType: '',
          help: false,
          commandString: '',
          currentWorkPackage: currentWorkPackage,
          currentProject: currentProject,
          changed: true,
        };
      });
    } else if (action.target === 'WORK PACKAGE') {
      switch (action.verb) {
        case 'ADD':
          const newWorkPackage = utils.createNewWorkPackage(newText);

          action.secondIndex =
            action.secondIndex +
            (action.location === 'ABOVE' ? 0 : 1);
          project.deliverables[action.index].workPackages.splice(
            action.secondIndex,
            0,
            newWorkPackage,
          );
          currentDeliverable = action.index;
          currentWorkPackage = action.secondIndex;
          break;
        case 'EDIT':
          project.deliverables[action.index].workPackages[
            action.secondIndex
          ].name = newText;
          break;
        case 'EDITHELP':
          project.deliverables[action.index].workPackages[
            action.secondIndex
          ].help = newText;
          break;
        case 'NOTES':
          project.deliverables[action.index].workPackages[
            action.secondIndex
          ].note = newText;
          break;
        case 'DELETE':
          if (
            project.deliverables[action.index].workPackages.length > 1
          ) {
            project.deliverables[action.index].workPackages.splice(
              action.secondIndex,
              1,
            );
            currentWorkPackage = 0;
          } else
            console.error(
              `Cannot delete last work package ${commandString}`,
            );
          break;
        case 'HELP':
          break;
        default:
      }
      projects[currentProject] = project;
      this.setState(prevState => {
        return {
          ...prevState,
          projects: projects,
          alert: false,
          alertYesButton: true,
          form: false,
          formType: '',
          help: false,
          commandString: '',
          currentWorkPackage: currentWorkPackage,
          currentProject: currentProject,
          changed: true,
        };
      });
    }
    if (action.target === 'DELIVERABLE') {
      switch (action.verb) {
        case 'ADD':
          action.index =
            action.index + (action.location === 'ABOVE' ? 0 : 1);
          let newDeliverable = JSON.parse(
            JSON.stringify(schema.deliverableSchema),
          );
          newDeliverable.name = newText;
          project.deliverables.splice(
            action.index,
            0,
            newDeliverable,
          );
          currentWorkPackage = 0;
          currentDeliverable = action.index;
          break;
        case 'EDIT':
          project.deliverables[action.index].name = newText;
          break;
        case 'EDITHELP':
          project.deliverables[action.index].help = newText;
          break;
        case 'DELETE':
          if (project.deliverables.length > 1) {
            project.deliverables.splice(action.index, 1);
            currentDeliverable = 0;
            currentWorkPackage = 0;
          } else
            console.error(
              `Cannot delete last deliverable ${commandString}`,
            );
          break;
        case 'HELP':
          break;
        default:
      }
      projects[currentProject] = project;
      this.setState(prevState => {
        return {
          ...prevState,
          projects: projects,
          alert: false,
          alertYesButton: true,
          form: false,
          formType: '',
          help: false,
          commandString: '',
          currentWorkPackage: currentWorkPackage,
          currentProject: currentProject,
          changed: true,
        };
      });
    }

    if (action.target === 'PROJECT') {
      switch (action.verb) {
        case 'ADD':
          // Figure out which template to use.
          let templateIndex = 0;
          if (typeof response.template !== 'undefined') {
            templateIndex = this.state.templates.findIndex(
              template => template.templateName === response.template,
            );
            if (templateIndex === -1) templateIndex = 0;
            console.log(
              `AddProject(${response.template}, ${templateIndex})`,
            );
          }
          // TODO use template selected to create project
          let newProject = utils.createNewProject(
            newText,
            this.state.user.email,
            this.state.templates[templateIndex],
          );
          db.collection('projects')
            .add(newProject)
            .then(docRef => {
              newProject.id = docRef.id;
              projects.push(newProject);
              projects.sort((p1, p2) =>
                p1.template === p2.template
                  ? p1.name < p2.name
                    ? -1
                    : p1.name === p2.name
                    ? 0
                    : 1
                  : p1.template
                  ? 1
                  : -1,
              );
              currentProject = projects.findIndex(
                project => project.id === newProject.id,
              );
              if (
                currentProject < 0 ||
                currentProject >= projects.length
              )
                currentProject = 0;
              this.setState(prevState => {
                return {
                  ...prevState,
                  projects: projects,
                  currentProject: currentProject,
                  currentWorkPackage: 0,
                  alert: false,
                  alertYesButton: true,
                  form: false,
                  formType: '',
                  help: false,
                  commandString: '',
                };
              });
            });
          break;

        case 'PROBLEMOPPORTUNITY':
          project.problemOpportunity = newText;
          this.setState(prevState => {
            return {
              ...prevState,
              projects: projects,
              alert: false,
              alertYesButton: true,
              form: false,
              help: false,
              commandString: '',
              currentWorkPackage: currentWorkPackage,
              currentProject: currentProject,
              changed: true,
            };
          });
          break;
        case 'PROJECTNOTES':
          project.note = newText;
          this.setState(prevState => {
            return {
              ...prevState,
              projects: projects,
              alert: false,
              alertYesButton: true,
              form: false,
              help: false,
              commandString: '',
              currentWorkPackage: currentWorkPackage,
              currentProject: currentProject,
              changed: true,
            };
          });
          break;
        case 'SHARE':
          project.sharedWith = newText.replace(/\n/g, ',').split(',');
          this.setState(prevState => {
            return {
              ...prevState,
              projects: projects,
              alert: false,
              alertYesButton: true,
              form: false,
              help: false,
              commandString: '',
              currentWorkPackage: currentWorkPackage,
              currentProject: currentProject,
              changed: true,
            };
          });
          break;
        case 'HELP':
          project.help = newText;
          this.setState(prevState => {
            return {
              ...prevState,
              projects: projects,
              alert: false,
              alertYesButton: true,
              form: false,
              help: false,
              commandString: '',
              currentWorkPackage: currentWorkPackage,
              currentProject: currentProject,
              changed: true,
            };
          });
          break;
        case 'DELETE':
          if (projects.length > 1) {
            db.collection('projects')
              .doc(projects[currentProject].id)
              .delete()
              .catch(function(error) {
                console.log(
                  `Error deleting project ${projects[currentProject].id}${error}`,
                );
              });
            projects.splice(currentProject, 1);
            currentProject = 0;
            this.setState(prevState => {
              return {
                ...prevState,
                projects: projects,
                alert: false,
                alertYesButton: true,
                form: false,
                help: false,
                commandString: '',
                currentWorkPackage: currentWorkPackage,
                currentProject: currentProject,
                changed: false,
              };
            });
          } else
            console.error(
              `Cannot delete last project ${commandString}`,
            );
          break;
        default:
      }
    }
    if (action.target === 'TEMPLATE') {
      switch (action.verb) {
        case 'SAVE':
          db.createTemplate(
            newText,
            projects[currentProject],
            this.state.user,
            newTemplate => {
              templates.push(newTemplate);

              this.setState(prevState => {
                return {
                  ...prevState,
                  alert: false,
                  alertYesButton: true,
                  form: false,
                  help: false,
                  commandString: '',
                  changed: false,
                  templates: templates,
                };
              });
              console.log(`Template Save ${newTemplate.id}`);
            },
          );
          break;
        case 'EDIT':
          if (this.state.authEditTemplate) {
            project.help = newText;
            this.setState(prevState => {
              return {
                ...prevState,
                projects: projects,
                alert: false,
                alertYesButton: true,
                form: false,
                formType: '',
                help: false,
                commandString: '',
                currentWorkPackage: currentWorkPackage,
                currentProject: currentProject,
                changed: true,
              };
            });
          }
          break;
        case 'DELETE':
          if (projects.length > 1) {
            db.deleteProject(projects[currentProject].id, response =>
              console.log(response),
            );
            projects.splice(currentProject, 1);
            currentProject = 0;
            this.setState(prevState => {
              return {
                ...prevState,
                projects: projects,
                alert: false,
                alertYesButton: true,
                form: false,
                formType: '',
                help: false,
                commandString: '',
                currentWorkPackage: currentWorkPackage,
                currentProject: currentProject,
                changed: false,
              };
            });
          } else
            console.error(
              `Cannot delete last project ${commandString}`,
            );
          break;
        case 'HELP':
          break;
        default:
      }
    }
  }
  handleNo(e) {
    console.log(`handleNo(${this.state.commandString}`);
    this.setState(prevState => {
      return {
        ...prevState,
        alert: false,
        alertYesButton: true,
        form: false,
        help: false,
        textLabel: '',
        title: '',
        text: '',
        commandString: '',
        formType: '',
      };
    });
  }

  handleMenu(commandString) {
    if (this.state != null) {
      let action = utils.parseCommand(commandString);
      console.log(
        `handleMenu(${commandString})=${JSON.stringify(
          action,
          null,
          2,
        )}`,
      );
      let {
        projects,
        currentDeliverable,
        currentWorkPackage,
        currentProject,
      } = this.state;
      let project = projects[currentProject];

      if (action.target === 'QUESTION')
        switch (action.verb) {
          case 'ADD':
            action.index =
              action.index + (action.location === 'ABOVE' ? 0 : 1);
            this.setState(prevState => {
              return {
                ...prevState,
                form: true,
                title: `Add question #${action.index + 1})`,
                text: '',
                textLabel: 'New Question',
                commandString: commandString,
              };
            });
            break;
          case 'EDIT':
            this.setState(prevState => {
              return {
                ...prevState,
                form: true,
                title: `Edit question #${action.index + 1}) here.`,
                textLabel: 'Question',
                text:
                  project.deliverables[currentDeliverable]
                    .workPackages[currentWorkPackage].questions[
                    action.index
                  ].name,
                commandString: commandString,
              };
            });
            break;
          case 'EDITHELP':
            this.setState(prevState => {
              return {
                ...prevState,
                form: true,
                title: `Edit guidance for #${action.index +
                  1}) here.`,
                textLabel: 'Guidance',
                text:
                  project.deliverables[currentDeliverable]
                    .workPackages[currentWorkPackage].questions[
                    action.index
                  ].help,
                commandString: commandString,
              };
            });
            break;
          case 'DELETE':
            if (
              project.deliverables[currentDeliverable].workPackages[
                currentWorkPackage
              ].questions.length > 1
            ) {
              this.setState(prevState => {
                return {
                  ...prevState,
                  alert: true,
                  alertYesButton: true,
                  title: 'Delete the following question?',
                  textLabel: 'Question',
                  text: `${action.index + 1}) ${
                    project.deliverables[currentDeliverable]
                      .workPackages[currentWorkPackage].questions[
                      action.index
                    ].name
                  }`,
                  commandString: commandString,
                };
              });
            } else {
              this.setState(prevState => {
                return {
                  ...prevState,
                  alert: true,
                  alertYesButton: false,
                  title: 'Cannot delete the last question.',
                  textLabel: 'Question',
                  text: `Cannot delete ${action.index + 1}) ${
                    project.deliverables[currentDeliverable]
                      .workPackages[currentWorkPackage].questions[
                      action.index
                    ].name
                  }`,
                  commandString: commandString,
                };
              });
            }
            break;
          case 'HELP':
            console.log('Help');
            this.setState(prevState => {
              return {
                ...prevState,
                help: true,
                title:
                  project.deliverables[currentDeliverable]
                    .workPackages[currentWorkPackage].questions[
                    action.index
                  ].name,
                textLabel: 'Guidance',
                text:
                  project.deliverables[currentDeliverable]
                    .workPackages[currentWorkPackage].questions[
                    action.index
                  ].help.length > 1
                    ? project.deliverables[currentDeliverable]
                        .workPackages[currentWorkPackage].questions[
                        action.index
                      ].help
                    : 'Sorry, no guidance is available.',
              };
            });
            break;
          default:
            break;
        }

      if (action.target === 'WORK PACKAGE') {
        console.log('Work Paackage');
        switch (action.verb) {
          case 'ADD':
            action.secondIndex =
              action.secondIndex +
              (action.location === 'ABOVE' ? 0 : 1);
            this.setState(prevState => {
              return {
                ...prevState,
                form: true,
                textLabel: `${action.target.toLowerCase()}`,
                title: `Add a ${action.target.toLowerCase()} here.`,
                text: '',
                commandString: commandString,
              };
            });
            break;

          case 'EDIT':
            this.setState(prevState => {
              return {
                ...prevState,
                form: true,
                textLabel: `${action.target.toLowerCase()}`,
                title: `Edit the ${action.target.toLowerCase()} here.`,
                text:
                  project.deliverables[action.index].workPackages[
                    action.secondIndex
                  ].name,
                commandString: commandString,
              };
            });
            break;

          case 'EDITHELP':
            this.setState(prevState => {
              return {
                ...prevState,
                form: true,
                textLabel: `Guidance`,
                title: `Edit guidance for this ${action.target.toLowerCase()} here.`,
                text:
                  project.deliverables[action.index].workPackages[
                    action.secondIndex
                  ].help,
                commandString: commandString,
              };
            });
            break;

          case 'NOTES':
            this.setState(prevState => {
              return {
                ...prevState,
                form: true,
                textLabel: `Notes`,
                title: `Edit notes for this ${action.target.toLowerCase()} here.`,
                text:
                  project.deliverables[action.index].workPackages[
                    action.secondIndex
                  ].note,
                commandString: commandString,
              };
            });
            break;
          case 'DELETE':
            //cannot delete last workpackage
            if (
              project.deliverables[action.index].workPackages.length >
              1
            ) {
              this.setState(prevState => {
                return {
                  ...prevState,
                  textLabel: `${action.target.toLowerCase()}`,
                  alert: true,
                  alertYesButton: true,
                  title: `Delete the following ${action.target.toLowerCase()}?`,
                  text: `${
                    project.deliverables[action.index].workPackages[
                      action.secondIndex
                    ].name
                  }`,
                  commandString: commandString,
                };
              });
            } else {
              this.setState(prevState => {
                return {
                  ...prevState,
                  alert: true,
                  alertYesButton: false,
                  title: `Cannot delete the last ${action.target.toLowerCase()}.`,
                  textLabel: `${action.target.toLowerCase()}`,
                  text: `Cannot delete ${
                    project.deliverables[action.index].workPackages[
                      action.secondIndex
                    ].name
                  }`,
                  commandString: '',
                };
              });
            }
            break;

          case 'HELP':
            console.log('Help');
            this.setState(prevState => {
              return {
                ...prevState,
                help: true,
                title:
                  project.deliverables[action.index].workPackages[
                    action.secondIndex
                  ].name,
                textLabel: 'Guidance',
                text:
                  project.deliverables[action.index].workPackages[
                    action.secondIndex
                  ].help.length > 1
                    ? project.deliverables[action.index].workPackages[
                        action.secondIndex
                      ].help
                    : 'Sorry, no guidance is available.',
              };
            });
            break;
          default:
        }
      }
      if (action.target === 'DELIVERABLE')
        switch (action.verb) {
          case 'ADD':
            action.index =
              action.index + (action.location === 'ABOVE' ? 0 : 1);
            const location =
              action.location === 'ABOVE'
                ? 'to the left'
                : 'to the right';
            this.setState(prevState => {
              return {
                ...prevState,
                form: true,
                formType: 'DELIVERABLE',
                textLabel: `${action.target.toLowerCase()}`,
                title: `Add a ${action.target.toLowerCase()} ${location}.`,
                text: '',
                commandString: commandString,
              };
            });
            break;

          case 'EDIT':
            this.setState(prevState => {
              return {
                ...prevState,
                form: true,
                textLabel: `${action.target.toLowerCase()}`,
                title: `Edit the ${action.target.toLowerCase()} here.`,
                text: project.deliverables[action.index].name,
                commandString: commandString,
              };
            });
            break;

          case 'EDITHELP':
            this.setState(prevState => {
              return {
                ...prevState,
                form: true,
                textLabel: `Guidance`,
                title: `Edit guidance for this ${action.target.toLowerCase()} here.`,
                text: project.deliverables[action.index].help,
                commandString: commandString,
              };
            });
            break;

          case 'DELETE':
            //cannot delete last phase
            if (project.deliverables.length > 1) {
              this.setState(prevState => {
                return {
                  ...prevState,
                  textLabel: `${action.target.toLowerCase()}`,
                  alert: true,
                  alertYesButton: true,
                  title: `Delete the following ${action.target.toLowerCase()}?
                        WARNING ALL WORK PACKAGES AND QUESTIONS FOR THIS DELIVERABLE WILL BE DELETED!`,
                  text: `${project.deliverables[action.index].name}`,
                  commandString: commandString,
                };
              });
            } else {
              this.setState(prevState => {
                return {
                  ...prevState,
                  alert: true,
                  alertYesButton: false,
                  title: `Cannot delete the last ${action.target.toLowerCase()}.`,
                  textLabel: `${action.target.toLowerCase()}`,
                  text: `Cannot delete ${
                    project.deliverables[action.index].name
                  }`,
                  commandString: '',
                };
              });
            }
            break;

          case 'HELP':
            console.log('Help');
            this.setState(prevState => {
              return {
                ...prevState,
                help: true,
                title: project.deliverables[currentDeliverable].name,
                textLabel: 'Guidance',
                text:
                  project.deliverables[action.index].help.length > 1
                    ? project.deliverables[action.index].help
                    : 'Sorry, no guidance is available.',
              };
            });
            break;
          default:
        }

      if (action.target === 'PROJECT') {
        switch (action.verb) {
          case 'ADD':
            action.index = projects.length;
            this.setState(prevState => {
              return {
                ...prevState,
                form: true,
                formType: 'TEMPLATE',
                textLabel: 'New Project Name',
                title: `Add new project #${action.index + 1})`,
                text: '',
                commandString: commandString,
              };
            });
            break;
          case 'SELECT':
            this.setState(prevState => {
              return {
                ...prevState,
                currentProject: action.index,
                title: '',
                textLabel: '',
                formType: '',
                text: '',
                commandString: '',
              };
            });
            break;
          case 'SHARE':
            const shareWithUsers = projects[currentProject].sharedWith
              ? projects[currentProject].sharedWith.join(', ')
              : '';
            this.setState(prevState => {
              return {
                ...prevState,
                form: true,
                title: `Add users to your project here, separate email addresses with ','.`,
                textLabel: 'Shared With',
                text: shareWithUsers,
                commandString: commandString,
              };
            });
            break;
          case 'COPY':
            let newProject = utils.copyProject(
              this.state.user.email,
              projects[currentProject],
            );
            db.collection('projects')
              .add(newProject)
              .then(docRef => {
                newProject.id = docRef.id;
                projects.push(newProject);
                projects.sort((p1, p2) =>
                  p1.template === p2.template
                    ? p1.name < p2.name
                      ? -1
                      : p1.name === p2.name
                      ? 0
                      : 1
                    : p1.template
                    ? 1
                    : -1,
                );
                let currentProject = projects.findIndex(
                  project => project.id === newProject.id,
                );
                if (
                  currentProject < 0 ||
                  currentProject >= projects.length
                )
                  currentProject = 0;
                this.setState(prevState => {
                  return {
                    ...prevState,
                    projects: projects,
                    currentProject: currentProject,
                    currentWorkPackage: 0,
                    currentDeliverable: 0,
                    alert: false,
                    alertYesButton: true,
                    form: false,
                    formType: '',
                    help: false,
                    commandString: '',
                  };
                });
              });
            break;

          case 'EDIT':
            this.setState(prevState => {
              return {
                ...prevState,
                projectInfoEdit: true,
                title: '',
                text: '',
                textLabel: '',
                formType: '',
                commandString: '',
              };
            });
            break;
          case 'DELETE':
            //cannot delete last project
            if (projects.length > 1) {
              this.setState(prevState => {
                return {
                  ...prevState,
                  alert: true,
                  alertYesButton: true,
                  title: 'Delete the following project?',
                  textLabel: 'Project',
                  formType: '',
                  text: `${currentProject + 1}) ${project.name}`,
                  commandString: commandString,
                };
              });
            } else {
              this.setState(prevState => {
                return {
                  ...prevState,
                  alert: true,
                  alertYesButton: false,
                  textLabel: 'Project',
                  formType: '',
                  title: 'Cannot delete the last project.',
                  text: `Cannot delete ${currentProject + 1}) ${
                    project.name
                  }`,
                  commandString: '',
                };
              });
            }
            break;

          case 'HELP':
            if (this.state.authEditTemplate) {
              this.setState(prevState => {
                return {
                  ...prevState,
                  form: true,
                  title: `Edit guidance for project "${project.name}" below.`,
                  textLabel: 'Guidance',
                  formType: '',
                  text: project.help,
                  commandString: commandString,
                };
              });
            } else {
              this.setState(prevState => {
                return {
                  ...prevState,
                  help: true,
                  textLabel: 'Guidance',
                  formType: '',
                  title: project.name,
                  text:
                    project.help.length > 1
                      ? project.help
                      : 'Sorry, no guidance is available.',
                };
              });
            }

            break;
          default:
        }
      }

      if (action.target === 'TEMPLATE') {
        switch (action.verb) {
          case 'SAVE':
            action.index = projects.length;
            this.setState(prevState => {
              return {
                ...prevState,
                form: true,
                textLabel: 'Template Name',
                formType: '',
                title: `Enter name for template.`,
                commandString: commandString,
              };
            });
            break;

          case 'DELETE':
            //TODO Delete a template
            if (projects.length > 1) {
              this.setState(prevState => {
                return {
                  ...prevState,
                  alert: true,
                  alertYesButton: true,
                  title: 'Delete the following project?',
                  text: `${currentProject + 1}) ${project.name}`,
                  commandString: commandString,
                };
              });
            } else {
              this.setState(prevState => {
                return {
                  ...prevState,
                  alert: true,
                  alertYesButton: false,
                  title: 'Cannot delete the last project.',
                  text: `Cannot delete ${currentProject + 1}) ${
                    project.name
                  }`,
                  commandString: '',
                };
              });
            }
            break;

          case 'HELP':
            this.setState(prevState => {
              return {
                ...prevState,
                help: true,
                title: project.name,
                text:
                  project.help.length > 1
                    ? project.help
                    : 'Sorry, no guidance is available.',
              };
            });

            break;
          default:
        }
      }
    }
  }
  render() {
    let {
      projects,
      currentProject,
      currentDeliverable,
      currentWorkPackage,
      templates,
    } = this.state;

    const project = projects[currentProject];

    const {
      creator,
      end,
      goalsAndObjectives,
      help,
      learnings,
      name,
      note,
      problemOpportunity,
      projectManager,
      projectPriorities,
      sponsor,
      start,
      template,
      templateName,
    } = { ...projects[currentProject] };
    const values = {
      creator,
      end,
      goalsAndObjectives,
      help,
      name,
      learnings,
      note,
      problemOpportunity,
      projectManager,
      projectPriorities,
      sponsor,
      start,
      template,
      templateName,
      percentageComplete: utils.percentageProjectQuestionsYes(
        projects[currentProject],
      ),
      authEditTemplate: this.state.authEditTemplate,
    };

    if (this.state.changed)
      db.collection('projects')
        .doc(projects[currentProject].id)
        .set(projects[currentProject])
        .catch(function(error) {
          console.log(
            `Error writing project ${projects[currentProject].id}${error}`,
          );
        });
    return (
      <MuiThemeProvider theme={theme}>
        <ButtonAppBar
          firebase={firebase}
          projects={projects}
          templates={templates}
          currentProject={currentProject}
          authEditTemplate={this.state.authEditTemplate}
          handleMenu={this.handleMenu}
        />
        {!this.state.user && <SignIn firebase={firebase} />}
        {this.state.user && (
          <div>
            {this.state.projects.length === 0 ? (
              <h1>
                Loading...
                <CircularProgress
                  className={utils.projectStyles.progress}
                />
              </h1>
            ) : (
              <div>
                <Formik
                  enableReinitialize
                  render={props => <ProjectInfo {...props} />}
                  initialValues={values}
                  validationSchema={utils.projectInfoValidationSchema}
                  onSubmit={this.handleProjectInfoChange}
                  handleMenu={this.handleMenu}
                />
                <br />
                <ProjectWorkPackages
                  project={project}
                  currentProject={currentProject}
                  currentDeliverable={currentDeliverable}
                  currentWorkPackage={currentWorkPackage}
                  handleWorkPackageChange={
                    this.handleWorkPackageChange
                  }
                  handleMenu={this.handleMenu}
                  classes={utils.projectStyles}
                />
                <br />
                <Alert
                  open={this.state.alert}
                  title={this.state.title}
                  alertYesButton={this.state.alertYesButton}
                  text={this.state.text}
                  answerYes={this.handleYes}
                  answerNo={this.handleNo}
                />
                <FormDialog
                  open={this.state.form}
                  title={this.state.title}
                  text={this.state.text}
                  formType={this.state.formType}
                  textLabel={this.state.textLabel}
                  templateList={this.state.templates.map(
                    template => template.templateName,
                  )}
                  answerYes={this.handleYes}
                  answerNo={this.handleNo}
                  classes={utils.projectStyles}
                />
                <Help
                  open={this.state.help}
                  title={this.state.title}
                  text={this.state.text}
                  answerYes={this.handleYes}
                  answerNo={this.handleNo}
                />
                <Formik
                  enableReinitialize
                  render={props => (
                    <ProjectWorkPackageInfo {...props} />
                  )}
                  initialValues={{
                    started:
                      project.deliverables[currentDeliverable]
                        .workPackages[currentWorkPackage].started,
                    startedDate:
                      project.deliverables[currentDeliverable]
                        .workPackages[currentWorkPackage].startedDate,
                    completed:
                      project.deliverables[currentDeliverable]
                        .workPackages[currentWorkPackage].completed,
                    completedDate:
                      project.deliverables[currentDeliverable]
                        .workPackages[currentWorkPackage]
                        .completedDate,
                    assignedTo:
                      project.deliverables[currentDeliverable]
                        .workPackages[currentWorkPackage].assignedTo,
                    name:
                      project.deliverables[currentDeliverable]
                        .workPackages[currentWorkPackage].name,
                    percentageComplete: utils.percentageQuestionsYes(
                      project.deliverables[currentDeliverable]
                        .workPackages[currentWorkPackage].questions,
                    ),
                  }}
                  validationSchema={utils.stepNoteValidationSchema}
                  onSubmit={this.handleWorkPackageStartEnd}
                />
                <ProjectQuestions
                  questions={
                    project.deliverables[currentDeliverable]
                      .workPackages[currentWorkPackage].questions
                  }
                  workPackageName={
                    project.deliverables[currentDeliverable]
                      .workPackages[currentWorkPackage].name
                  }
                  currentProject={currentProject}
                  currentDeliverable={currentDeliverable}
                  currentWorkPackage={currentWorkPackage}
                  handleQuestionChange={this.handleQuestionChange}
                  handleMenu={this.handleMenu}
                  classes={utils.projectStyles}
                />
              </div>
            )}
          </div>
        )}
      </MuiThemeProvider>
    );
  }
}
export default App;
