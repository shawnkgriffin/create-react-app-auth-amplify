import React, { Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import Tooltip from '@material-ui/core/Tooltip';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import HelpIcon from '@material-ui/icons/Help';

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})(props => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles(theme => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

function CustomizedMenus({
  typeOfMenu,
  menuIndex,
  handleMenu,
  copyDeliverable = null,
  copyWorkPackage = null,
  copyQuestion = null,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const style = { marginTop: 0, color: 'inherit' };
  let directions = [];
  let pasteMenu = false;
  let pasteName = '';
  switch (typeOfMenu.toUpperCase()) {
    case 'DELIVERABLE':
      directions = ['to the left of', 'to the right of'];
      if (copyDeliverable !== null) {
        pasteMenu = true;
        pasteName = copyDeliverable.name;
      }
      break;
    case 'WORK PACKAGE':
      directions = ['above', 'below'];
      if (copyWorkPackage !== null) {
        pasteMenu = true;
        pasteName = copyWorkPackage.name;
      }
      break;
    case 'QUESTION':
      directions = ['above', 'below'];
      if (copyQuestion !== null) {
        pasteMenu = true;
        pasteName = copyQuestion.name;
      }
      break;
    default:
      break;
  }
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleSelect = (event, value) => {
    event.preventDefault();
    console.log(
      `CustomizedMenus.handleSelect(${event.currentTarget.id})`,
    );
    handleMenu(event.currentTarget.id);
    handleClose();
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Fragment>
      <Tooltip title="Add/Edit/Delete/Notes/Guidance">
        <IconButton
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          padding-top="30px"
          onClick={handleClick}
          size="small"
          style={style}
        >
          <MoreVertIcon />
        </IconButton>
      </Tooltip>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <StyledMenuItem
          key={`${typeOfMenu}.${menuIndex}.Add.Above`}
          id={`${typeOfMenu}.${menuIndex}.Add.Above`}
          onClick={handleSelect}
        >
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText
            primary={`Add a ${typeOfMenu} ${directions[0]} this one.`}
          />
        </StyledMenuItem>

        <StyledMenuItem
          key={`${typeOfMenu}.${menuIndex}.Add.Below`}
          id={`${typeOfMenu}.${menuIndex}.Add.Below`}
          onClick={handleSelect}
        >
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText
            primary={`Add a ${typeOfMenu} ${directions[1]} this one.`}
          />
        </StyledMenuItem>
        {pasteMenu && (
          <div>
            <StyledMenuItem
              key={`${typeOfMenu}.${menuIndex}.Paste.Above`}
              id={`${typeOfMenu}.${menuIndex}.Paste.Above`}
              onClick={handleSelect}
            >
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <ListItemText
                primary={`Paste ${typeOfMenu} "${pasteName}" ${directions[0]} this one.`}
              />
            </StyledMenuItem>

            <StyledMenuItem
              key={`${typeOfMenu}.${menuIndex}.Paste.Below`}
              id={`${typeOfMenu}.${menuIndex}.Paste.Below`}
              onClick={handleSelect}
            >
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <ListItemText
                primary={`Paste ${typeOfMenu} "${pasteName}" ${directions[1]} this one.`}
              />
            </StyledMenuItem>
          </div>
        )}
        <StyledMenuItem
          key={`${typeOfMenu}.${menuIndex}.Copy`}
          id={`${typeOfMenu}.${menuIndex}.Copy`}
          onClick={handleSelect}
        >
          <ListItemIcon>
            <FileCopyIcon />
          </ListItemIcon>
          <ListItemText primary={`Copy this ${typeOfMenu}.`} />
        </StyledMenuItem>
        <StyledMenuItem
          key={`${typeOfMenu}.${menuIndex}.Edit`}
          id={`${typeOfMenu}.${menuIndex}.Edit`}
          onClick={handleSelect}
        >
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          <ListItemText primary={`Edit this ${typeOfMenu}.`} />
        </StyledMenuItem>
        <StyledMenuItem
          key={`${typeOfMenu}.${menuIndex}.Delete`}
          id={`${typeOfMenu}.${menuIndex}.Delete`}
          onClick={handleSelect}
        >
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText primary={`Delete this ${typeOfMenu}.`} />
        </StyledMenuItem>
        <StyledMenuItem
          key={`${typeOfMenu}.${menuIndex}.Notes`}
          id={`${typeOfMenu}.${menuIndex}.Notes`}
          onClick={handleSelect}
        >
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          <ListItemText primary={`Notes for this ${typeOfMenu}.`} />
        </StyledMenuItem>
        <StyledMenuItem
          key={`${typeOfMenu}.${menuIndex}.EditHelp`}
          id={`${typeOfMenu}.${menuIndex}.EditHelp`}
          onClick={handleSelect}
        >
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          <ListItemText
            primary={`Edit guidance for this ${typeOfMenu}.`}
          />
        </StyledMenuItem>
        <StyledMenuItem
          key={`${typeOfMenu}.${menuIndex}.Help`}
          id={`${typeOfMenu}.${menuIndex}.Help`}
          onClick={handleSelect}
        >
          <ListItemIcon>
            <HelpIcon />
          </ListItemIcon>
          <ListItemText primary="Guidance." />
        </StyledMenuItem>
      </StyledMenu>
    </Fragment>
  );
}
const ProjectWorkPackageQuestionMenu = React.memo(CustomizedMenus);
export default ProjectWorkPackageQuestionMenu;
