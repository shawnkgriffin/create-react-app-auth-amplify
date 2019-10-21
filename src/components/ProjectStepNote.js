import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SubjectIcon from "@material-ui/icons/Subject";

// import { DisplayFormikState } from "./helper";
const buttonStyle = {
  marginTop: 15,
  marginLeft: 5,
};
const ProjectStepNote = props => {
  const {
    values: {
      note,
      currentStep
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