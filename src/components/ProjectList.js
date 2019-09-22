import React, { Component } from "react";
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'

class ProjectList extends Component {
  constructor(props) {
    super(props);

    this.handleNew = this.handleNew.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }

  handleNew(event) {
    console.log('handleNew(' + this.state.value);
  }
  onSelect(event, eventKey) {
    console.log('onSelect(',event.currentTarget.value, event.currentTarget.name);
    event.preventDefault();
    this.props.onSelect(event.currentTarget.value)
  }

  handleDelete(event) {
    console.log('handleDelete' + this.state.value);
    event.preventDefault();
  }


  render() {
    const { projects } = this.props;
    const projectList = projects.map((project, i) => <option key={i.toString()} id={i.toString()} name={i.toString()} ref={i.toString()}>{project.name}</option>);

    return (
      <div className="ProjectList">
        <Form>
          <Form.Row>
            <Form.Group as={Row} controlId="formProjectList">
              <Form.Label column sm={3}>
                Project List
              </Form.Label>
              <Col sm={4}>
                <Form.Control as="select" onChange={this.props.onSelect}>
                  {projectList}
                </Form.Control>
              </Col>
              <Col sm={2}>
                <Button variant="success" type="new" onClick={this.handleNew}>
                  New
              </Button>
              </Col>
              <Col sm={2}>
                <Button variant="danger" type="new" onClick={this.handleDelete}>
                  Delete
              </Button>
              </Col>
            </Form.Group>
          </Form.Row>
        </Form>

        <p></p>
      </div>
    );
  }
}

export default ProjectList;