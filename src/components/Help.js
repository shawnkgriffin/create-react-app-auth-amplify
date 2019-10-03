import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';


export default function Help({ open, title, text, answerYes, answerNo }) {
  const style = {
    width:500,
  };
  const handleClose = () => {
    answerNo();
  };
  const numberLines = text.split(/\r\n|\r|\n/).length;

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="scroll-dialog-title"
      >
        <DialogTitle id="scroll-dialog-title">{title}</DialogTitle>
        <DialogContent dividers={false}>
        <TextField
            autoFocus
            margin="dense"
            id="name"
            type="text"
            multiline={numberLines>0}
            value={text}
            fullWidth
            style={style}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          
        </DialogActions>
      </Dialog>
    </div>
  );
}