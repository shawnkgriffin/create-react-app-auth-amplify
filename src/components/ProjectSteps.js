import React from "react";
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
  const stepStrings = project.steps.map(
    (step, index) => `${index + 1}) ${step.stepLabel} ${utils.percentageQuestionsYes(step.questions)}`
  );
  let tableRows1to6 = []; // the three columns have different numbers of steps associated with them
  for (let i = 0; i < 6; i++) {
    tableRows1to6.push(
      <StyledTableRow key={`Row${i}`}>
        <TableCell variant="body">
          <ProjectMenu typeOfMenu="step" menuIndex={i} handleMenu={handleMenu} />
          <Input
            onClick={handleStepChange}
            disableUnderline
            value={stepStrings[i]}
          />
        </TableCell>
        <TableCell>
          <ProjectMenu typeOfMenu="step" menuIndex={i+ 6} handleMenu={handleMenu} />
          <Input
            onClick={handleStepChange}
            disableUnderline
            value={stepStrings[i + 6]}
          />
        </TableCell>
        <TableCell>
          <ProjectMenu typeOfMenu="step" menuIndex={i+ 12} handleMenu={handleMenu} />
          <Input
            onClick={handleStepChange}
            disableUnderline
            value={stepStrings[i + 12]}
          />
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
              <h2>Define the Project</h2>
            </StyledTableCell>
            <StyledTableCell align="center">
            </StyledTableCell>
              <h2>Analyze the Project</h2>
            <StyledTableCell align="center">
              <h2>Implement the Project</h2>
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableRows1to6}
          <StyledTableRow>
            <TableCell />
            <TableCell />
            <TableCell>
              <ProjectMenu typeOfMenu="step" menuIndex={18} handleMenu={handleMenu}/>
              <Input
                onClick={handleStepChange}
                disableUnderline
                value={stepStrings[18]}
              />
            </TableCell>
          </StyledTableRow>
          <StyledTableRow>
            <TableCell />
            <TableCell />
            <TableCell>
              <ProjectMenu typeOfMenu="step" menuIndex={19} handleMenu={handleMenu}/>
              <Input
                onClick={handleStepChange}
                disableUnderline
                value={stepStrings[19]}
              />
            </TableCell>
          </StyledTableRow>
        </TableBody>
      </Table>
    </Paper>
  );
}
