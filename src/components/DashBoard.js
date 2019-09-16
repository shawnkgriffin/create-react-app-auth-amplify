import React, { Component } from "react";

class DashBoard extends Component {

  render() {
    const { project } = this.props;
    
    
    let tableRows1to6 = [];  // the three columns have different numbers of steps associated with them
    for (let i = 0; i < 6; i++) {
      tableRows1to6.push(
        <tr key={`Step${i + 1}`}>
          <td onClick={this.updateStep}>{project.steps[i].stepLabel} ({project.steps[i].questions.reduce((acc, question) => { return question.answer === "" ? acc : acc + 1 }, 0)}/{project.steps[i].questions.length})</td>
          <td onClick={this.updateStep}>{project.steps[i+6].stepLabel} ({project.steps[i+6].questions.reduce((acc, question) => { return question.answer === "" ? acc : acc + 1 }, 0)}/{project.steps[i+6].questions.length})</td>
          <td onClick={this.updateStep}>{project.steps[i+12].stepLabel} ({project.steps[i+13].questions.reduce((acc, question) => { return question.answer === "" ? acc : acc + 1 }, 0)}/{project.steps[i+13].questions.length})</td>
        </tr>
      )
    }

    return (
      <div className="dashboard">
        <h3>{this.props.project.name}</h3>
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
            <tr key={`Row 7`}>
              <td ></td>
              <td ></td>
              <td onClick={this.updateStep}>{project.steps[18].stepLabel} ({project.steps[18].questions.reduce((acc, question) => { return question.answer === "" ? acc : acc + 1 }, 0)}/{project.steps[18].questions.length})</td>
            </tr>
            <tr key={`Row 8`}>
              <td ></td>
              <td ></td>
              <td onClick={this.updateStep}>{project.steps[19].stepLabel} ({project.steps[19].questions.reduce((acc, question) => { return question.answer === "" ? acc : acc + 1 }, 0)}/{project.steps[19].questions.length})</td>
            </tr>

          </tbody>
        </table>
      </div>
    );
  }
}

export default DashBoard;