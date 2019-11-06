import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Login from "./Login";
import ProjectMenu from "./ProjectMenu";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    paddingBottom: "5"
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function ButtonAppBar({ firebase, projectList, currentProject, menuIndex, handleMenu }) {
  const classes = useStyles();
  
  return (
    <div className={classes.root}>
      <AppBar position="static" style={{ paddingBottom: "5" }}>
        <Toolbar>
          <ProjectMenu
            firebase={firebase}
            projectList={projectList}
            currentProject={currentProject}
            menuIndex={menuIndex}
            handleMenu={handleMenu} />
          {/* <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton> */}
          <Typography variant="h6" className={classes.title}>
            Project Assistant
          </Typography>
          <Login firebase={firebase} />
        </Toolbar>
      </AppBar>
      <br />
    </div>
  );
}