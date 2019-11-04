
import axios from "axios";
import * as utils from '../generalUtilities'

axios.create({
  baseURL: "https://us-central1-project-534d9.cloudfunctions.net/api",
  responseType: "json"
});

/**
* Description
* @function copyProject
* @param {object}  project
* @returns {project} deep copy of project.
**/

function copyProject(oldProject, callback) {
  
  let projectCopy = JSON.parse(JSON.stringify(oldProject));
  projectCopy.name = `${oldProject.name} (copy)`;
  postProject(projectCopy, id => {
    projectCopy.id = id;
    callback(projectCopy);
  })
}
/**
* Description
* @function createNewProject
* @param {string}  name of project
* @param {string}  creator of project
* @returns {project} 
**/

function createNewProject(name = 'New Project', creator = '', template = null, callback) {
  let newProject = require('./project.json')
  if (template !== null)
    newProject = JSON.parse(JSON.stringify(template));
  newProject.name = name;
  newProject.creator = creator;
  newProject.template = false;
  let today = new Date();
  let thirtyDaysFromNow = new Date(new Date().setDate(today.getDate() + 30));
  newProject.start = utils.formatDate(today);
  newProject.end = utils.formatDate(thirtyDaysFromNow);
  postProject(newProject, id => {
    newProject.id = id;
    callback(newProject);
  })
}
/**
 * Description
 * @function initProject
 * @param {integer}  
 * @param {function} callback 
 * @param {string}  
 * @returns {string} status 200 success.
 **/

function initProject(project, callback) {

}
/**
 * Description
 * @function postProject
 * @param {integer}  
 * @param {function} callback 
 * @param {string}  
 * @returns {string} status 200 success.
 **/

function postProject(newProject, callback) {
  axios.post(`https://us-central1-project-534d9.cloudfunctions.net/api/project`, newProject)
    .then(response => {
      callback(response.data.id)
    })
    .catch(error => {
      callback(error);
    });
}

/**
 * Description
* @function convertCSVtoJSON
* @returns {project} json structure for questions.
**/

function convertCSVtoJSON() {
  // get the raw project
  let csv = require('./projectCSV.json');

  let project = {
    title: "Project Assistant",
    showProgressBar: "top",
    "pages": []
  }

  csv.forEach(row => {
    if (row.StepNumber && row.QuestionNumber === null) { // push the step info
      project.pages.push({
        "name": row.StepLabel,
        "elements": [
          {
            "type": "matrix",
            "name": row.StepLabel,
            "title": row.StepLabel,
            "columns": [
              {
                "value": "Yes",
                "text": "Yes"
              },
              {
                "value": "No",
                "text": "No"
              },
              {
                "value": "Skip",
                "text": "Skip"
              },
              {
                "value": "Later",
                "text": "Later"
              }
            ],
            "rows": [
            ]
          }
        ]
      });
    } else if (row.StepNumber && row.QuestionNumber) { // push the question info
      project.pages[row.StepNumber - 1].elements[0].rows.push(
        {
          "value": `${row.StepNumber}.${row.QuestionNumber}`,
          "text": `${row.QuestionNumber}. ${row.Questions}`
        }
      )
    }

  });
  return (project);
}


/**
* Description
* @function getProjects
* @param {integer}  
* @param {function} callback 
* @param {string}  
* @returns {string} status 200 success.
**/

async function getProjects(user, callback) {
  axios
    .get(`https://us-central1-project-534d9.cloudfunctions.net/api/userprojects/${user}`)
    .then(data => {
      let projects = data.data;
      projects.forEach(project => {
        if (project.template === undefined) {
          project.templateName = "Basic Project";
          project.template = false;
        }
        project.steps.forEach(step => {
          if (step.started === undefined) {
            step.started = false;
            step.startedDate = "";
            step.completed = false;
            step.completedDate = "";
            step.assignedTo = "";
          }
        })
      })

      callback(projects.filter(project => !project.template));
    }
    )
}
/**
 * Description
 * @function getTemplates
 * @param {integer}  
 * @param {function} callback 
 * @param {string}  
 * @returns {string} status 200 success.
 **/

async function getTemplates(user, callback) {
  axios
  .get(`https://us-central1-project-534d9.cloudfunctions.net/api/templates`)
  .then(data => {
    let templates = data.data;
    templates.forEach(template => {
      if (template.template === undefined) {
        template.templateName = "Basic template";
        template.template = false;
      }
      template.steps.forEach(step => {
        if (step.started === undefined) {
          step.started = false;
          step.startedDate = "";
          step.completed = false;
          step.completedDate = "";
          step.assignedTo = "";
        }
      })
    })
    if (templates.length === 0) {
      console.err(`db.getTemplates ! no templates returned.`)
      let newProject = require('./project.json')
      newProject.template = true;
      templates.push(newProject)
    }
    callback(templates);
  }
  )
}
/**
* Description
* @function createTemplate
* @param {string}  name of project
* @param {string}  creator of project
* @returns {project} 
**/

function createTemplate(templateName = 'New Template', project = {}, creator = '', callback) {
  let newTemplate = JSON.parse(JSON.stringify(project));

  //remove any data from the template
  newTemplate.name = '';
  newTemplate.problemOpportunity = '';
  newTemplate.creator = creator;
  newTemplate.note = '';
  newTemplate.sponsor = '';
  newTemplate.projectManager = '';
  newTemplate.templateName = templateName;
  newTemplate.template = true;
  newTemplate.start = '';
  newTemplate.end = '';
  newTemplate.steps.forEach(step => {
    step.note = "";
    step.assignedTo = "";
    step.started = false;
    step.completed = false;
    step.startedDate = "";
    step.completedDate = "";
    step.questions.forEach(question => {
      question.answer = "";
      question.answerHistory = [];
    })
  })

  postProject(newTemplate, id => {
    newTemplate.id = id;
    callback(newTemplate);
  })
}

/**
* Description
* @function putProject
* @param {project}  
* @param {function} callback 
* @param {string}  
* @returns {string} status 200 success.
**/

function putProject(project, callback) {

  axios
    .put(`https://us-central1-project-534d9.cloudfunctions.net/api/project/${project.id}`, project)
    .then(response => {
      callback(response)
    })
    .catch(error => {
      callback(error)
    });

}
/**
 * Description
 * @function deleteProject
 * @param {integer}  
 * @param {function} callback 
 * @param {string}  
 * @returns {string} status 200 success.
 **/

function deleteProject(id, callback) {
  axios.delete(`https://us-central1-project-534d9.cloudfunctions.net/api/project/${id}`)
    .then(response => {
      callback(response)

    })
    .catch(error => {
      callback(error)
    });
}


export { createNewProject, copyProject, initProject, postProject, getProjects, putProject, deleteProject, getTemplates, createTemplate, convertCSVtoJSON }