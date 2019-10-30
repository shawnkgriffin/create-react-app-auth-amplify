import './App.css';
import React, { Component } from 'react';
import { Formik } from "formik";
import CircularProgress from '@material-ui/core/CircularProgress';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

// Project components
import ProjectMenu from "./components/ProjectMenu";
import ProjectInfo from "./components/ProjectInfo";
import ProjectSteps from "./components/ProjectSteps";
import ProjectQuestions from "./components/ProjectQuestions";
import ProjectStepInfo from "./components/ProjectStepInfo";
import Alert from "./components/Alert";
import FormDialog from "./components/FormDialog";
import Help from "./components/Help";

//Project database and utilities
import * as utils from "./utils/generalUtilities.js";
import * as db from "./utils/db/db.js";

// AWS components
import { withAuthenticator } from 'aws-amplify-react'
import Amplify, { API, Auth } from 'aws-amplify';
import aws_exports from './aws-exports';
Amplify.configure(aws_exports);
API.configure(aws_exports);

const theme = createMuiTheme({

  overrides: {
    // Style sheet name ⚛️
    sizeSmall: { padding: "6px 6px 6px 6x" }

  },

});

class App extends Component {
  constructor(props) {

    super(props);
    this.state = {
      projects: [],
      templates: [],
      currentProject: 0,
      currentStep: 0,
      currentUser: "",
      isAuthenticated: false,
      isAuthenticating: true,
      authEditTemplate:false,
      user: null,
      commandString: "",
      alert: false,
      alertYesButton: true,
      permissionEditTemplate:false,
      title: "",
      text: "",
      textLabel:"",
      form: false,
      formType:'',
      help: false,
      projectInfoEdit: false,
      changed: false,
      currentStepNote: ""
    };
    this.handleQuestionChange = this.handleQuestionChange.bind(this);
    this.handleStepNoteSubmit = this.handleStepNoteSubmit.bind(this);
    this.handleProjectInfoChange = this.handleProjectInfoChange.bind(this);
    this.handleStepChange = this.handleStepChange.bind(this);
    this.handleMenu = this.handleMenu.bind(this);
    this.handleYes = this.handleYes.bind(this);
    this.handleNo = this.handleNo.bind(this);
  }

  componentDidMount() {

    Auth.currentAuthenticatedUser()
      .then(user => {
        console.log(`Auth.currentAuthenticatedUser()${user.attributes.email}`);
        
        //TODO when auth switched to google set up permissions.
        const authEditTemplate = user.attributes.email === 'shawn@shawngriffin.com' ||
          user.attributes.email === 'stephen@continuousbusinesschange.com';
        
        db.getTemplates(user.attributes.email, (templates) => {
          
          db.getProjects(user.attributes.email, (projects) => {
            if (projects.length === 0) {
              db.createNewProject("New Project", user.attributes.email, templates[0], newProject => {
                projects.push(newProject);

                if (authEditTemplate) templates.forEach(template => projects.push(template));

                this.setState(prevState => {
                  return {
                    ...prevState,
                    projects: projects,
                    alert: false,
                    alertYesButton: true,
                    text: "",
                    textLabel:"",
                    form: false,
                    formType:'',
                    help: false,
                    authEditTemplate,
                    commandString: "",
                    currentUser: user.attributes.email,
                    currentStep: 0,
                    currentProject: projects.length - 1,
                    changed: false,
                    templates: templates
                  };
                });
              })
            } else {
              if (authEditTemplate) templates.forEach(template => projects.push(template));
              this.setState(prevState => {
                return {
                  ...prevState,
                  currentUser: user.attributes.email, //using email for now.
                  projects: projects,
                  authEditTemplate,
                  templates: templates
                };
              })
            }
          })
        })
      })
      .catch(err => console.log(err))
  }

