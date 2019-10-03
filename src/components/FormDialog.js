import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

const style = {
  width:500,
};

export default function FormDialog({ open, title, text, answerYes, answerNo, classes }) {
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

  const numberLines = text.split(/\r\n|\r|\n/).length;

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
            multiline={numberLines>0}
            defaultValue={text}
            fullWidth
            onChange={onChange}
            style={style}
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