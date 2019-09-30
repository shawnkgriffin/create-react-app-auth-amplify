import React, { Component } from 'react';
import './App.css';
import { withAuthenticator } from 'aws-amplify-react'
import Amplify from 'aws-amplify';  // comment out , { Auth } until needed
import aws_exports from './aws-exports';

import * as db from "./utils/db/db.js";
import { makeStyles } from "@material-ui/core/styles";

import ProjectInfo from "./components/ProjectInfo";
import ProjectSteps from "./components/ProjectSteps";
import ProjectQuestions from "./components/ProjectQuestions";

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
      user: null
    };
    this.handleQuestionChange = this.handleQuestionChange.bind(this);
    this.handleStepChange = this.handleStepChange.bind(this);
    this.handleMenu = this.handleMenu.bind(this);
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
  handleMenu(commandString) {
    if (this.state != null) {
      console.log(`handleMenu(${commandString})`);
      const commands = commandString.toUpperCase().split(".");
      const actionObject = commands[0];
      const actionIndex = parseInt(commands[1], 10);
      const actionVerb = commands[2];
      const actionLocation = commands.length === 4 ? commands[3] : "";
      if (actionObject === "QUESTION") {

        switch (actionVerb) {
          case "ADD":
            break;
          case "EDIT":
            break;
          case "DELETE":
            // TODO add an are you sure?
            console.log(`handleMenu(DeleteQuestion(${actionIndex})`);
            let { project, currentStep } = this.state;
            project.steps[currentStep].questions.splice(actionIndex, 1)
            this.setState(prevState => {
              return { ...prevState, project:project };
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
