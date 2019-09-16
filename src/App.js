import React, { Component } from 'react';
import logo from './projectassistantlogo.png';
import './App.css';
import { withAuthenticator } from 'aws-amplify-react'
import Amplify, { Auth } from 'aws-amplify';
import aws_exports from './aws-exports';

import * as db from "./utils/db/db.js";
import DashBoard from "./components/DashBoard"
import ProjectBar from "./components/ProjectBar"
import MySurvey from "./components/MySurvey"

Amplify.configure(aws_exports);


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      project: db.readProject(),
      currentStep: 0,
      currentUser: 'shawn@shawngriffin.com',
      isAuthenticated: false,
      isAuthenticating: true,
      user: null
    };
    this.onValueChanged = this.onValueChanged.bind(this);
    this.onSelectStep = this.onSelectStep.bind(this);
    this.onQuestionAnswered = this.onQuestionAnswered.bind(this);
    this.handleButton = this.handleButton.bind(this);
  }
  onSelectStep(stepNumber) {
    if (this.state !== undefined) {
      this.setState({ currentStep: stepNumber })
    }

  }


  onValueChanged(result) {
    if (this.state !== undefined) {
      let projectCopy = this.state.project;
      projectCopy.steps[0].questions[0].answers.push("Yes");
      this.setState({ project: projectCopy })
    }
  }

  handleButton(result) {
    if (this.state !== undefined) {
      const stepNumber = parseInt(result, 10) - 1;
      if (stepNumber >= 0 && stepNumber < this.state.project.steps.length)
        this.setState({ currentStep: stepNumber })
    }
  }

  onQuestionAnswered(result) {
    if (this.state !== undefined) {
      const answerArray = result.target.value.split(".");
      if (answerArray.length !== 3) {
        console.log(`onQuestionAnswered Bad result${result.target.value}`)
        return;
      }
      const stepNumber = parseInt(answerArray[0], 10);
      const questionNumber = parseInt(answerArray[1], 10);
      const answer = answerArray[2];
      const date = new Date();
      const timestamp = date.getTime();
      let projectCopy = this.state.project;
      projectCopy.steps[stepNumber - 1].questions[questionNumber - 1].answer = answer;
      projectCopy.steps[stepNumber - 1].questions[questionNumber - 1].answerHistory.push(
        {
          timestamp: timestamp,
          answer: answer,
          user: this.state.currentUser
        });
      this.setState({ project: projectCopy })
    }
  }
  render() {
    return (
      <div className="App">
        <div className="dashboard">
          <DashBoard project={this.state.project} />
        </div>
        <div className="projectbar">
          <ProjectBar project={this.state.project}
            currentStep={this.state.currentStep}
            handleButton={this.handleButton}
          />
        </div>
        <div className="mysurvey">
          <MySurvey
            project={this.state.project}
            currentStep={this.state.currentStep}
            onQuestionAnswered={this.onQuestionAnswered}
            currentUser={this.currentUser}
          />
        </div>
      </div>
    );
  }
}

export default withAuthenticator(App, true);
