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
import AssignmentIcon from '@material-ui/icons/Assignment';
import DeleteIcon from '@material-ui/icons/Delete';
import MenuIcon from '@material-ui/icons/Menu';
import HelpIcon from '@material-ui/icons/Help';
import { Divider } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

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
  firebase,
  projectList,
  templateList,
  currentProject,
  templateEditor,
  authEditTemplate,
  handleMenu,
}) {
  const user = firebase.auth().currentUser;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const style = { margin: '10px 0px 10px 10px' };

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

  const projectMenuList = user
    ? projectList.map((projectName, index) => {
        if (index === projectList.length - templateList.length)
          return (
            <div>
              <Divider />
              <Typography
                color="textSecondary"
                display="block"
                variant="subtitle1"
                style={{ paddingLeft: '10px', paddingTop: '10px' }}
              >
                Templates
              </Typography>
              <StyledMenuItem
                key={`project.${index}.Select`}
                id={`project.${index}.Select`}
                onClick={handleSelect}
              >
                <ListItemIcon>
                  <AssignmentIcon />
                </ListItemIcon>
                <ListItemText
                  primary={`${index + 1}) ${projectName}`}
                />
              </StyledMenuItem>
            </div>
          );
        else
          return (
            <StyledMenuItem
              key={`project.${index}.Select`}
              id={`project.${index}.Select`}
              onClick={handleSelect}
            >
              <ListItemIcon>
                <AssignmentIcon />
              </ListItemIcon>
              <ListItemText
                primary={`${index + 1}) ${projectName}`}
              />
            </StyledMenuItem>
          );
      })
    : [];

  return (
    <Fragment>
      <Tooltip title="Create/Copy/Delete/Share/Opportunity/Notes/Guidance">
        <IconButton
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          padding-top="30px"
          onClick={handleClick}
          size="small"
          style={style}
        >
          <MenuIcon style={{ color: 'white', paddingRight: '5' }} />
        </IconButton>
      </Tooltip>
      <StyledMenu
        id="customized-menu"
        disabled={!user}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <div>
          <Typography
            color="textSecondary"
            display="block"
            variant="subtitle1"
            style={{ paddingLeft: '10px' }}
          >
            My Projects
          </Typography>
        </div>
        {projectMenuList}
        )}
        <Divider />
        <StyledMenuItem
          key={'2'}
          id={`project.${currentProject}.Add`}
          onClick={handleSelect}
          disabled={!user}
        >
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary={`Create a new project.`} />
        </StyledMenuItem>
        <StyledMenuItem
          key={'3'}
          id={`project.${currentProject}.Copy`}
          onClick={handleSelect}
          disabled={!user}
        >
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary={`Copy this project.`} />
        </StyledMenuItem>
        <StyledMenuItem
          disabled={!user}
          key={'4'}
          id={`project.${currentProject}.Delete`}
          onClick={handleSelect}
        >
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText primary={`Delete this project`} />
        </StyledMenuItem>
        <StyledMenuItem
          disabled={!user}
          key={'7'}
          id={`project.${currentProject}.Share`}
          onClick={handleSelect}
        >
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText primary={`Share this project`} />
        </StyledMenuItem>
        <Divider />
        <StyledMenuItem
          key={'5'}
          disabled={!user}
          id={`project.${currentProject}.ProblemOpportunity`}
          onClick={handleSelect}
        >
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          <ListItemText primary={`Problem opportunity statement.`} />
        </StyledMenuItem>
        <StyledMenuItem
          key={'6'}
          disabled={!user}
          id={`project.${currentProject}.ProjectNotes`}
          onClick={handleSelect}
        >
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          <ListItemText primary={`Project Notes.`} />
        </StyledMenuItem>
        <StyledMenuItem
          disabled={!user}
          key={'8'}
          id={`project.${currentProject}.Help`}
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
const ProjectMenu = React.memo(CustomizedMenus);
export default ProjectMenu;
