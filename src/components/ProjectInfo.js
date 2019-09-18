import React, { Component } from "react";
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'

class ProjectInfo extends Component {


  render() {
    const { project, currentStep } = this.props;

    return (
      <div className="ProjectInfo">
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

          <Form.Row>
            <Form.Group as={Col} controlId="formGridName">
              <Form.Label className="align-left" >Project Name</Form.Label>
              <Form.Control defaultValue={project.name}/>
            </Form.Group>
            <Form.Group as={Col} controlId="formGridProjectManager">
              <Form.Label align >Project Manager</Form.Label>
              <Form.Control defaultValue={project.projectManager}/>
            </Form.Group>
            <Form.Group as={Col} controlId="formGridSponsor">
              <Form.Label align >Project Sponsor</Form.Label>
              <Form.Control defaultValue={project.sponsor}/>
            </Form.Group>
            <Form.Group as={Col} controlId="formGridProjectType">
              <Form.Label align >Project Type</Form.Label>
              <Form.Control defaultValue={project.projectType}/>
            </Form.Group>
            <Form.Group as={Col} controlId="formGridStart">
              <Form.Label align >Project Start</Form.Label>
              <Form.Control defaultValue={project.start}/>
            </Form.Group>
            <Form.Group as={Col} controlId="formGridEnd">
              <Form.Label align >Project End</Form.Label>
              <Form.Control defaultValue={project.end}/>
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>Background</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control as="textarea" rows="1" aria-label="Notes" defaultValue={project.background} />
          </InputGroup>
                
          </Form.Row>

        </Form>
        <p></p>
      </div>
    );
  }
}

export default ProjectInfo;