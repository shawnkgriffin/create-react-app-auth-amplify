import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import EventIcon from "@material-ui/icons/Event";
import NameIcon from "@material-ui/icons/SupervisorAccount";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import * as utils from '../utils/generalUtilities'
import { Table } from "@material-ui/core";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { withStyles } from "@material-ui/core/styles";


const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  }
}))(TableCell);
// import { DisplayFormikState } from "./helper";

const buttonStyle = {
  marginTop: 15,
  marginLeft: 5,
};
const ProjectStepInfo = props => {
  const {
    values: {
      started,
      startedDate,
      completed,
      completedDate,
      assignedTo,
      stepLabel
    },
    errors,
    touched,
    handleSubmit,
    handleChange,
    setFieldValue,
    isValid,
    setFieldTouched
  } = props;

  const change = (name, e) => {
    e.persist();
    if (e.target.checked) {
      const today = new Date();
      if (name === 'started') {
        setFieldValue('startedDate', utils.formatDate(today));
      }
      else if (name === 'completed') {
        setFieldValue('completedDate', utils.formatDate(today));
      }
    }
    handleChange(e);
    setFieldTouched(name, true, false);
  };

  return (

    <form onSubmit={handleSubmit}>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell>
              <h1>{stepLabel}</h1>
            </StyledTableCell>
          </TableRow>
        </TableHead>
      </Table>
      <br />
      <br />
      <TextField
        id="outlined-name"
        name="assignedTo"
        variant="outlined"
        helperText={touched.assignedTo ? errors.assignedTo : ""}
        error={touched.assignedTo && Boolean(errors.assignedTo)}
        label="Assigned To:"
        value={assignedTo}
        style={{ padding: "0px 5px 10px 5px", minWidth: 200 }}
        onChange={change.bind(null, "assignedTo")}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <NameIcon />
            </InputAdornment>
          )
        }}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={started}
            onChange={change.bind(null, "started")}
            value="checkedB"
            name={`started`}
            color="primary"
          />
        }
        label="Started?"
      />
      {started &&
        <TextField
          id="outlined-start"
          name="startedDate"
          type="date"
          variant="outlined"
          helperText={touched.startedDate ? errors.startedDate : ""}
          error={touched.startedDate && Boolean(errors.startedDate)}
          label="Started On"
          value={startedDate}
          style={{ padding: "0px 5px 10px 5px", minWidth: 200 }}
          onChange={change.bind(null, "startedDate")}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EventIcon />
              </InputAdornment>
            )
          }}
        />
      }
      {started &&
        <FormControlLabel
          control={
            <Checkbox
              checked={completed}
              onChange={change.bind(null, "completed")}
              value="checkedB"
              name={`completed`}
              color="primary"
            />
          }
          label="Completed?"
        />
      }
      {started && completed &&
        <TextField
          id="outlined-start"
          name="completedDate"
          type="date"
          variant="outlined"
          helperText={touched.completedDate ? errors.completedDate : ""}
          error={touched.completedDate && Boolean(errors.completedDate)}
          label="Completed On"
          value={completedDate}
          style={{ padding: "0px 0px 10px 5px", minWidth: 200 }}
          onChange={change.bind(null, "completedDate")}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EventIcon />
              </InputAdornment>
            )
          }}
        />
      }
      
      <Button
        type="submit"
        margin="normal"
        variant="contained"
        color="primary"
        disabled={!isValid}
        style={buttonStyle}
      >
        Save
      </Button>

      {/* <DisplayFormikState {...props} /> */}
    </form>
  );
};

export default ProjectStepInfo;