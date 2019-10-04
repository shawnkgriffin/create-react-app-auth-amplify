import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import MenuProjects from "../components/MenuProjects";
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
    this.handleClick = this.handleClick.bind(this);
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
  
  handleClick(event) {
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
    const { project, classes, edit  } = this.props;
    console.log(`ProjectInfo(${project.name})`);
    const buttonStyle = {
      marginTop: 25,
      marginLeft: 10,
      visibility: this.state.saveButton ? "visible" : "hidden"
    };
    return (
      <Paper className={classes.paper}>
        <form
          className={classes.container}
          noValidate
          autoComplete="off"
          onSubmit={this.handleSubmit}
        >
          <MenuProjects />
          <TextField
          disabled = {!edit}
          id="outlined-name"
          label="Name"
          name="name"
          className={classes.textField}
          defaultValue={project.name}
          margin="normal"
          variant="outlined"
          style={{ paddingRight: 5, width:300 }}
          onChange={this.handleInputChange}
          />
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
            onClick={this.handleClick}
            >
            Cancel
          </Button>
          <br />
          <TextField
            id="outlined-sponsor"
            disabled = {!edit}
            label="Sponsor"
            name="sponsor"
            className={classes.textField}
            defaultValue={project.sponsor}
            margin="normal"
            variant="outlined"
            style={{ paddingRight: 5 }}
            onChange={this.handleInputChange}
            />
          <TextField
            id="outlined-manager"
            disabled = {!edit}
            label="Manager"
            name="projectManager"
            className={classes.textField}
            defaultValue={project.projectManager}
            margin="normal"
            style={{ paddingRight: 5 }}
            variant="outlined"
            onChange={this.handleInputChange}
            />
          <TextField
            id="outlined-project-type"
            label="Type"
            name="projectType"
            className={classes.textField}
            disabled = {!edit}
            defaultValue={project.projectType}
            margin="normal"
            style={{ paddingRight: 5 }}
            variant="outlined"
            onChange={this.handleInputChange}
            />
          <TextField
            id="outlined-project-type"
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
          <TextField
            id="outlined-start"
            label="Start"
            className={classes.textField}
            name="start"
            disabled = {!edit}
            defaultValue="2019/09/01"
            margin="normal"
            style={{ width: 150, paddingRight: 5 }}
            variant="outlined"
            onChange={this.handleInputChange}
            />
          <TextField
            id="outlined-end"
            label="End"
            className={classes.textField}
            name="end"
            defaultValue="2019/10/30"
            style={{ width: 150, paddingRight: 5 }}
            disabled = {!edit}
            margin="normal"
            variant="outlined"
            onChange={this.handleInputChange}
            />

          <br />
          <TextField
            id="outlined-full-width"
            label="Presenting problem / Opportunity"
            name="problemOpportunity"
            defaultValue={project.problemOpportunity}
            disabled = {!edit}
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
