import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import NameIcon from "@material-ui/icons/SupervisorAccount";
import LockIcon from "@material-ui/icons/Lock";
import AssignmentIcon from "@material-ui/icons/Assignment";
import ListIcon from "@material-ui/icons/List";
import EventIcon from "@material-ui/icons/Event";
import SubjectIcon from "@material-ui/icons/Subject";
import { DisplayFormikState } from "./helper";
const buttonStyle = {
  marginTop: 15,
  marginLeft: 5,
};
const ProjectInfo = props => {
  const {
    values: {
      name,
      problemOpportunity,
      creator,
      note,
      sponsor,
      projectManager,
      projectType,
      start,
      end
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
    console.log(errors);
    setFieldTouched(name, true, false);
  };
  return (
    <form onSubmit={handleSubmit}>
      <TextField
        id="outlined-name"
        name="name"
        variant="outlined"
        helperText={touched.name ? errors.name : ""}
        error={touched.name && Boolean(errors.name)}
        label="Project Name"
        value={name}
        style={{ padding: 5, minWidth: 200 }}
        onChange={change.bind(null, "name")}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AssignmentIcon />
            </InputAdornment>
          )
        }}
      />
      <TextField
        id="outlined-start"
        name="start"
        variant="outlined"
        helperText={touched.start ? errors.start : ""}
        error={touched.start && Boolean(errors.start)}
        label="Start Date"
        value={start}
        style={{ padding: 5, minWidth: 200 }}
        onChange={change.bind(null, "start")}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EventIcon />
            </InputAdornment>
          )
        }}
      />
      <TextField
        id="outlined-end"
        name="end"
        variant="outlined"
        helperText={touched.end ? errors.end : ""}
        error={touched.end && Boolean(errors.end)}
        label="End Date"
        value={end}
        style={{ padding: 5, minWidth: 200 }}
        onChange={change.bind(null, "end")}
        InputProps={{
          startAdornment: (
            <InputAdornment position="end">
              <EventIcon />
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
      
      <br />
      <TextField
        id="outlined-name"
        name="sponsor"
        variant="outlined"
        helperText={touched.sponsor ? errors.sponsor : ""}
        error={touched.sponsor && Boolean(errors.sponsor)}
        label="Sponsor"
        value={sponsor}
        style={{ paddingRight: 5, minWidth: 200 }}
        onChange={change.bind(null, "sponsor")}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <NameIcon />
            </InputAdornment>
          )
        }}
      />
      <TextField
        id="outlined-name"
        name="projectManager"
        variant="outlined"
        helperText={touched.projectManager ? errors.projectManager : ""}
        error={touched.projectManager && Boolean(errors.projectManager)}
        label="Project Manager"
        value={projectManager}
        style={{ paddingRight: 5, minWidth: 200 }}
        onChange={change.bind(null, "projectManager")}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <NameIcon />
            </InputAdornment>
          )
        }}
      />
      <TextField
        id="outlined-name"
        name="projectType"
        variant="outlined"
        helperText={touched.projectType ? errors.projectType : ""}
        error={touched.projectType && Boolean(errors.projectType)}
        label="Project Type"
        value={projectType}
        style={{ padding: 5, minWidth: 200 }}
        onChange={change.bind(null, "projectType")}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <ListIcon />
            </InputAdornment>
          )
        }}
      />
      <TextField
        id="outlined-creator"
        name="creator"
        disabled
        variant="outlined"
        style={{ padding: 5, minWidth: 200 }}
        helperText={touched.creator ? errors.creator : ""}
        error={touched.creator && Boolean(errors.creator)}
        label="Creator"
        value={creator}
        onChange={change.bind(null, "creator")}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon />
            </InputAdornment>
          )
        }}
      />
      <br />
      <TextField
        id="outlined-problemOpportunity"
        name="problemOpportunity"
        variant="outlined"
        multiline
        helperText={touched.problemOpportunity ? errors.problemOpportunity : ""}
        error={touched.problemOpportunity && Boolean(errors.problemOpportunity)}
        label="Problem Opportunity"
        value={problemOpportunity}
        style={{ padding: 5, width: "45%" }}
        onChange={change.bind(null, "problemOpportunity")}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SubjectIcon />
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
        label="Note"
        value={note}
        style={{ padding: 5, width: "45%" }}
        onChange={change.bind(null, "note")}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SubjectIcon />
            </InputAdornment>
          )
        }}
      />

      {/* <DisplayFormikState {...props} /> */}
    </form>
  );
};

export default ProjectInfo;