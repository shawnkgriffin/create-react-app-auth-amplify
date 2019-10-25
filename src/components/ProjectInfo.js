import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import NameIcon from "@material-ui/icons/SupervisorAccount";
import LockIcon from "@material-ui/icons/Lock";
import AssignmentIcon from "@material-ui/icons/Assignment";
import EventIcon from "@material-ui/icons/Event";
import SubjectIcon from "@material-ui/icons/Subject";
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

// import { DisplayFormikState } from "./helper";

const buttonStyle = {
  margin: 10
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
      template,
      templateName,
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
    setFieldTouched(name, true, false);
  };
  
  return (
    <form onSubmit={handleSubmit} >
      <TextField
        id="outlined-name"
        name="name"
        variant="outlined"
        helperText={touched.name ? errors.name : ""}
        error={touched.name && Boolean(errors.name)}
        label="Project Name"
        value={name}
        style={{ padding: 0, minWidth: 200 }}
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
        type="date"
        variant="outlined"
        helperText={touched.start ? errors.start : ""}
        error={touched.start && Boolean(errors.start)}
        label="Start Date"
        value={start}
        style={{ padding: "0px 0px 10px 5px", minWidth: 200 }}
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
        type="date"
        variant="outlined"
        helperText={touched.end ? errors.end : ""}
        error={touched.end && Boolean(errors.end)}
        label="End Date"
        value={end}
        style={{ padding: "0px 0px 10px 5px", minWidth: 200 }}
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
      <FormControlLabel
        control={
          <Checkbox
            checked={template}
            onChange={change.bind(null, "started")}
            value="checkedB"
            name={`template`}
            color="primary"
          />
        }
        label="Template?"
      />
      <TextField
        id="outlined-name"
        disabled = {!template}
        name="templateName"
        variant="outlined"
        helperText={touched.templateName ? errors.templateName : ""}
        error={touched.templateName && Boolean(errors.templateName)}
        label="Project Template"
        value={templateName}
        style={{ padding: "0px 0px 10px 5px", minWidth: 200 }}
        onChange={change.bind(null, "templateName")}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AccountTreeIcon />
            </InputAdornment>
          )
        }}
      />
      <TextField
        id="outlined-creator"
        name="creator"
        disabled
        variant="outlined"
        style={{ padding: "0px 0px 10px 5px", minWidth: 200 }}
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
        rows="2"
        rowsMax= "2"
        helperText={touched.problemOpportunity ? errors.problemOpportunity : ""}
        error={touched.problemOpportunity && Boolean(errors.problemOpportunity)}
        label="Problem Opportunity"
        value={problemOpportunity}
        style={{ padding: "0px 0px 10px 5px", width: "45%" }}
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
        rows="2"
        rowsMax= "2"
        variant="outlined"
        helperText={touched.note ? errors.note : ""}
        error={touched.note && Boolean(errors.note)}
        label="Project Notes"
        value={note}
        style={{ padding: "0px 0px 10px 5px", width: "45%" }}
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