import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import NameIcon from '@material-ui/icons/SupervisorAccount';
import LockIcon from '@material-ui/icons/Lock';
import AssignmentIcon from '@material-ui/icons/Assignment';
import EventIcon from '@material-ui/icons/Event';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

// import { DisplayFormikState } from "./helper";

const buttonStyle = {
  margin: 10,
};
const ProjectInfo = props => {
  const {
    values: {
      name,
      creator,
      sponsor,
      projectManager,
      template,
      templateName,
      start,
      end,
      percentageComplete,
      authEditTemplate,
    },
    errors,
    touched,
    handleSubmit,
    handleChange,
    isValid,
    setFieldTouched,
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
        name="name"
        variant="outlined"
        helperText={touched.name ? errors.name : ''}
        error={touched.name && Boolean(errors.name)}
        label={`Project is ${percentageComplete} complete.`}
        value={name}
        text={name}
        style={{ padding: '0px 0px 10px 5px', minWidth: 200 }}
        onChange={change.bind(null, 'name')}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AssignmentIcon />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        id="outlined-start"
        name="start"
        type="date"
        variant="outlined"
        helperText={touched.start ? errors.start : ''}
        error={touched.start && Boolean(errors.start)}
        label="Start Date"
        value={start}
        style={{ padding: '0px 0px 10px 5px', minWidth: 200 }}
        onChange={change.bind(null, 'start')}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EventIcon />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        id="outlined-end"
        name="end"
        type="date"
        variant="outlined"
        helperText={touched.end ? errors.end : ''}
        error={touched.end && Boolean(errors.end)}
        label="End Date"
        value={end}
        style={{ padding: '0px 0px 10px 5px', minWidth: 200 }}
        onChange={change.bind(null, 'end')}
        InputProps={{
          startAdornment: (
            <InputAdornment position="end">
              <EventIcon />
            </InputAdornment>
          ),
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
        helperText={touched.sponsor ? errors.sponsor : ''}
        error={touched.sponsor && Boolean(errors.sponsor)}
        label="Sponsor"
        value={sponsor}
        style={{ padding: '0px 0px 10px 5px', minWidth: 200 }}
        onChange={change.bind(null, 'sponsor')}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <NameIcon />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        id="outlined-name"
        name="projectManager"
        variant="outlined"
        helperText={
          touched.projectManager ? errors.projectManager : ''
        }
        error={
          touched.projectManager && Boolean(errors.projectManager)
        }
        label="Project Manager"
        value={projectManager}
        style={{ padding: '0px 0px 10px 5px', minWidth: 200 }}
        onChange={change.bind(null, 'projectManager')}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <NameIcon />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        id="outlined-name"
        disabled={!template}
        name="templateName"
        variant="outlined"
        helperText={touched.templateName ? errors.templateName : ''}
        error={touched.templateName && Boolean(errors.templateName)}
        label="Project Template"
        value={templateName}
        style={{ padding: '0px 0px 10px 5px', minWidth: 200 }}
        onChange={change.bind(null, 'templateName')}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AccountTreeIcon />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        id="outlined-creator"
        name="creator"
        disabled
        variant="outlined"
        style={{ padding: '0px 0px 10px 5px', minWidth: 200 }}
        helperText={touched.creator ? errors.creator : ''}
        error={touched.creator && Boolean(errors.creator)}
        label="Creator"
        value={creator}
        onChange={change.bind(null, 'creator')}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon />
            </InputAdornment>
          ),
        }}
      />
      {authEditTemplate && (
        <FormControlLabel
          style={{ padding: '0px 0px 10px 5px' }}
          control={
            <Checkbox
              checked={template}
              onChange={change.bind(null, 'started')}
              value="checkedB"
              name={`template`}
              color="primary"
            />
          }
          label="Template?"
        />
      )}

      {/* <DisplayFormikState {...props} /> */}
    </form>
  );
};

export default ProjectInfo;
