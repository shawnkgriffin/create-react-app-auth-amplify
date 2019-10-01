import React, { Component } from 'react';
import './App.css';
import { withAuthenticator } from 'aws-amplify-react'
import Amplify from 'aws-amplify';  // comment out , { Auth } until needed
import aws_exports from './aws-exports';

import * as db from "./utils/db/db.js";
import * as utils from "./utils/generalUtilities"
import { makeStyles } from "@material-ui/core/styles";

import ProjectInfo from "./components/ProjectInfo";
import ProjectSteps from "./components/ProjectSteps";
import ProjectQuestions from "./components/ProjectQuestions";
import Alert from "./components/Alert";

Amplify.configure(aws_exports);

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
    marginRight: theme.spacing(2)
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
      project: db.readProject(),
      currentProject: 0,
      currentStep: 0,
      currentUser: "shawn@shawngriffin.com",
      isAuthenticated: false,
      isAuthenticating: true,
      user: null,
      commandString: "",
      alert: false,
      alertTitle: "",
      alertText: ""
    };
    this.handleQuestionChange = this.handleQuestionChange.bind(this);
    this.handleStepChange = this.handleStepChange.bind(this);
    this.handleMenu = this.handleMenu.bind(this);
    this.handleYes = this.handleYes.bind(this);
    this.handleNo = this.handleNo.bind(this);
  }
  handleQuestionChange(e) {
    if (this.state != null) {
      const [stepString, questionString, answer] = e.target.value.split(".");
      const stepNumber = parseInt(stepString, 10);
      const questionNumber = parseInt(questionString, 10);
      console.log(
        `handleQuestionChange(${
        e.target.value
        },${stepNumber},${questionNumber})`
      );
      let project = this.state.project;
      if (
        stepNumber >= 0 &&
        stepNumber < project.steps.length &&
        questionNumber >= 0 &&
        questionNumber < project.steps[stepNumber].questions.length
      ) {
        project.steps[stepNumber].questions[questionNumber].answer = answer;
        this.setState(prevState => {
          return { ...prevState, project: project };
        });
      }
    }
  }
  handleStepChange(e) {
    if (this.state != null) {
      const stepString = e.target.value.split(")");
      const stepNumber = parseInt(stepString[0], 10) - 1;

      let project = this.state.project;
      if (stepNumber >= 0 && stepNumber < project.steps.length) {
        this.setState(prevState => {
          return { ...prevState, currentStep: stepNumber };
        });
      }
    }
  }
  handleYes(e) {
    console.log(`handleYes(${this.state.commandString}`)
    let { project, currentStep, commandString } = this.state;
    let { actionObject, actionIndex, actionVerb, actionLocation } = utils.parseCommand(commandString);
    project.steps[currentStep].questions.splice(actionIndex, 1)
    this.setState(prevState => {
      return {
        ...prevState, 
        project: project, 
        alert: false,
        commandString: ""
      };
    });
  }
  handleNo(e) {
    console.log(`handleNo(${this.state.commandString}`)
    
    this.setState(prevState => {
      return {
        ...prevState, 
        alert: false,
        commandString: ""
      };
    });
  }

  handleMenu(commandString) {
    if (this.state != null) {
      console.log(`handleMenu(${commandString})`);
      let { actionObject, actionIndex, actionVerb, actionLocation } = utils.parseCommand(commandString);
      let { project, currentStep } = this.state;
      if (actionObject === "QUESTION") {
        switch (actionVerb) {
          case "ADD":
            const newQuestion = {
              "number": "",
              "question": "This is a new question",
              "validAnswers": "",
              "answer": "",
              "tip": "",
              "skip": false,
              "answerHistory": []
            }
            actionIndex = actionIndex + (actionLocation === "ABOVE" ? 0 : 1);
            project.steps[currentStep].questions.splice(actionIndex, 0, newQuestion)
            this.setState(prevState => {
              return { ...prevState, project: project };
            });
            break;
          case "EDIT":
            break;
          case "DELETE":
            // TODO add an are you sure?
            this.setState(prevState => {
              return {
                ...prevState, alert: true,
                alertTitle: "Delete the following question?",
                alertText: `${actionIndex + 1}) ${project.steps[currentStep].questions[actionIndex].question}`,
                commandString: commandString
              };
            });
            break;
          case "HELP":
            break;
          default:
        }
      } else if (actionObject === "step") {
        switch (commandString) {
          case "Add a step above this one.":
          case "Add a step below this one.":
            break;
          case "Edit this step.":
            break;
          case "Delete this step.":
            // TODO add an are you sure?
            console.log(`handleMenu(Delete${commandString})`);

            break;
          case "Help.":
            break;
          default:
        }
      }
    }
  }

  render() {
    const classes = useStyles;
    const { project, currentStep } = this.state;
    return (
      <div>
        <ProjectInfo classes={classes} project={project} />
        <br />
        <ProjectSteps
          classes={classes}
          project={project}
          handleStepChange={this.handleStepChange}
          handleMenu={this.handleMenu}
        />
        <br />
        <Alert
          open={this.state.alert}
          title={this.state.alertTitle}
          text={this.state.alertText}
          answerYes={this.handleYes}
          answerNo={this.handleNo}
        />
        <ProjectQuestions
          classes={classes}
          project={project}
          currentStep={currentStep}
          handleQuestionChange={this.handleQuestionChange}
          handleMenu={this.handleMenu}
        />
      </div>
    );
  }
}

export default withAuthenticator(App, true);
