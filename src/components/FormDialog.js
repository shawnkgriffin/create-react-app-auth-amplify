import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function FormDialog({ open, title, text, answerYes, answerNo }) {
  const [newText,setText] = useState(text);
  
  const handleYes = () => {
    answerYes(newText);
  };
  const handleNo = () => {
    answerNo();
  };
  
  
  const onChange = (e) => {
    setText(e.target.value);
    console.log(`onChange${newText}`)
    
  }

  return (
    <div>
      <Dialog open={open} onClose={handleNo} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            type="text"
            defaultValue={text}
            fullWidth
            onChange={onChange}
          />
        </DialogContent>
        <DialogActions>
        <Button onClick={handleYes} color="primary" variant="contained" autoFocus>
            Save
          </Button>
          <Button variant="contained" onClick={handleNo} color="secondary">
            Cancel
          </Button>
          
        </DialogActions>
      </Dialog>
    </div>
  );
}