  handleQuestionChange(e) {
    e.preventDefault();
    e.stopPropagation();

    if (this.state != null) {
      let { projects, currentProject } = this.state;
      let project = projects[currentProject];
      const [stepString, questionString, answer] = e.target.value.split(".");
      const stepNumber = parseInt(stepString, 10);
      const questionNumber = parseInt(questionString, 10);
      console.log(
        `handleQuestionChange(${
        e.target.value
        },${stepNumber},${questionNumber})`
      );
      if (
        stepNumber >= 0 &&
        stepNumber < project.steps.length &&
        questionNumber >= 0 &&
        questionNumber < project.steps[stepNumber].questions.length
      ) {
        project.steps[stepNumber].questions[questionNumber].answer = answer;
        projects[currentProject] = project;
        this.setState(prevState => {
          return {
            ...prevState,
            projects: projects,
            changed: false
          };
        });
        db.putProject(project, response => {
          console.log(response)
        });

      }
    }
  }

  handleStepNoteSubmit(response) {
    if (this.state != null) {
      let { projects, currentProject, currentStep } = this.state;
      let step = projects[currentProject].steps[currentStep];
      step = { ...step, ...response };
      projects[currentProject].steps[currentStep] = step;

      db.putProject(projects[currentProject], response => {
        //TODO handle error 
        console.log(`db.putProject(project, ${response.status}`)
      });

      this.setState(prevState => {
        return {
          ...prevState,
          projects: projects,
          changed: false,
          currentStepNote: "",
          isStepNoteSubmitValid: false
        };
      });
    }
  }

  handleProjectInfoChange(changedProjectInfo) {

    if (this.state != null) {
      let { projects, currentProject } = this.state;
      let project = { ...projects[currentProject], ...changedProjectInfo };

      console.log(`handleProjectInfoChange(${JSON.stringify(changedProjectInfo, null, 2)})`);

      projects[currentProject] = project;
      this.setState(prevState => {
        return {
          ...prevState,
          projects: projects,
          changed: true
        };
      });

    }
  }

