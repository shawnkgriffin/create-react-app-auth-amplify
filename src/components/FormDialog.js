import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';
import * as utils from '../utils/generalUtilities.js';

export default function FormDialog({
  open,
  title,
  text,
  textLabel,
  formType,
  templateList,
  answerYes,
  answerNo,
  classes,
}) {
  const [values, setValues] = React.useState({
    newText: text,
    template: templateList[0],
  });

  const handleYes = () => {
    answerYes(values);
    setValues({ ...values, newText: '', template: '' });
  };

  const handleNo = () => {
    answerNo();
    setValues({ ...values, newText: '', template: '' });
  };

  const handleChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const numberLines = text.split(/\r\n|\r|\n/).length;

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleNo}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <DialogContent>
          {formType === 'TEMPLATE' && (
            <TextField
              required
              select
              variant="outlined"
              label="Template"
              value={values.template}
              onChange={handleChange('template')}
              style={{ width: '195px' }}
            >
              {templateList.map((template, index) => (
                <MenuItem key={index} value={template}>
                  {template}
                </MenuItem>
              ))}
            </TextField>
          )}
          <TextField
            autoFocus
            variant="outlined"
            label={utils.toTitleCase(textLabel)}
            margin="dense"
            id="name"
            type="text"
            multiline={numberLines > 0}
            defaultValue={text}
            fullWidth
            onChange={handleChange('newText')}
            style={{
              width: '500px',
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleYes}
            color="primary"
            variant="contained"
            autoFocus
          >
            Save
          </Button>
          <Button
            variant="contained"
            onClick={handleNo}
            color="secondary"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
