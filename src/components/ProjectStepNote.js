import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SubjectIcon from "@material-ui/icons/Subject";
import EventIcon from "@material-ui/icons/Event";
import Radio from "@material-ui/core/Radio";
import NameIcon from "@material-ui/icons/SupervisorAccount";

// import { DisplayFormikState } from "./helper";
const buttonStyle = {
  marginTop: 15,
  marginLeft: 5,
};
const ProjectStepNote = props => {
  const {
    values: {
      note,
      currentStep,
      started,
      startedDate,
      completed,
      completedDate,
      assignedTo
    },
    errors,
    touched,
    handleSubmit,
    handleChange,
    isValid,
    setFieldTouched
  } = props;

  const change = (name, e) => {
    e.persist();
    handleChange(e);
    setFieldTouched(name, true, false);
  };
  return (
    <form onSubmit={handleSubmit}>
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
      <Radio
        color={"primary"}
        checked={started}
        key={`started`}
        label="Started"
        value={`started`}
        name={`started`}
        inputProps={{ "aria-label": "A" }}
        // onChange={handleQuestionChange}
        disableRipple
      />
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
      
      <Radio
        color={"primary"}
        checked={completed}
        key={`completed`}
        label="completed"
        value={`completed`}
        name={`completed`}
        inputProps={{ "aria-label": "A" }}
        // onChange={handleQuestionChange}
        disableRipple
      />
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
      <TextField
        id="outlined-note"
        name="note"
        multiline
        variant="outlined"
        helperText={touched.note ? errors.note : ""}
        error={touched.note && Boolean(errors.note)}
        label={`Step ${currentStep + 1} Notes`}
        value={note}
        style={{ padding: 5, width: "85%" }}
        onChange={change.bind(null, "note")}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SubjectIcon />
            </InputAdornment>
          )
        }}
      />
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

export default ProjectStepNote;