import React, { Component } from "react";
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'

class Notes extends Component {


  render() {
    const { project, currentStep } = this.props;

    return (
      <div className="Notes">
        <Form>
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text>Notes on Step {currentStep + 1}</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control as="textarea" rows="2" aria-label="Notes" defaultValue= {project.steps[currentStep].notes} />
        </InputGroup>
        </Form>
      </div>
    );
  }
}

export default Notes;