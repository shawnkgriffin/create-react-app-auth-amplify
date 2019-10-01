import React, { Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import Tooltip from "@material-ui/core/Tooltip";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import HelpIcon from "@material-ui/icons/Help";

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5"
  }
})(props => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center"
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center"
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles(theme => ({
  root: {
    "&:focus": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white
      }
    }
  }
}))(MenuItem);

export default function CustomizedMenus({ typeOfMenu, menuIndex, handleMenu }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleSelect = (event, value) => {
    event.preventDefault();
    console.log(`CustomizedMenus.handleSelect(${event.currentTarget.id})`);
    handleMenu(event.currentTarget.id);
    handleClose();
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Fragment>
      <Tooltip title="Add/Edit/Delete/Help">
        <IconButton
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          padding-top="30px"
          onClick={handleClick}
          size="small"
          style={{ marginTop: 0 }}
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
          key={"1"}
          id={`${typeOfMenu}.${menuIndex}.Add.Above`}
          onClick={handleSelect}
        >
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary={`Add a ${typeOfMenu} above this one.`} />
        </StyledMenuItem>
        <StyledMenuItem
          key={"2"}
          id={`${typeOfMenu}.${menuIndex}.Add.Below`}
          onClick={handleSelect}
        >
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary={`Add a ${typeOfMenu} below this one.`} />
        </StyledMenuItem>
        <StyledMenuItem
          key={"3"}
          id={`${typeOfMenu}.${menuIndex}.Edit`}
          onClick={handleSelect}>
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          <ListItemText primary={`Edit this ${typeOfMenu}.`} />
        </StyledMenuItem>
        <StyledMenuItem key={"4"} id={`${typeOfMenu}.${menuIndex}.Delete`} onClick={handleSelect}>
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText primary={`Delete this ${typeOfMenu}`} />
        </StyledMenuItem>
        <StyledMenuItem key={"5"} id={`${typeOfMenu}.${menuIndex}.Help`} onClick={handleSelect}>
          <ListItemIcon>
            <HelpIcon />
          </ListItemIcon>
          <ListItemText primary="Help." />
        </StyledMenuItem>
      </StyledMenu>
    </Fragment>
  );
}