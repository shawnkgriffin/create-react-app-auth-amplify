import React, { Fragment } from "react";
import Paper from "@material-ui/core/Paper";
import { Table } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import ProjectMenu from "./ProjectMenu";
import Input from "@material-ui/core/Input";
import * as utils from "../utils/generalUtilities.js";

const stepLabelStyle = {
  width: 300,
  fontSize: 16
};

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  body: {
    fontSize: 16
  }
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.background.default
    }
  }
}))(TableRow);

export default function ProjectSteps({
  projects,
  currentProject,
  handleStepChange,
  handleMenu,
  classes
}) {
  let project = projects[currentProject];
  // project.stepTypes determines the number of columns. 
  // stepStrings will be a stepTypes.length array of {stepIndex: original index, stepString: what to display in tablecell}
  let stepStrings = [];
  project.stepTypes.map((stepType, index) => stepStrings[index] = []);

  // Build each Step label for each step type as we have to lay them out in rows.  
  project.steps.map((step, index) => stepStrings[step.stepType].push({ stepIndex: index, stepString: `${index + 1}) ${step.name} ${utils.percentageQuestionsYes(step.questions)}` }));
  const maxStepTableRows = Math.max(...stepStrings.map(stepType => stepType.length));

  let tableRows = []; // the three columns have different numbers of steps associated with them
  for (let rowIndex = 0; rowIndex < maxStepTableRows; rowIndex++) {
    tableRows.push(
      <StyledTableRow key={`Row${rowIndex}`}>
        {project.stepTypes.map((stepType, stepIndex) => {
          return (

            < TableCell variant="body" key={rowIndex * project.stepTypes.length + stepIndex}>
              {
                rowIndex < stepStrings[stepIndex].length &&
                <Fragment>
                  <ProjectMenu
                    projects={projects}
                    currentProject={currentProject}
                    typeOfMenu="step"
                    menuIndex={stepStrings[stepIndex][rowIndex].stepIndex} handleMenu={handleMenu}
                  />

                  <Input
                    onClick={handleStepChange}
                    disableUnderline
                    value={stepStrings[stepIndex][rowIndex].stepString}
                    style={stepLabelStyle}
                  />
                </Fragment>
              }
            </TableCell>
          )
        })}

      </StyledTableRow >
    );
  }
  return (
    <Paper className={classes.paper}>
      <Table className={classes.table} size="small">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">
              <h2>{project.stepTypes[0]}</h2>
            </StyledTableCell>
            <StyledTableCell align="center">
              <h2>{project.stepTypes[1]}</h2>
            </StyledTableCell>
            <StyledTableCell align="center">
              <h2>{project.stepTypes[2]}</h2>
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableRows}

        </TableBody>
      </Table>
    </Paper>
  );
}
