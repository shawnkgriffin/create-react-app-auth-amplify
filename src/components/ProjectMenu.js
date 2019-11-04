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
import AssignmentIcon from "@material-ui/icons/Assignment";
import DeleteIcon from "@material-ui/icons/Delete";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import HelpIcon from "@material-ui/icons/Help";
import { Divider } from "@material-ui/core";

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

function CustomizedMenus({ projectList, currentProject, templateEditor, menuIndex, handleMenu }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const style = { margin: "10px 0px 10px 10px" }

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

  const projectMenuList = projectList.map((projectName, index) => {
    return (
      
      <StyledMenuItem
      key={`project.${index}.Select`}
      id={`project.${index}.Select`}
      onClick={handleSelect}
    >
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary={`${index + 1}) ${projectName}`} />
      </StyledMenuItem>

  )
})

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
      {projectMenuList}
      <Divider />
      <StyledMenuItem
        key={"2"}
        id={`project.${menuIndex}.Add`}
        onClick={handleSelect}
      >
        <ListItemIcon>
          <AddIcon />
        </ListItemIcon>
        <ListItemText primary={`Add a new project.`} />
      </StyledMenuItem>
      <StyledMenuItem
        key={"3"}
        id={`project.${menuIndex}.Copy`}
        onClick={handleSelect}
      >
        <ListItemIcon>
          <AddIcon />
        </ListItemIcon>
        <ListItemText primary={`Copy this project.`} />
      </StyledMenuItem>

      <StyledMenuItem key={"4"} id={`project.${menuIndex}.Delete`} onClick={handleSelect}>
        <ListItemIcon>
          <DeleteIcon />
        </ListItemIcon>
        <ListItemText primary={`Delete this project`} />
      </StyledMenuItem>
      <Divider />

      <StyledMenuItem
        key={"5"}
        id={`project.${menuIndex}.ProblemOpportunity`}
        onClick={handleSelect}>
        <ListItemIcon>
          <EditIcon />
        </ListItemIcon>
        <ListItemText primary={`Problem opportunity statement.`} />
      </StyledMenuItem>
      <StyledMenuItem
        key={"6"}
        id={`project.${menuIndex}.ProjectNotes`}
        onClick={handleSelect}>
        <ListItemIcon>
          <EditIcon />
        </ListItemIcon>
        <ListItemText primary={`Project Notes.`} />
      </StyledMenuItem>
      <StyledMenuItem key={"8"} id={`project.${menuIndex}.Help`} onClick={handleSelect}>
        <ListItemIcon>
          <HelpIcon />
        </ListItemIcon>
        <ListItemText primary="Guidance." />
      </StyledMenuItem>

    </StyledMenu>
  </Fragment>
);
}
const ProjectMenu = React.memo(CustomizedMenus);
export default ProjectMenu;