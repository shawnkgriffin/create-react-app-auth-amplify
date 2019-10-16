import './App.css';
import React, { Component } from 'react';
import { Formik } from "formik";
import CircularProgress from '@material-ui/core/CircularProgress';

// Project components
import ProjectMenu from "./components/ProjectMenu";
import ProjectInfo from "./components/ProjectInfo";
import ProjectSteps from "./components/ProjectSteps";
import ProjectQuestions from "./components/ProjectQuestions";
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

class App extends Component {
  constructor(props) {

    super(props);
    this.state = {
      projects: [],
      currentProject: 0,
      currentStep: 0,
      currentUser: "",
      isAuthenticated: false,
      isAuthenticating: true,
      user: null,
      commandString: "",
      alert: false,
      title: "",
      text: "",
      form: false,
      help: false,
      projectInfoEdit: false,
      changed: false
    };
    this.handleQuestionChange = this.handleQuestionChange.bind(this);
    this.handleProjectInfoChange = this.handleProjectInfoChange.bind(this);
    this.handleStepChange = this.handleStepChange.bind(this);
    this.handleMenu = this.handleMenu.bind(this);
    this.handleYes = this.handleYes.bind(this);
    this.handleNo = this.handleNo.bind(this);
  }

  componentDidMount() {
    db.getProjects(projects => {
      Auth.currentAuthenticatedUser()
        .then(user => {
          console.log(`Auth.currentAuthenticatedUser()${user.attributes.email}`);
          this.setState(prevState => {
            return {
              ...prevState,
              currentUser: user.attributes.email, //using email for now.
              projects: projects  
            };
          })
        })
        .catch(err => console.log(err))
    })
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
        db.putProject(project);

      }
    }
  }
  handleProjectInfoChange(changedProjectInfo) {

    if (this.state != null) {
      let { projects, currentProject } = this.state;
      let project = projects[currentProject];
      console.log(`handleProjectInfoChange(${Object.keys(changedProjectInfo)})`);
      const projectKeys = Object.keys(project);
      const changedKeys = Object.keys(changedProjectInfo);
      changedKeys.forEach(key => {
        if (projectKeys.includes(key)) {
          project[key] = changedProjectInfo[key]
        }
      })
      projects[currentProject] = project;
      this.setState(prevState => {
        return { ...prevState, projects: projects, projectInfoEdit: false, changed: true };
      });
    }
  }

  handleStepChange(e) {
    if (this.state != null) {
      let { projects, currentProject } = this.state;
      let project = projects[currentProject];
      const stepString = e.target.value.split(")");
      const stepNumber = parseInt(stepString[0], 10) - 1;

      if (stepNumber >= 0 && stepNumber < project.steps.length) {
        this.setState(prevState => {
          return { ...prevState, currentStep: stepNumber };
        });
      }
    }
  }
  handleYes(newText) {
    console.log(`handleYes(e=${newText},commandString=${this.state.commandString}`)
    let { projects, currentStep, currentProject, commandString } = this.state;
    let project = projects[currentProject];
    let { actionObject, actionIndex, actionVerb, actionLocation } = utils.parseCommand(commandString);
    if (actionObject === "QUESTION") {
      switch (actionVerb) {
        case "ADD":
          const newQuestion = {
            "number": "",
            "name": newText,
            "validAnswers": "",
            "answer": "",
            "help": "",
            "skip": false,
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
          project.steps[currentStep].questions.splice(actionIndex, 1)
          break;
        default:
      }
      projects[currentProject] = project;
      this.setState(prevState => {
        return {
          ...prevState,
          projects: projects,
          alert: false,
          form: false,
          help: false,
          commandString: "",
          currentStep: currentStep,
          currentProject: currentProject,
          changed: true
        };
      });

    } else if (actionObject === "STEP") {
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
                "question": "First question.",
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
          project.steps.splice(actionIndex, 1)
          currentStep = 0;
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
          form: false,
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
          db.createNewProject(newText, this.state.currentUser, newProject => {

            projects.push(newProject);
            currentStep = 0;
            currentProject = projects.length - 1;
            this.setState(prevState => {
              return {
                ...prevState,
                projects: projects,
                alert: false,
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
          db.deleteProject(projects[currentProject].id);
          projects.splice(currentProject, 1)
          currentProject = 0;
          this.setState(prevState => {
            return {
              ...prevState,
              projects: projects,
              alert: false,
              form: false,
              help: false,
              commandString: "",
              currentStep: currentStep,
              currentProject: currentProject,
              changed: false
            };
          });
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
        form: false,
        help: false,
        title: "",
        text: "",
        commandString: ""
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
                title: `Add question #${actionIndex + 1})`, text: "",
                commandString: commandString
              }
            });
            break;
          case "EDIT":
            this.setState(prevState => {
              return {
                ...prevState,
                form: true,
                title: `Edit question #${actionIndex + 1}) below.`,
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
                title: `Edit guidance for #${actionIndex + 1}) below.`,
                text: project.steps[currentStep].questions[actionIndex].help,
                commandString: commandString
              }
            });
            break;
          case "DELETE":
            if (project.steps[currentStep].questions.length > 1) {

              this.setState(prevState => {
                return {
                  ...prevState, alert: true,
                  title: "Delete the following question?",
                  text: `${actionIndex + 1}) ${project.steps[currentStep].questions[actionIndex].name}`,
                  commandString: commandString
                };
              });
            } else {
              this.setState(prevState => {
                return {
                  ...prevState, alert: true,
                  title: "Cannot delete the last question.",
                  text: `Cannot delete ${actionIndex + 1}) ${project.steps[currentStep].questions[actionIndex].question}`,
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
                text: project.steps[currentStep].questions[actionIndex].help.length > 1 ? project.steps[currentStep].questions[actionIndex].help : "Sorry, no guidance is available."
              };
            });
            break;
          default:

            break;
        }

      if (actionObject === "STEP")
        switch (actionVerb) {

          case "ADD":
            actionIndex = actionIndex + (actionLocation === "ABOVE" ? 0 : 1);
            this.setState(prevState => {
              return {
                ...prevState, form: true, title: `Add step #${actionIndex + 1})`, text: "",
                commandString: commandString
              }
            });
            break;

          case "EDIT":

            this.setState(prevState => {
              return {
                ...prevState,
                form: true,
                title: `Edit step #${actionIndex + 1}) below.`,
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
                title: `Edit guidance for step #${actionIndex + 1}) below.`,
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
                  ...prevState, alert: true,
                  title: "Delete the following step?",
                  text: `${actionIndex + 1}) ${project.steps[actionIndex].name}`,
                  commandString: commandString
                };
              });
            }
            else {
              this.setState(prevState => {
                return {
                  ...prevState,
                  alert: true,
                  title: "Cannot delete the last step.",
                  text: `Cannot delete ${actionIndex + 1}) ${project.steps[actionIndex].name}`,
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
                title: `Add new project #${actionIndex + 1})`, text: "",
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
                  ...prevState, alert: true,
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
    const projectList = projects.map(project => project.name)
    const {
      name,
      problemOpportunity,
      creator,
      note,
      sponsor,
      projectManager,
      projectType,
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
      projectType,
      start,
      end
    };
    if (this.state.changed) db.putProject(projects[currentProject]);

    return (
      <div>

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
                handleStepChange={this.handleStepChange}
                handleMenu={this.handleMenu}
                classes={utils.projectStyles}
              />
              <br />
              <Alert
                open={this.state.alert}
                title={this.state.title}
                text={this.state.text}
                answerYes={this.handleYes}
                answerNo={this.handleNo}
              />
              <FormDialog
                open={this.state.form}
                title={this.state.title}
                text={this.state.text}
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
              <ProjectQuestions
                projectList={projectList}
                questions={project.steps[currentStep].questions}
                stepName={project.steps[currentStep].name}
                currentProject={currentProject}
                currentStep={currentStep}
                handleQuestionChange={this.handleQuestionChange}
                handleMenu={this.handleMenu}
                classes={utils.projectStyles}
              />
            </div>
          )}
      </div>

    );
  }
}

export default withAuthenticator(App, true);
