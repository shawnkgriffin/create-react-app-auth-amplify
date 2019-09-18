import React, { Component } from "react";
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import InputGroup from 'react-bootstrap/InputGroup'

class ProjectInfo extends Component {


  render() {
    const { project } = this.props;

    return (
      <div className="ProjectInfo">
        <Form>
          <Form.Row>
            <Form.Group as={Col} controlId="formGridName">
              <Form.Label className="align-left" >Project Name</Form.Label>
              <Form.Control defaultValue={project.name}/>
            </Form.Group>
            <Form.Group as={Col} controlId="formGridProjectManager">
              <Form.Label>Project Manager</Form.Label>
              <Form.Control defaultValue={project.projectManager}/>
            </Form.Group>
            <Form.Group as={Col} controlId="formGridSponsor">
              <Form.Label >Project Sponsor</Form.Label>
              <Form.Control defaultValue={project.sponsor}/>
            </Form.Group>
            <Form.Group as={Col} controlId="formGridProjectType">
              <Form.Label >Project Type</Form.Label>
              <Form.Control defaultValue={project.projectType}/>
            </Form.Group>
            <Form.Group as={Col} controlId="formGridStart">
              <Form.Label >Project Start</Form.Label>
              <Form.Control defaultValue={project.start}/>
            </Form.Group>
            <Form.Group as={Col} controlId="formGridEnd">
              <Form.Label >Project End</Form.Label>
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