import React, { Component } from 'react';
import './App.css';
import { withAuthenticator } from 'aws-amplify-react'
import Amplify from 'aws-amplify';  // comment out , { Auth } until needed
import aws_exports from './aws-exports';

import * as db from "./utils/db/db.js";
import DashBoard from "./components/DashBoard"
// import ProjectBar from "./components/ProjectBar"
import MySurvey from "./components/MySurvey"
import ProjectInfo from "./components/ProjectInfo"
import ProjectList from "./components/ProjectList"

Amplify.configure(aws_exports);


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: db.readProjects(),
      currentProject: 0,
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
    this.handleNew = this.handleNew.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }
  onSelectStep(stepNumber) {
    if (this.state !== undefined) {
      this.setState({ currentStep: stepNumber })
    }

  }
  selectProject(e) {
    if (this.state !== undefined) {
      let newProject = e && e.currentTarget && e.currentTarget.value;
      if (newProject) {
        const projects = this.state.projects;
        let projectNumber = projects.findIndex(project => project.name === newProject);
        if ((projectNumber >= 0) && (projectNumber < projects.length)) {
          console.log(`selectProject(${newProject}, ${projectNumber}`)
          this.setState({ currentProject: projectNumber })
        }

      }
    }

  }

  handleNew(e)  {
    console.log(`handleNew()`);
    let project = db.readProject();
    let projects = this.state.projects
    project.name = `New Project ${projects.length + 2}`
    projects.push(project);
    let currentProject = projects.length;
    this.setState({projects : projects, currentProject : currentProject})
    console.log(`handleNew(${this.state.projects})`);

  }

  handleDelete(e)  {
    console.log(`handleDelete(${e.target.value})`)
  }

  onValueChanged(result) {
    if (this.state !== undefined) {
      let projectsCopy = this.state.projects;
      projectsCopy.steps[0].questions[0].answers.push("Yes");
      this.setState({ projects: projectsCopy })
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
      if (stepNumber >= 0 && stepNumber < this.state.projects[this.state.currentProject].steps.length) {
        console.log(`updateStep(${stepNumber + 1})`)
        this.setState({ currentStep: stepNumber })
      }
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
      let projects = this.state.projects;
      let currentProject = this.state.currentProject;
      projects[currentProject].steps[stepNumber - 1].questions[questionNumber - 1].answer = answer;
      projects[currentProject].steps[stepNumber - 1].questions[questionNumber - 1].answerHistory.push(
        {
          timestamp: timestamp,
          answer: answer,
          user: this.state.currentUser
        });
      this.setState({ projects: projects })
    }
  }

  render() {
    return (
      <div className="App">
        <div className="projectList">
          <ProjectList
            projects={this.state.projects}
            currentProject={this.state.currentProject}
            onSelect={this.selectProject}
            handleNew={this.handleNew}
            handleDelete={this.handleDelete}
            />
        </div>
        <div className="projectInfo">
          <ProjectInfo
            project={this.state.projects[this.state.currentProject]}
          />
        </div>
        <div className="dashboard">
          <DashBoard
            project={this.state.projects[this.state.currentProject]}
            updateStep={this.updateStep} />
        </div>
        <div className="mysurvey">
        
          <MySurvey
            project={this.state.projects[this.state.currentProject]}
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
