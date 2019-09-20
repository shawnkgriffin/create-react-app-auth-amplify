import React, { Component } from 'react';
import './App.css';
import { withAuthenticator } from 'aws-amplify-react'
import Amplify from 'aws-amplify';  // comment out , { Auth } until needed
import aws_exports from './aws-exports';

import * as db from "./utils/db/db.js";
import DashBoard from "./components/DashBoard"
// import ProjectBar from "./components/ProjectBar"
import MySurvey from "./components/MySurvey"
import Notes from "./components/Notes"
import ProjectInfo from "./components/ProjectInfo"
import ProjectList from "./components/ProjectList"

Amplify.configure(aws_exports);


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: db.readProjects(),
      currentProject :0,
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
    this.updateStep = this.updateStep.bind(this);
    this.selectProject = this.selectProject.bind(this);
  }
  onSelectStep(stepNumber) {
    if (this.state !== undefined) {
      this.setState({ currentStep: stepNumber })
    }

  }
  selectProject(projectNumber) {
    if (this.state !== undefined) {
      console.log(`SelectProject${projectNumber}`)
      this.setState({ currentProject: projectNumber })
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
  
  updateStep(result) {
    if (this.state !== undefined) {
      console.log(`updateStep(${result.target.outerText})`)
      const answerArray = result.target.outerText.split(")");
      if (answerArray.length === 0) {
        console.log(`updateStep Bad result${result.target.outerText}`)
        return;
      }
      const stepNumber = parseInt(answerArray[0], 10) - 1;
      console.log(`updateStep(${stepNumber + 1 })`)
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
    const project = this.state.projects[this.state.currentProject];
    return (
      <div className="App">
        <div className="projectList">
          <ProjectList
            projects={this.state.projects}
            currentProject={this.state.currentProject}
            onSelectProject={this.SelectProject}
          />
        </div>
        <div className="projectInfo">
          <ProjectInfo
            project={project}
          />
        </div>
        <div className="dashboard">
          <DashBoard
            project={project} 
            updateStep = {this.updateStep}/>
        </div>
        <div className="mysurvey">
          <MySurvey
            project={project}
            currentStep={this.state.currentStep}
            onQuestionAnswered={this.onQuestionAnswered}
            currentUser={this.currentUser}
          />
        </div>
        <div className="notes">
          <Notes
            project={project}
            currentStep={this.state.currentStep}
          />
        </div>
      </div>
    );
  }
}

export default withAuthenticator(App, true);
