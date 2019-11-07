import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import AssignmentIcon from "@material-ui/icons/Assignment";
import Avatar from '@material-ui/core/Avatar';
import LogoutButton from "./LogoutButton";
import ProjectMenu from "./ProjectMenu";

const useStyles = makeStyles(theme => ({
  avatar: {
    margin: 10,
  },
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
  const user = firebase.auth().currentUser;
  return (
    <div className={classes.root}>
      <AppBar position="static" >
        <Toolbar>
          <ProjectMenu
            firebase={firebase}
            projectList={projectList}
            currentProject={currentProject}
            menuIndex={menuIndex}
            handleMenu={handleMenu} />
          <Typography variant="h6" className={classes.title}>
            Project Assistant
          </Typography>
          {user &&
          <IconButton aria-label="show projects" color="inherit">
          <Badge badgeContent={projectList.length} color="secondary">
              <AssignmentIcon />
          </Badge>
        </IconButton>
          }
          {user && user.photoURL &&
            <Avatar alt={user.displayName} src={user.photoURL} className={classes.avatar} />
          }
          {user &&
            <LogoutButton firebase={firebase} />
          }
        </Toolbar>
      </AppBar>
      <br />
    </div>
  );
}