import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function AlertDialog({ open, title, text, answerYes, answerNo }) {
  // const [open, setOpen] = React.useState(false);

  const handleYes = () => {
    console.log(`Alert.handleYes`)
    answerYes();
  };
  const handleNo = () => {
    console.log(`Alert.handleNo`)
    answerNo();
  };
  
  const handleClose = () => {
    console.log(`Alert.handleClose`)
    answerNo();
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {text}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleYes} color="primary" variant="contained" autoFocus>
            Yes
          </Button>
          <Button variant="contained" onClick={handleNo} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
