import React from "react";
import Paper from "@material-ui/core/Paper";
import { Table } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Radio from "@material-ui/core/Radio";
import TextField from "@material-ui/core/TextField";
import ProjectMenu from "./ProjectMenu";
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



export default function ProjectQuestions({
  projects,
  currentProject,
  currentStep,
  handleQuestionChange,
  handleMenu,
  classes
}) {
  let project = projects[currentProject];

  const tableRows = project.steps[currentStep].questions.map(
    (question, index) => {
      return (
        <StyledTableRow key={`${currentStep}.${index}`}>
          <TableCell>
            <ProjectMenu
              projects={projects}
              currentProject={currentProject}
              typeOfMenu="question"
              menuIndex={index}
              handleMenu={handleMenu} />
            {index + 1}) {question.question}
          </TableCell>
          <TableCell>
            <Radio
              color={"primary"}
              checked={question.answer.toUpperCase() === "YES"}
              key={`${currentStep}.${index}.YES`}
              value={`${currentStep}.${index}.YES`}
              name={`${currentStep}.${index}.YES`}
              inputProps={{ "aria-label": "A" }}
              onChange={handleQuestionChange}
              disableRipple
            />
          </TableCell>
          <TableCell>
            <Radio
              color={"primary"}
              checked={question.answer.toUpperCase() === "NO"}
              key={`${currentStep}.${index}.NO`}
              value={`${currentStep}.${index}.NO`}
              name={`${currentStep}.${index}.NO`}
              inputProps={{ "aria-label": "A" }}
              onChange={handleQuestionChange}
              disableRipple
            />
          </TableCell>
          <TableCell>
            <Radio
              color={"primary"}
              checked={question.answer.toUpperCase() === "LATER"}
              value={`${currentStep}.${index}.LATER`}
              key={`${currentStep}.${index}.LATER`}
              name={`${currentStep}.${index}.LATER`}
              inputProps={{ "aria-label": "A" }}
              onChange={handleQuestionChange}
              disableRipple
            />
          </TableCell>
        </StyledTableRow>
      );
    }
  );

  return (
    <Paper className={classes.paper}>
      <form className={classes.container} noValidate autoComplete="off">
        <TextField
          id="outlined-full-width"
          label="Step 1 Notes"
          style={{ margin: 8 }}
          placeholder="Enter Step 1 Notes here."
          fullWidth
          margin="normal"
          variant="outlined"
          InputLabelProps={{
            shrink: true
          }}
        />
      </form>
      <Table className={classes.table} size="small">
        <TableHead>
          <TableRow>
            <StyledTableCell>
              <h2>
                {currentStep + 1}) {project.steps[currentStep].stepLabel} {utils.percentageQuestionsYes(project.steps[currentStep].questions)}
              </h2>
            </StyledTableCell>
            <StyledTableCell>Yes%</StyledTableCell>
            <StyledTableCell>No</StyledTableCell>
            <StyledTableCell>Later</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>{tableRows}</TableBody>
      </Table>
    </Paper>
  );
}
