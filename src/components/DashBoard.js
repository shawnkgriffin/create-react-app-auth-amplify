import React, { Component } from "react";
import * as utils from "../utils/generalUtilities.js";



class DashBoard extends Component {


  render() {
    const { project, updateStep } = this.props;


    let tableRows1to6 = [];  // the three columns have different numbers of steps associated with them
    for (let i = 0; i < 6; i++) {
      tableRows1to6.push(
        <tr key={`Row${i}`}>
          <td key={i + 1} style={{ textAlign: "left" }} onClick={updateStep}>{i + 1}) {project.steps[i].stepLabel} {utils.percentageQuestionsYes(project.steps[i].questions)}</td>
          <td key={i + 7} style={{ textAlign: "left" }} onClick={updateStep}>{i + 7}) {project.steps[i + 6].stepLabel} {utils.percentageQuestionsYes(project.steps[i+ 6].questions)}</td>
          <td key={i + 13} style={{ textAlign: "left" }} onClick={updateStep}>{i + 13}) {project.steps[i + 12].stepLabel} {utils.percentageQuestionsYes(project.steps[i+13].questions)}</td>
        </tr>
      )
    }

    return (
      <div className="dashboard">
        <table className="table table-bordered table-striped ">
          <thead>
            <tr>
              <th style={{ textAlign: "center" }} scope="col">Define the Project</th>
              <th style={{ textAlign: "center" }} scope="col">Analyze the Project</th>
              <th style={{ textAlign: "center" }} scope="col">Implement the Project</th>
            </tr>
          </thead>
          <tbody>
            {tableRows1to6}
            <tr >
              <td ></td>
              <td ></td>
              <td key={`19`} style={{ textAlign: "left" }} onClick={updateStep}>19) {project.steps[18].stepLabel} {utils.percentageQuestionsYes(project.steps[18].questions)}</td>
            </tr>
            <tr >
              <td ></td>
              <td ></td>
              <td key={20} style={{ textAlign: "left" }} onClick={updateStep}>20) {project.steps[19].stepLabel} {utils.percentageQuestionsYes(project.steps[19].questions)}</td>
            </tr>

          </tbody>
        </table>
      </div>
    );
  }
}

export default DashBoard;