import React, { Component } from "react";

class MySurvey extends Component {

  
  render() {
    const { project, currentStep, onQuestionAnswered } = this.props;

    console.log('project.steps', project.steps)
    const tableRows = project.steps[currentStep].questions.map((question, _index) => {
      return (
        <tr key={_index + 1}>
          <td align="left"> {question.question}</td>
          <td align="center"> <input value={`${currentStep + 1}.${_index + 1}.Yes`} checked={question.answer === "Yes"} onChange={onQuestionAnswered} type="radio" /> </td>
          <td align="center"> <input value={`${currentStep + 1}.${_index + 1}.No`} checked={question.answer === "No"} onChange={onQuestionAnswered} type="radio" /> </td>
          <td align="center"> <input value={`${currentStep + 1}.${_index + 1}.Skip`} checked={question.answer === "Skip"} onChange={onQuestionAnswered} type="radio" /> </td>
          <td align="center"> <input value={`${currentStep + 1}.${_index + 1}.Later`} checked={question.answer === "Later"} onChange={onQuestionAnswered} type="radio" /> </td>
        </tr>
      )
    });

    return (
      <div className="MySurvey">
        <h3 align="left" >{project.steps[currentStep].stepLabel}</h3>
        <table className="table table-bordered table-striped ">
          <thead>
            <tr>
              <th align="left" scope="col">Question</th>
              <th align="center" scope="col">Yes</th>
              <th align="center" scope="col">No</th>
              <th align="center" scope="col">Skip</th>
              <th align="center" scope="col">Later</th>
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