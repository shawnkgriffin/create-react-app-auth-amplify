import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import NameIcon from '@material-ui/icons/SupervisorAccount';
import LockIcon from '@material-ui/icons/Lock';
import HelpIcon from '@material-ui/icons/Help';
import AssignmentIcon from '@material-ui/icons/Assignment';
import EventIcon from '@material-ui/icons/Event';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
// import { DisplayFormikState } from './helper';

const buttonStyle = {
  margin: 10,
};

const ProjectInfo = props => {
  const {
    values: {
      creator,
      end,
      goalsAndObjectives,
      help,
      learnings,
      name,
      note,
      problemOpportunity,
      projectManager,
      projectPriorities,
      sponsor,
      start,
      template,
      templateName,
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

  const [displayField, setDisplayField] = React.useState('hide');

  const handleRadioChange = event => {
    setDisplayField(event.target.value);
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
      <Button
        variant="contained"
        color="secondary"
        disabled={!isValid}
        onClick={props.handleReset}
      >
        Cancel
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
      <br />
      <RadioGroup
        aria-label="gender"
        name="radio-group-form-problem-guidance"
        row={true}
        value={displayField}
        onChange={handleRadioChange}
        style={{ paddingLeft: '5px', paddingBottom: '0px' }}
      >
        <FormControlLabel
          value="note"
          control={<Radio />}
          label="Notes"
          labelPlacement="end"
          style={{ padding: '0px 0px 0px 0px' }}
        />
        <FormControlLabel
          value="problemOpportunity"
          control={<Radio />}
          label="Problem/Opportunity"
          labelPlacement="end"
          style={{ padding: '0px 0px 0px 0px' }}
        />
        <FormControlLabel
          value="goalsAndObjectives"
          control={<Radio />}
          label="Goals & Objectives"
          labelPlacement="end"
          style={{ padding: '0px 0px 0px 0px' }}
        />
        <FormControlLabel
          value="projectPriorities"
          control={<Radio />}
          label="Priorities"
          labelPlacement="end"
          style={{ padding: '0px 0px 0px 0px' }}
        />
        <FormControlLabel
          value="learnings"
          control={<Radio />}
          label="Learnings"
          labelPlacement="end"
          style={{ padding: '0px 0px 0px 0px' }}
        />
        <FormControlLabel
          value="guidance"
          control={<Radio />}
          label="Guidance"
          labelPlacement="end"
          style={{ padding: '0px 0px 0px 0px' }}
        />
        {displayField !== 'hide' && (
          <FormControlLabel
            value="hide"
            control={<Radio />}
            label="Hide"
            labelPlacement="end"
            style={{ padding: '0px 0px 0px 0px' }}
          />
        )}
      </RadioGroup>
      {displayField === 'note' && (
        <TextField
          id="outlined-note"
          name="note"
          multiline
          variant="outlined"
          style={{
            padding: '0px 0px 10px 5px',
            minWidth: 400,
            width: '95%',
          }}
          helperText={touched.note ? errors.note : ''}
          error={touched.note && Boolean(errors.note)}
          label="Note"
          value={note}
          onChange={change.bind(null, 'note')}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AssignmentIcon />
              </InputAdornment>
            ),
          }}
        />
      )}
      {displayField === 'guidance' && (
        <TextField
          id="outlined-help"
          name="help"
          multiline
          variant="outlined"
          style={{
            padding: '0px 0px 10px 5px',
            minWidth: 800,
            width: '95%',
          }}
          helperText={touched.help ? errors.help : ''}
          error={touched.help && Boolean(errors.help)}
          label="Guidance"
          value={help}
          onChange={change.bind(null, 'help')}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <HelpIcon />
              </InputAdornment>
            ),
          }}
        />
      )}
      {displayField === 'problemOpportunity' && (
        <TextField
          id="outlined-problemOpportunity"
          name="problemOpportunity"
          multiline
          variant="outlined"
          style={{
            padding: '0px 0px 10px 5px',
            minWidth: 800,
            width: '95%',
          }}
          helperText={
            touched.problemOpportunity
              ? errors.problemOpportunity
              : ''
          }
          error={
            touched.problemOpportunity &&
            Boolean(errors.problemOpportunity)
          }
          label="Problem Opportunity"
          value={problemOpportunity}
          onChange={change.bind(null, 'problemOpportunity')}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AssignmentIcon />
              </InputAdornment>
            ),
          }}
        />
      )}
      {displayField === 'goalsAndObjectives' && (
        <TextField
          id="outlined-goalsAndObjectives"
          name="goalsAndObjectives"
          multiline
          variant="outlined"
          style={{
            padding: '0px 0px 10px 5px',
            minWidth: 800,
            width: '95%',
          }}
          helperText={
            touched.goalsAndObjectives
              ? errors.goalsAndObjectives
              : ''
          }
          error={
            touched.goalsAndObjectives &&
            Boolean(errors.goalsAndObjectives)
          }
          label="Goals & Objectives"
          value={goalsAndObjectives}
          onChange={change.bind(null, 'goalsAndObjectives')}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AssignmentIcon />
              </InputAdornment>
            ),
          }}
        />
      )}
      {displayField === 'projectPriorities' && (
        <TextField
          id="outlined-projectPriorities"
          name="projectPriorities"
          multiline
          variant="outlined"
          style={{
            padding: '0px 0px 10px 5px',
            minWidth: 800,
            width: '95%',
          }}
          helperText={
            touched.projectPriorities ? errors.projectPriorities : ''
          }
          error={
            touched.projectPriorities &&
            Boolean(errors.projectPriorities)
          }
          label="Project Priorities"
          value={projectPriorities}
          onChange={change.bind(null, 'projectPriorities')}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AssignmentIcon />
              </InputAdornment>
            ),
          }}
        />
      )}
      {displayField === 'learnings' && (
        <TextField
          id="outlined-learnings"
          name="learnings"
          multiline
          variant="outlined"
          style={{
            padding: '0px 0px 10px 5px',
            minWidth: 800,
            width: '95%',
          }}
          helperText={touched.learnings ? errors.learnings : ''}
          error={touched.learnings && Boolean(errors.learnings)}
          label="Learnings"
          value={learnings}
          onChange={change.bind(null, 'learnings')}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AssignmentIcon />
              </InputAdornment>
            ),
          }}
        />
      )}
      {/* <DisplayFormikState {...props} /> */}
    </form>
  );
};

export default ProjectInfo;
