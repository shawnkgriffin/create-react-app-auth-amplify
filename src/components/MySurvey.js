import React, { Component } from "react";

class MySurvey extends Component {

  updateStep = (e) => {
    console.log(`MySurvey clicked on ${e.target.getAttribute('step-number')}`)
  }
  onValueChanged(result) {
    console.log("value changed!" + result);
  }

  onComplete(result) {
    console.log("Complete! " + result);
  }

  render() {
    const { project, currentStep, onQuestionAnswered } = this.props;

    console.log('project.steps', project.steps)
    const tableRows = project.steps[currentStep].questions.map((question, _index) => {
      return (
        <tr key={_index + 1}>
          <td >{question.question}</td>
          <td align="center"> <input value={`${currentStep + 1}.${_index + 1}.Yes`} checked={question.answer === "Yes"} onChange={onQuestionAnswered} type="radio" /> </td>
          <td align="center"> <input value={`${currentStep + 1}.${_index + 1}.No`} checked={question.answer === "No"} onChange={onQuestionAnswered} type="radio" /> </td>
          <td align="center"> <input value={`${currentStep + 1}.${_index + 1}.Skip`} checked={question.answer === "Skip"} onChange={onQuestionAnswered} type="radio" /> </td>
          <td align="center"> <input value={`${currentStep + 1}.${_index + 1}.Later`} checked={question.answer === "Later"} onChange={onQuestionAnswered} type="radio" /> </td>
        </tr>
      )
    });

    return (
      <div className="MySurvey">
        <h3>{project.steps[currentStep].stepLabel}</h3>
        <table className="table table-bordered table-striped ">
          <thead>
            <tr>
              <th style={{ textAlign: "center" }} scope="col">Question</th>
              <th style={{ textAlign: "center" }} scope="col">Yes</th>
              <th style={{ textAlign: "center" }} scope="col">No</th>
              <th style={{ textAlign: "center" }} scope="col">Skip</th>
              <th style={{ textAlign: "center" }} scope="col">Later</th>
            </tr>
            {tableRows}
          </thead>
          <tbody>
          </tbody>
        </table>
      </div>
    );
  }
}

export default MySurvey;