import React, { Fragment } from "react";
import Paper from "@material-ui/core/Paper";
import { Table } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import ProjectStepQuestionMenu from "./ProjectStepQuestionMenu";
import Input from "@material-ui/core/Input";
import * as utils from "../utils/generalUtilities.js";

const stepLabelStyle = {
  width: "90%",
  fontSize: 16,
  color:"gray"
};
const stepHeadLabelStyle = {
  width: "90%",
  fontSize: 16,
  color: "white"
};
const stepSelectedStyle = {
  width: "90%",
  fontSize: 16,
  color: "black"
};
const StyledTableCell = withStyles(theme => ({
  head: {
    whiteSpace: "noWrap",
    align: "left",
    padding: "6px 6px 6px 6px",
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  body: {
    whiteSpace: "noWrap",
    align: "left",
    padding: "6px 6px 6px 6px",
    fontSize: 16
  }
}
))(TableCell);

const StyledTableRow = withStyles(theme => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.background.default
    }
  }
}))(TableRow);

export default function ProjectSteps({
  projectList,
  project,
  currentProject,
  currentStep,
  handleStepChange,
  handleMenu,
  classes
}) {
  // project.stepTypes determines the number of columns. 
  // stepStrings will be a stepTypes.length array of {stepIndex: original index, stepString: what to display in tablecell}
  let stepStrings = [];
  project.stepTypes.map((stepType, index) => stepStrings[index] = []);

  // Build each Step label for each step type as we have to lay them out in rows.  
  project.steps.forEach((step, index) => {
    if (!isNaN(step.stepType)) step.stepType = project.stepTypes[step.stepType]; // handle older versions with stepType= index. 
    let stepTypeIndex = project.stepTypes.indexOf(step.stepType);
    if (stepTypeIndex < 0 || stepTypeIndex >= project.stepTypes.length) {
      stepTypeIndex = 0;
    }
    stepStrings[stepTypeIndex].push({
      stepIndex: index,
      stepString: `${step.name} ${utils.percentageQuestionsYes(step.questions)}`
    });
  })
  const maxStepTableRows = Math.max(...stepStrings.map(stepType => stepType.length));

  let tableRows = []; // the columns have different numbers of steps associated with them
  for (let rowIndex = 0; rowIndex < maxStepTableRows; rowIndex++) {
    tableRows.push(
      <StyledTableRow key={`Row${rowIndex}`}>
        {project.stepTypes.map((stepType, stepIndex) => {
          return (

            < StyledTableCell
              key={rowIndex * project.stepTypes.length + stepIndex}
              id={`cell-step${rowIndex}.${stepIndex}`}
              variant="body"
            >
              {
                rowIndex < stepStrings[stepIndex].length &&
                <Fragment>
                  <ProjectStepQuestionMenu
                    projectList={projectList}
                    currentProject={currentProject}
                    typeOfMenu={stepType === 'Deliverables' ? 'deliverable' : "step"}
                    menuIndex={stepStrings[stepIndex][rowIndex].stepIndex}
                    handleMenu={handleMenu}

                  />

                  <Input
                    onClick={handleStepChange}
                    disableUnderline
                    value={stepStrings[stepIndex][rowIndex].stepString}
                    id={`step-input${rowIndex}.${stepIndex}.step#${stepStrings[stepIndex][rowIndex].stepIndex}`}
                    style={rowIndex < stepStrings[stepIndex].length && stepStrings[stepIndex][rowIndex].stepIndex === currentStep ? stepSelectedStyle : stepLabelStyle}
                  />
                </Fragment>
              }
            </StyledTableCell>
          )
        })}

      </StyledTableRow >
    );
  }
  let tableHeaders = [];
  project.stepTypes.forEach((stepType, stepIndex) => {
    tableHeaders.push(
      < StyledTableCell variant="head" key={`phase${stepIndex}`} >
        <Fragment>
          <ProjectStepQuestionMenu
            projectList={projectList}
            currentProject={currentProject}
            typeOfMenu={"phase"}
            menuIndex={stepIndex}
            handleMenu={handleMenu}
            style={stepHeadLabelStyle}
          />

          <Input
            onClick={handleStepChange}
            disableUnderline
            value={project.stepTypes[stepIndex]}
            id={`${project.stepTypes[stepIndex]}`}
            style={stepHeadLabelStyle}
          />
        </Fragment>
      </StyledTableCell>
    )
  })


  return (
    <Paper className={classes.paper}>
      <Table className={classes.table} size="small" style={{ minWidth: 750 }}>
        <TableHead>
          <TableRow>
            {tableHeaders}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableRows}
        </TableBody>
      </Table>
    </Paper>
  );
}
