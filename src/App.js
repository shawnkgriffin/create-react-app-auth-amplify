import React, { Component } from 'react';
import './App.css';
import { withAuthenticator } from 'aws-amplify-react'
import Amplify, { API } from 'aws-amplify';  // comment out , { Auth } until needed

import * as db from "./utils/db/db.js";
import axios from "axios";
import * as utils from "./utils/generalUtilities"
import { makeStyles } from "@material-ui/core/styles";

import ProjectInfo from "./components/ProjectInfo";
import ProjectSteps from "./components/ProjectSteps";
import ProjectQuestions from "./components/ProjectQuestions";
import Alert from "./components/Alert";
import FormDialog from "./components/FormDialog";
import Help from "./components/Help";

import aws_exports from './aws-exports';
Amplify.configure(aws_exports);
API.configure(aws_exports);


const useStyles = makeStyles(theme => ({
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



class App extends Component {
  constructor(props) {
    
    super(props);
    this.state = {
      projects:[],
      currentProject: 0,
      currentStep: 0,
      currentUser: "shawn@shawngriffin.com",
      isAuthenticated: false,
      isAuthenticating: true,
      user: null,
      commandString: "",
      alert: false,
      title: "",
      text: "",
      form: false,
      help: false,
      projectInfoEdit: false
    };
    this.handleQuestionChange = this.handleQuestionChange.bind(this);
    this.handleProjectInfoChange = this.handleProjectInfoChange.bind(this);
    this.handleStepChange = this.handleStepChange.bind(this);
    this.handleMenu = this.handleMenu.bind(this);
    this.handleYes = this.handleYes.bind(this);
    this.handleNo = this.handleNo.bind(this);
  }

   componentDidMount() {
    axios
      .get('https://us-central1-project-534d9.cloudfunctions.net/api/projects')
      .then(data => {
        console.log(`componentDidMount${data.data}`);
        this.setState(prevState => {
          return { ...prevState, projects: data.data };
        }) })
      
}
  handleQuestionChange(e) {
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
          return { ...prevState, projects: projects };
        });
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
      let changed = false;
      changedKeys.forEach(key => {
        if (projectKeys.includes(key)) {
          changed = true;
          project[key] = changedProjectInfo[key]
        }
      })
      projects[currentProject] = project;
      this.setState(prevState => {
        return { ...prevState, projects: projects, projectInfoEdit: false };
      });
      if (!changed) this.forceUpdate();
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
    }

    if (actionObject === "PROJECT") {
      switch (actionVerb) {
        case "ADD":
          let newProject = db.readProject();
          newProject.name = newText;
          projects.push(newProject);
          currentStep = 0;
          currentProject = projects.length - 1;
          break;
        case "EDIT":
          break;
        case "EDITHELP":
          project.help = newText;
          break;
        case "DELETE":
            axios
            .delete(`https://us-central1-project-534d9.cloudfunctions.net/api/project/${projects[currentProject].id}`)
            .then(response => { 
              console.log(`Project Delete ${response}`)
            })
            .catch(error => {
              console.log(`Project Delete Error ${error}`)
            });
          projects.splice(currentProject, 1)
          currentProject = 0;
          break;
        case "HELP":
          break;
        default:
      }
    }
    this.setState(prevState => {
      return {
        ...prevState,
        projects: projects,
        alert: false,
        form: false,
        help: false,
        commandString: "",
        currentStep: currentStep,
        currentProject: currentProject
      };
    });
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
    const classes = useStyles;
    let { projects, currentProject, currentStep } = this.state;
    return (
      <div>
     
        {this.state.projects.length === 0 ? (
          <div>Loading</div>
        ) : (
            <div>
              <ProjectInfo
                projects={projects}
                currentProject={currentProject}
                handleProjectInfoChange={this.handleProjectInfoChange}
                edit={this.state.projectInfoEdit}
                handleMenu={this.handleMenu}
                classes={classes}
              />
              <br />
              <ProjectSteps
                projects={projects}
                currentProject={currentProject}
                handleStepChange={this.handleStepChange}
                handleMenu={this.handleMenu}
                classes={classes}
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
                classes={classes}
              />
              <Help
                open={this.state.help}
                title={this.state.title}
                text={this.state.text}
                answerYes={this.handleYes}
                answerNo={this.handleNo}
              />
              <ProjectQuestions
                projects={projects}
                currentProject={currentProject}
                currentStep={currentStep}
                handleQuestionChange={this.handleQuestionChange}
                handleMenu={this.handleMenu}
                classes={classes}
              />
            </div>
          )}
        </div>
            
        );
      }
}

export default withAuthenticator(App, true);
