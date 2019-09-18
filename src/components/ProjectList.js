import React, { Component } from "react";
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'

class ProjectList extends Component {


  render() {
    const { project } = this.props;

    return (
      <div className="ProjectList">
        <Form>
          <Form.Row>
            <Form.Group as={Row} controlId="formHorizontalEmail">
              <Form.Label column sm={3}>
                Project List
              </Form.Label>
              <Col sm={4}>
                <Form.Control as="select">
                  <option>{project.name}</option>
                  <option>Second Project</option>
                </Form.Control>
              </Col>
              <Col sm={2}>
                <Button variant="primary" type="new">
                  New
              </Button>
              </Col>
              <Col sm={2}>
                <Button variant="danger" type="delete">
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