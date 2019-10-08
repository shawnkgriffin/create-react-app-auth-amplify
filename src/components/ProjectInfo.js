import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import ProjectMenu from "./ProjectMenu";
import { TextField, Button } from "@material-ui/core";

class ProjectInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      saveButton: false,
      value: ""
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancelClick = this.handleCancelClick.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const id = target.id;
    const name = target.name;
    console.log(`handleSubmit(target:${target},value:${value}, name:${name}, id:${id})`);
    let newProjectInfo = this.state;
    this.props.handleProjectInfoChange(newProjectInfo)
    this.setState({ saveButton: false });
  }

  handleCancelClick(event) {
    event.preventDefault();
    this.setState({ saveButton: false });
    let newProjectInfo = {};
    this.props.handleProjectInfoChange(newProjectInfo)
  }
  handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    const id = target.id;
    console.log(`handleInputChange(target:${target},value:${value}, id:${id})`);
    this.setState({
      [name]: value
    });
    this.setState({ saveButton: true });
  }
  render(props) {
    let { projects, currentProject, edit, handleMenu, classes } = this.props;
    edit = true;
    let project = projects[currentProject];
    console.log(`ProjectInfo(${project.name})`);

    const buttonStyle = {
      marginTop: 25,
      marginLeft: 10,
      visibility: this.state.saveButton ? "visible" : "hidden"
    };

    const textField = (label, field, text) => {
      if (edit) {
        return (
          <TextField
            id={`outlined-${field}`}
            label={label}
            name={field}
            defaultValue={text}
            className={classes.textField}
            margin="normal"
            variant="outlined"
            style={{ paddingRight: 5, width: 300 }}
            onChange={this.handleInputChange}
          />
        )
      } else
        return (
          <TextField
            id={`outlined-${field}`}
            label={label}
            name={field}
            value={text}
            className={classes.textField}
            margin="normal"
            variant="outlined"
            style={{ paddingRight: 5, width: 300 }}
            onChange={this.handleInputChange}
          />
        )
    }

    return (
      <Paper className={classes.paper}>
        <form
          className={classes.container}
          noValidate
          autoComplete="off"
          onSubmit={this.handleSubmit}
        >
          <ProjectMenu
            projects={projects}
            currentProject={currentProject}
            typeOfMenu="project"
            menuIndex={1}
            handleMenu={handleMenu} />
          {textField("Name", "name", project.name)}
          <Button
            type="submit"
            name="submit"
            variant="contained"
            color="primary"
            style={buttonStyle}
          >
            Save
          </Button>
          <Button
            type="button"
            name="cancel"
            variant="contained"
            color="secondary"
            style={buttonStyle}
            onClick={this.handleCancelClick}
          >
            Cancel
          </Button>
          <br />
          {textField("Sponsor", "sponsor", project.sponsor)}
          {textField("Manager", "projectManager", project.projectManager)}
          {textField("Type", "projectType", project.projectType)}

          <TextField
            id="outlined-creator"
            label="Creator"
            name="creator"
            disabled
            className={classes.textField}
            value={project.creator}
            margin="normal"
            style={{ paddingRight: 5 }}
            variant="outlined"
            onChange={this.handleInputChange}
          />
          {textField("Start", "start", "2019/09/01")}
          {textField("End", "end", "2019/09/01")}

          <br />
          <TextField
            id="outlined-full-width"
            label="Presenting problem / Opportunity"
            name="problemOpportunity"
            value={project.problemOpportunity}
            disabled={!edit}
            margin="normal"
            variant="outlined"
            multiline={true}
            style={{ width: 600 }}
            onChange={this.handleInputChange}
          />
        </form>
      </Paper>
    );
  }
}

export default ProjectInfo;
