import React, { Component } from "react";
import * as utils from "../utils/generalUtilities.js";
import Notes from "./Notes"



class MySurvey extends Component {

//   let skippedStype = {
//     font-style: "italic";
//    font-weight: "lighter"
// }
  render() {
    const { project, currentStep, onQuestionAnswered, onQuestionSkipped } = this.props;

    const tableRows = project.steps[currentStep].questions.map((question, _index) => {
      return (
        <tr key={_index + 1}>
          <td align="left" fontStyle="italic"> {question.question}</td>
          <td align="center"> <input value={`${currentStep + 1}.${_index + 1}.Yes`} disabled={question.skip} checked={question.answer === "Yes"} onChange={onQuestionAnswered} type="radio" /> </td>
          <td align="center"> <input value={`${currentStep + 1}.${_index + 1}.No`} disabled={question.skip} checked={question.answer === "No"} onChange={onQuestionAnswered} type="radio" /> </td>
          <td align="center"> <input value={`${currentStep + 1}.${_index + 1}.Later`} disabled={question.skip} checked={question.answer === "Later"} onChange={onQuestionAnswered} type="radio" /> </td>
          <td align="center"> <input value={`${currentStep + 1}.${_index + 1}.Skip`} checked={question.skip} onChange={onQuestionSkipped} type="checkbox" /> </td>
        </tr>
      )
    });

    return (
      <div className="MySurvey">
        <h3 align="left" >{currentStep + 1}) {project.steps[currentStep].stepLabel} {utils.percentageQuestionsYes(project.steps[currentStep].questions)}</h3>
        <div>
          <div className="notes">
            <Notes
              project={project}
              currentStep={currentStep}
            />
          </div>
        </div>
        <table className="table table-bordered table-striped ">
          <thead>
            <tr>
              <th align="left" scope="col">Question</th>
              <th align="center" scope="col">Yes %</th>
              <th align="center" scope="col">No</th>
              <th align="center" scope="col">Later</th>
              <th align="center" scope="col">Skip</th>
            </tr>
          </thead>
          <tbody>
            {tableRows}
          </tbody>
        </table>
      </div>
    );
  }
}

export default MySurvey;