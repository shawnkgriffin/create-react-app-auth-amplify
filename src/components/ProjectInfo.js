import React, { Component } from "react";
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  dense: {
    marginTop: theme.spacing(2),
  },
  menu: {
    width: 200,
  },
}));

class ProjectInfo extends Component {
  

  constructor(props) {
    super(props);
    this.state = { saveButton: false,
      value: '' };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    console.log('handleChange(' + this.state.value);
    this.setState({ saveButton: true });
  }

  handleSubmit(event) {
    console.log('handleSubmit' + this.state.value);
    event.preventDefault();
    this.setState({ saveButton: false });
  }

  
  render() {
    const classes = useStyles();
  const [values, setValues] = React.useState({
    name: 'Cat in the Hat',
    age: '',
    multiline: 'Controlled',
    currency: 'EUR',
  });
    const disabled = !this.state.saveButton;
    const { project } = this.props;

    return (
      <div className="ProjectInfo">
        <form onSubmit={this.handleSubmit} onChange={this.handleChange} >
        <TextField
        id="outlined-name"
        label="Project Name"
        className={classes.textField}
        value={values.name}
        onChange={this.handleChange('name')}
        margin="normal"
        variant="outlined"
      />
          {/* <Form.Row>
            <Form.Group onChange={this.handleChange} as={Col} controlId="formGridName" >
              <Form.Label className="align-left" >Project Name</Form.Label>
              <Form.Control defaultValue={project.name} />
            </Form.Group>
            <Form.Group as={Col} controlId="formGridProjectManager">
              <Form.Label>Project Manager</Form.Label>
              <Form.Control onChange={this.handleChange} defaultValue={project.projectManager} />
            </Form.Group>
            <Form.Group as={Col} controlId="formGridSponsor">
              <Form.Label >Project Sponsor</Form.Label>
              <Form.Control onChange={this.handleChange} defaultValue={project.sponsor} />
            </Form.Group>
            <Form.Group as={Col} controlId="formGridProjectType">
              <Form.Label >Project Type</Form.Label>
              <Form.Control onChange={this.handleChange} defaultValue={project.projectType} />
            </Form.Group>
            <Form.Group as={Col} controlId="formGridStart">
              <Form.Label >Project Start</Form.Label>
              <Form.Control onChange={this.handleChange} defaultValue={project.start} />
            </Form.Group>
            <Form.Group as={Col} controlId="formGridEnd">
              <Form.Label >Project End</Form.Label>
              <Form.Control onChange={this.handleChange} defaultValue={project.end} />
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Col sm={10}>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text>Background</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control onChange={this.handleChange} as="textarea" rows="1" aria-label="Notes" defaultValue={project.background} />
              </InputGroup>
            </Col>
            <Col sm={2}>
              <Button  variant="primary" type="new" onClick={this.handleSubmit} disabled={disabled}>
                Save
              </Button>
            </Col>
          </Form.Row> */}

        </form>
        <p></p>
      </div>
    );
  }
}

export default ProjectInfo;