  handleStepChange(e) {
    if (this.state != null) {
      console.log(`handleStepChange(${e.target.id})`)
      let { projects, currentProject } = this.state;
      let project = projects[currentProject];
      const stepNumber = parseInt(e.target.id, 10);

      if (stepNumber >= 0 && stepNumber < project.steps.length) {
        this.setState(prevState => {
          return { ...prevState, currentStep: stepNumber };
        });
      }
    }
  }
  handleYes(response) {
    let newText = response.newText;
    console.log(`handleYes(e=${newText},commandString=${this.state.commandString}`)
    let { projects, currentStep, currentProject, commandString, templates } = this.state;
    let project = projects[currentProject];
    let { actionObject, actionIndex, actionVerb, actionLocation } = utils.parseCommand(commandString);
    if (actionObject === "QUESTION") {
      switch (actionVerb) {
        case "ADD":
          const newQuestion = {
            "name": newText,
            "validAnswers": "",
            "note": "",
            "answer": "",
            "help": "",
            "answerHistory": []
          }
          actionIndex = actionIndex + (actionLocation === "ABOVE" ? 0 : 1);
          project.steps[currentStep].questions.splice(actionIndex, 0, newQuestion)
          break;
        case "EDIT":
          project.steps[currentStep].questions[actionIndex].name = newText;
          break;
        case "EDITHELP":
          project.steps[currentStep].questions[actionIndex].help = newText;
          break;
        case "DELETE":
          if (project.steps[currentStep].questions.length > 1)
            project.steps[currentStep].questions.splice(actionIndex, 1)
          else
            console.error(`Cannot delete last question ${commandString}`)
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
          formType:'',
          help: false,
          commandString: "",
          currentStep: currentStep,
          currentProject: currentProject,
          changed: true
        };
      });

    } else if (actionObject === "STEP" || actionObject === "DELIVERABLE") {
      switch (actionVerb) {
        case "ADD":
          const newStep = {
            "name": newText,
            "stepType": project.steps[actionIndex].stepType,
            "stepNumber": 20,
            "skip": false,
            "help": "",
            "questions": [
              {
                "number": "",
                "name": "First question.",
                "validAnswers": "",
                "answer": "",
                "help": "",
                "skip": false,
                "answerHistory": []
              }]
          };
          actionIndex = actionIndex + (actionLocation === "ABOVE" ? 0 : 1);
          project.steps.splice(actionIndex, 0, newStep);
          currentStep = actionIndex;
          break;
        case "EDIT":
          project.steps[actionIndex].name = newText;
          break;
        case "EDITHELP":
          project.steps[actionIndex].help = newText;
          break;
        case "DELETE":
          if (project.steps.length > 1) {
            project.steps.splice(actionIndex, 1)
            currentStep = 0;
          }
          else
            console.error(`Cannot delete last step ${commandString}`)
          break;
        case "HELP":
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
          commandString: "",
          currentStep: currentStep,
          currentProject: currentProject,
          changed: true
        };
      });
    }
    if (actionObject === "PHASE" ) {
      switch (actionVerb) {
        case "ADD":
          
          actionIndex = actionIndex + (actionLocation === "ABOVE" ? 0 : 1);
          project.stepTypes.splice(actionIndex, 0, newText);
          const newStep = {
            "name": 'New Step',
            "stepType": newText,
            "skip": false,
            "help": "",
            "questions": [
              {
                "number": "",
                "name": "First question.",
                "validAnswers": "",
                "answer": "",
                "help": "",
                "skip": false,
                "answerHistory": []
              }]
          };
          project.steps.push(newStep);
          break;
        case "EDIT":
          project.steps.forEach(step => {
            if (step.stepType === project.stepTypes[actionIndex])
              step.stepType = newText
          })
          project.stepTypes[actionIndex] = newText;
          break;
        case "EDITHELP":
          // project.stepTypes[actionIndex].help = newText;
          break;
        case "DELETE":
          if (project.stepTypes.length > 1) {
            project.steps= project.steps.filter(step => step.stepType !== newText)
            project.stepTypes.splice(actionIndex, 1)
            currentStep = 0;
          }
          else
            console.error(`Cannot delete last phase ${commandString}`)
          break;
        case "HELP":
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
          commandString: "",
          currentStep: currentStep,
          currentProject: currentProject,
          changed: true
        };
      });
    }

    if (actionObject === "PROJECT") {
      switch (actionVerb) {
        case "ADD":

          // Figure out which template to use.
          let templateIndex = 0;
          if (typeof response.template !== 'undefined') {
            templateIndex = this.state.templates.findIndex(template => template.templateName === response.template)
            if (templateIndex === -1) templateIndex = 0;
            console.log(`AddProject(${response.template}, ${templateIndex})`)
          }
          // TODO use template selected to create project
          db.createNewProject(newText, this.state.currentUser, this.state.templates[templateIndex], newProject => {
            
            projects.push(newProject);
            currentStep = 0;
            currentProject = projects.length - 1;
            this.setState(prevState => {
              return {
                ...prevState,
                projects: projects,
                alert: false,
                alertYesButton: true,
                form: false,
                help: false,
                commandString: "",
                currentStep: currentStep,
                currentProject: currentProject,
                changed: true
              };
            });
            console.log(`Project add ${project.id}`)
          });
          break;
        case "EDIT":
          break;
        case "EDITHELP":
          project.help = newText;
          this.setState(prevState => {
            return {
              ...prevState,
              projects: projects,
              alert: false,
              alertYesButton: true,
              form: false,
              help: false,
              commandString: "",
              currentStep: currentStep,
              currentProject: currentProject,
              changed: true
            };
          });
          break;
        case "DELETE":
          if (projects.length > 1) {
            db.deleteProject(projects[currentProject].id, response => console.log(response));
            projects.splice(currentProject, 1)
            currentProject = 0;
            this.setState(prevState => {
              return {
                ...prevState,
                projects: projects,
                alert: false,
                alertYesButton: true,
                form: false,
                help: false,
                commandString: "",
                currentStep: currentStep,
                currentProject: currentProject,
                changed: false
              };
            });
          }
          else
            console.error(`Cannot delete last project ${commandString}`)
          break;
        case "HELP":
          break;
        default:
      }
    }
    if (actionObject === "TEMPLATE") {
      switch (actionVerb) {
        case "SAVE":

          db.createTemplate(newText, projects[currentProject], this.state.currentUser, newTemplate => {

            templates.push(newTemplate);
            
            this.setState(prevState => {
              return {
                ...prevState,
                alert: false,
                alertYesButton: true,
                form: false,
                help: false,
                commandString: "",
                changed: false,
                templates: templates
              };
            });
            console.log(`Template Save ${newTemplate.id}`)
          });
          break;
        case "EDIT":
          break;
        case "EDITHELP":
          project.help = newText;
          this.setState(prevState => {
            return {
              ...prevState,
              projects: projects,
              alert: false,
              alertYesButton: true,
              form: false,
              formType:'',
              help: false,
              commandString: "",
              currentStep: currentStep,
              currentProject: currentProject,
              changed: true
            };
          });
          break;
        case "DELETE":
          if (projects.length > 1) {
            db.deleteProject(projects[currentProject].id, response => console.log(response));
            projects.splice(currentProject, 1)
            currentProject = 0;
            this.setState(prevState => {
              return {
                ...prevState,
                projects: projects,
                alert: false,
                alertYesButton: true,
                form: false,
                formType:'',
                help: false,
                commandString: "",
                currentStep: currentStep,
                currentProject: currentProject,
                changed: false
              };
            });
          }
          else
            console.error(`Cannot delete last project ${commandString}`)
          break;
        case "HELP":
          break;
        default:
      }
    }

  }
  handleNo(e) {
    console.log(`handleNo(${this.state.commandString}`)
    this.setState(prevState => {
      return {
        ...prevState,
        alert: false,
        alertYesButton: true,
        form: false,
        help: false,
        textLabel:"",
        title: "",
        text: "",
        commandString: "",
        formType:''
      };
    });
  }

  handleMenu(commandString) {
    if (this.state != null) {
      console.log(`handleMenu(${commandString})`);
      let { actionObject, actionIndex, actionVerb, actionLocation } = utils.parseCommand(commandString);
      let { projects, currentStep, currentProject } = this.state;
      let project = projects[currentProject];
      if (actionObject === "QUESTION")
        switch (actionVerb) {
          case "ADD":

            actionIndex = actionIndex + (actionLocation === "ABOVE" ? 0 : 1);
            this.setState(prevState => {
              return {
                ...prevState,
                form: true,
                title: `Add question #${actionIndex + 1})`,
                text: "",
                textLabel:"New Question",
                commandString: commandString
              }
            });
            break;
          case "EDIT":
            this.setState(prevState => {
              return {
                ...prevState,
                form: true,
                title: `Edit question #${actionIndex + 1}) here.`,
                textLabel:"Question",
                text: project.steps[currentStep].questions[actionIndex].name,
                commandString: commandString
              }
            });
            break;
          case "EDITHELP":
            this.setState(prevState => {
              return {
                ...prevState,
                form: true,
                title: `Edit guidance for #${actionIndex + 1}) here.`,
                textLabel:"Guidance",
                text: project.steps[currentStep].questions[actionIndex].help,
                commandString: commandString
              }
            });
            break;
          case "DELETE":
            if (project.steps[currentStep].questions.length > 1) {

              this.setState(prevState => {
                return {
                  ...prevState,
                  alert: true,
                  alertYesButton: true,
                  title: "Delete the following question?",
                  textLabel:'Question',
                  text: `${actionIndex + 1}) ${project.steps[currentStep].questions[actionIndex].name}`,
                  commandString: commandString
                };
              });
            } else {
              this.setState(prevState => {
                return {
                  ...prevState,
                  alert: true,
                  alertYesButton: false,
                  title: "Cannot delete the last question.",
                  textLabel:'Question',
                  text: `Cannot delete ${actionIndex + 1}) ${project.steps[currentStep].questions[actionIndex].name}`,
                  commandString: commandString
                };
              });
            }
            break;
          case "HELP":
            console.log("Help")
            this.setState(prevState => {
              return {
                ...prevState,
                help: true,
                title: project.steps[currentStep].questions[actionIndex].name,
                textLabel:'Guidance',
                text: project.steps[currentStep].questions[actionIndex].help.length > 1 ? project.steps[currentStep].questions[actionIndex].help : "Sorry, no guidance is available."
              };
            });
            break;
          default:

            break;
        }

      if (actionObject === "STEP" || actionObject === "DELIVERABLE")
        switch (actionVerb) {

          case "ADD":
            actionIndex = actionIndex + (actionLocation === "ABOVE" ? 0 : 1);
            this.setState(prevState => {
              return {
                ...prevState,
                form: true,
                textLabel:`${actionObject.toLowerCase()}`,
                title: `Add a ${actionObject.toLowerCase()} here.`,
                text: "",
                commandString: commandString
              }
            });
            break;
            
            case "EDIT":
              
              this.setState(prevState => {
                return {
                  ...prevState,
                  form: true,
                  textLabel:`${actionObject.toLowerCase()}`,
                  title: `Edit the ${actionObject.toLowerCase()} here.`,
                  text: project.steps[actionIndex].name,
                  commandString: commandString
                };
              });
              break;
              
              case "EDITHELP":
                
                this.setState(prevState => {
                  return {
                    ...prevState,
                    form: true,
                    textLabel:`Guidance`,
                    title: `Edit guidance for this ${actionObject.toLowerCase()} here.`,
                    text: project.steps[actionIndex].help,
                    commandString: commandString
                  };
                });
                break;
                
                case "DELETE":
                  //cannot delete last step
                  if (project.steps.length > 1) {
                    this.setState(prevState => {
                      return {
                        ...prevState,
                        textLabel:`${actionObject.toLowerCase()}`,
                        alert: true,
                        alertYesButton: true,
                        title: `Delete the following ${actionObject.toLowerCase()}?`,
                        text: `${project.steps[actionIndex].name}`,
                        commandString: commandString
                      };
                    });
                  }
                  else {
                    this.setState(prevState => {
                      return {
                        ...prevState,
                        alert: true,
                        alertYesButton: false,
                        title: `Cannot delete the last ${actionObject.toLowerCase()}.`,
                        textLabel:`${actionObject.toLowerCase()}`,
                  text: `Cannot delete ${project.steps[actionIndex].name}`,
                  commandString: ""
                };
              });
            }
            break;

          case "HELP":
            console.log("Help")
            this.setState(prevState => {
              return {
                ...prevState,
                help: true,
                title: project.steps[actionIndex].name,
                textLabel:"Guidance",
                text: project.steps[actionIndex].help.length > 1 ? project.steps[actionIndex].help : "Sorry, no guidance is available."

              };
            });
            break;
          default:
        }

      if (actionObject === "PHASE")
        switch (actionVerb) {

          case "ADD":
            actionIndex = actionIndex + (actionLocation === "ABOVE" ? 0 : 1);
            const location = actionLocation === "ABOVE" ? 'to the left.' :'to the right.'
            this.setState(prevState => {
              return {
                ...prevState,
                form: true,
                formType: 'PHASE',
                textLabel:`${actionObject.toLowerCase()}`,
                title: `Add a ${actionObject.toLowerCase()} ${location}.`,
                text: "",
                commandString: commandString
              }
            });
            break;
            
            case "EDIT":
              
              this.setState(prevState => {
                return {
                  ...prevState,
                  form: true,
                  textLabel:`${actionObject.toLowerCase()}`,
                  title: `Edit the ${actionObject.toLowerCase()} here.`,
                  text: project.stepTypes[actionIndex],
                  commandString: commandString
                };
              });
              break;
              
              case "EDITHELP":
                
                this.setState(prevState => {
                  return {
                    ...prevState,
                    form: true,
                    textLabel:`Guidance`,
                    title: `Edit guidance for this ${actionObject.toLowerCase()} here.`,
                    text: project.steps[actionIndex].help,
                    commandString: commandString
                  };
                });
                break;
                
                case "DELETE":
                  //cannot delete last phase
                  if (project.stepTypes.length > 1) {
                    this.setState(prevState => {
                      return {
                        ...prevState,
                        textLabel:`${actionObject.toLowerCase()}`,
                        alert: true,
                        alertYesButton: true,
                        title: `Delete the following ${actionObject.toLowerCase()}?
                        WARNING ALL STEPS AND QUESTIONS FOR THIS PHASE WILL BE DELETED!`,
                        text: `${project.stepTypes[actionIndex]}`,
                        commandString: commandString
                      };
                    });
                  }
                  else {
                    this.setState(prevState => {
                      return {
                        ...prevState,
                        alert: true,
                        alertYesButton: false,
                        title: `Cannot delete the last ${actionObject.toLowerCase()}.`,
                        textLabel:`${actionObject.toLowerCase()}`,
                  text: `Cannot delete ${project.stepTypes[actionIndex]}`,
                  commandString: ""
                };
              });
            }
            break;

          case "HELP":
            console.log("Help")
            this.setState(prevState => {
              return {
                ...prevState,
                help: true,
                title: project.steps[actionIndex].name,
                textLabel:"Guidance",
                text: project.steps[actionIndex].help.length > 1 ? project.steps[actionIndex].help : "Sorry, no guidance is available."

              };
            });
            break;
          default:
        }

      if (actionObject === "PROJECT") {
        switch (actionVerb) {

          case "ADD":
            actionIndex = projects.length;
            this.setState(prevState => {
              return {
                ...prevState,
                form: true,
                formType: 'TEMPLATE',
                textLabel:'New Project Name',
                title: `Add new project #${actionIndex + 1})`,
                text: "",
                commandString: commandString
              }
            });
            break;
          case "SELECT":
            this.setState(prevState => {
              return {
                ...prevState,
                currentProject: actionIndex,
                title: "",
                textLabel: "",
                formType:"",
                text: "",
                commandString: ""
              };
            });
            break;

          case "EDIT":

            this.setState(prevState => {
              return {
                ...prevState,
                projectInfoEdit: true,
                title: "",
                text: "",
                textLabel: "",
                formType:"",
                commandString: ""
              };
            });
            break;

          case "EDITHELP":
            this.setState(prevState => {
              return {
                ...prevState,
                form: true,
                title: `Edit guidance for project "${project.name}" below.`,
                textLabel: "Guidance",
                formType:"",
                text: project.help,
                commandString: commandString
              };
            });

            break;

          case "DELETE":
            //cannot delete last project
            if (projects.length > 1) {

              this.setState(prevState => {
                return {
                  ...prevState,
                  alert: true,
                  alertYesButton: true,
                  title: "Delete the following project?",
                  textLabel: "Project",
                formType:"",
                  text: `${currentProject + 1}) ${project.name}`,
                  commandString: commandString
                };
              });
            }
            else {
              this.setState(prevState => {
                return {
                  ...prevState,
                  alert: true,
                  alertYesButton: false,
                  textLabel: "Project",
                  formType:"",
                  title: "Cannot delete the last project.",
                  text: `Cannot delete ${currentProject + 1}) ${project.name}`,
                  commandString: ""
                };
              });
            }
            break;

          case "HELP":
            this.setState(prevState => {
              return {
                ...prevState,
                help: true,
                textLabel: "Guidance",
                formType:"",
                title: project.name,
                text: project.help.length > 1 ? project.help : "Sorry, no guidance is available."
              };
            });

            break;
          default:
        }
      }

      if (actionObject === "TEMPLATE") {
        switch (actionVerb) {

          case "SAVE":
            actionIndex = projects.length;
            this.setState(prevState => {
              return {
                ...prevState,
                form: true,
                textLabel: 'Template Name',
                formType:"",
                title: `Enter name for template.`,
                commandString: commandString
              }
            });
            break;

          case "DELETE":
            //TODO Delete a template
            if (projects.length > 1) {

              this.setState(prevState => {
                return {
                  ...prevState,
                  alert: true,
                  alertYesButton: true,
                  title: "Delete the following project?",
                  text: `${currentProject + 1}) ${project.name}`,
                  commandString: commandString
                };
              });
            }
            else {
              this.setState(prevState => {
                return {
                  ...prevState,
                  alert: true,
                  alertYesButton: false,
                  title: "Cannot delete the last project.",
                  text: `Cannot delete ${currentProject + 1}) ${project.name}`,
                  commandString: ""
                };
              });
            }
            break;

          case "HELP":
            this.setState(prevState => {
              return {
                ...prevState,
                help: true,
                title: project.name,
                text: project.help.length > 1 ? project.help : "Sorry, no guidance is available."
              };
            });

            break;
          default:
        }
      }
    }
  }
  render() {
    let { projects, currentProject, currentStep } = this.state;
    const project = projects[currentProject];
    const projectList = projects.map(project => {
      if (project.template)
        return (`Template (${project.templateName})`)
      else
        return (project.name);
    })
    
    const {
      name,
      problemOpportunity,
      creator,
      note,
      sponsor,
      projectManager,
      templateName,
      template,
      start,
      end
    } = { ...projects[currentProject] };
    const values = {
      name,
      problemOpportunity,
      creator,
      note,
      sponsor,
      projectManager,
      templateName,
      template,
      start,
      end
    };
    if (this.state.changed) db.putProject(projects[currentProject], response => console.log(response));

    return (
      <div>
        <MuiThemeProvider theme={theme}>

          {this.state.projects.length === 0 ? (
            <h1>Loading...
            <CircularProgress className={utils.projectStyles.progress} />
            </h1>
          ) : (
              <div>
                <ProjectMenu
                  projectList={projectList}
                  currentProject={currentProject}
                  typeOfMenu="project"
                  menuIndex={1}
                  handleMenu={this.handleMenu} />
                <Formik
                  enableReinitialize
                  render={props => <ProjectInfo {...props} />}
                  initialValues={values}
                  validationSchema={utils.projectInfoValidationSchema}
                  onSubmit={this.handleProjectInfoChange}
                />
                <br />
                <ProjectSteps
                  projectList={projectList}
                  project={project}
                  currentProject={currentProject}
                  currentStep={currentStep}
                  handleStepChange={this.handleStepChange}
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
                  templateList = {this.state.templates.map(template => template.templateName)}
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
                  render={props => <ProjectStepInfo {...props} />}
                  initialValues={{
                    note: project.steps[currentStep].note,
                    started: project.steps[currentStep].started,
                    startedDate: project.steps[currentStep].startedDate,
                    completed: project.steps[currentStep].completed,
                    completedDate: project.steps[currentStep].completedDate,
                    assignedTo: project.steps[currentStep].assignedTo,
                    stepLabel: `${project.steps[currentStep].name} ${utils.percentageQuestionsYes(project.steps[currentStep].questions)} `
                  }}
                  validationSchema={utils.stepNoteValidationSchema}
                  onSubmit={this.handleStepNoteSubmit}
                />
                <ProjectQuestions
                  projectList={projectList}
                  questions={project.steps[currentStep].questions}
                  stepName={project.steps[currentStep].name}
                  currentProject={currentProject}
                  handleQuestionChange={this.handleQuestionChange}
                  currentStep={currentStep}
                  handleMenu={this.handleMenu}
                  classes={utils.projectStyles}
                />
              </div>
            )}
        </MuiThemeProvider>
      </div>

    );
  }

}
export default withAuthenticator(App, true);
