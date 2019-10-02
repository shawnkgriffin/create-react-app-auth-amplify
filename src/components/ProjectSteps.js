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

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  body: {
    fontSize: 14
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
  classes,
  project,
  handleStepChange,
  handleMenu
}) {
  // project.stepTypes determines the number of columns. 
  let stepStrings = [];
  project.stepTypes.map((stepType, index) => stepStrings[index] = []);
  // Build each Step label for each step type as we have to lay them out in rows.  
  project.steps.map((step, index) => stepStrings[step.stepType].push(`${index + 1}) ${step.stepLabel} ${utils.percentageQuestionsYes(step.questions)}`));
  const maxStepTableRows = Math.max(...stepStrings.map(stepType => stepType.length));

  let tableRows = []; // the three columns have different numbers of steps associated with them
  for (let i = 0; i < maxStepTableRows; i++) {
    tableRows.push(
      <StyledTableRow key={`Row${i}`}>
        <TableCell variant="body">
          {i < stepStrings[0].length &&
            <Fragment>
              <ProjectMenu typeOfMenu="step" menuIndex={i} handleMenu={handleMenu} />

              <Input
                onClick={handleStepChange}
                disableUnderline
                value={stepStrings[0][i]}
              />
            </Fragment>
          }
        </TableCell>
        <TableCell>
          {i < stepStrings[1].length &&
            <Fragment>
              <ProjectMenu typeOfMenu="step" menuIndex={i + stepStrings[0].length} handleMenu={handleMenu} />
              <Input

                onClick={handleStepChange}
                disableUnderline
                value={stepStrings[1][i]}
              />
            </Fragment>
          }
        </TableCell>
        <TableCell>
          {i < stepStrings[2].length &&
            <Fragment>

              <ProjectMenu typeOfMenu="step" menuIndex={i + stepStrings[0].length + stepStrings[1].length} handleMenu={handleMenu} />
              <Input
                onClick={handleStepChange}
                disableUnderline
                value={stepStrings[2][i]}
              />
            </Fragment>
          }
        </TableCell>
      </StyledTableRow>
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
