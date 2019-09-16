import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Tabs, Tab } from 'react-bootstrap'

class ProjectBar extends Component {
  constructor (props){
    super(props);
  }


  render() {
    const { project, handleButton } = this.props;

    return (
      <Tabs defaultActiveKey="1" onSelect={handleButton} className="Tab-wrapper" id="uncontrolled-tab-example">
        {project.steps.map((step, index) => {
          return (
            <Tab key={index + 1} value={index + 1} eventKey={index + 1} title={`Step ${index + 1}`} ></Tab>
          )
        })
        }
      </Tabs >
    );
  }
}

export default ProjectBar;