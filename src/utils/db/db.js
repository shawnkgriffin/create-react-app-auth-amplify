
import axios from "axios";

axios.create({
  baseURL: "https://us-central1-project-534d9.cloudfunctions.net/api",
  responseType: "json"
});
/**
* Description
* @function createNewProject
* @param {string}  name of project
* @param {string}  creator of project
* @returns {project} 
**/

function createNewProject(name = 'New Project', creator = '', callback) {
  let newProject = require('./project.json');
  newProject.name = name;
  newProject.creator = creator;
  let today = new Date();
  let thirtyDaysFromNow = new Date(new Date().setDate(today.getDate() + 30));
  newProject.start = today.toLocaleDateString();
  newProject.end = thirtyDaysFromNow.toLocaleDateString();
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
      console.log(`Project add ${response.data.id}`)
    })
    .catch(error => {
      console.log(`Project add Error ${error}`)
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
* @function readSurvey
* @param {integer}  
* @param {function} callback 
* @param {string}  
* @returns {string} status 200 success.
**/

function readSurvey() {
  return (convertCSVtoJSON());
}
/**
* Description
* @function readProject
* @param {integer}  
* @param {function} callback 
* @param {string}  
* @returns {string} status 200 success.
**/

function readProject() {
  let project = require('./project.json');
  let newProject = Object.create(project)
  return (newProject);
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
    .then(data => { callback(data.data) }
    )
}

/**
* Description
* @function putProject
* @param {integer}  
* @param {function} callback 
* @param {string}  
* @returns {string} status 200 success.
**/

function putProject(project) {
  axios
    .put(`https://us-central1-project-534d9.cloudfunctions.net/api/project/${project.id}`, project)
    .then(response => {
      console.log(`Project saved ${response.data}`)
    })
    .catch(error => {
      console.log(`Project Save Error ${error}`)
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

function deleteProject(id) {
  axios.delete(`https://us-central1-project-534d9.cloudfunctions.net/api/project/${id}`)
    .then(response => {
      console.log(`Project Delete ${JSON.stringify(response, null, 2)}`)

    })
    .catch(error => {
      console.log(`Project Delete Error ${error}`)
    });
}


export { createNewProject, initProject, postProject, readSurvey, getProjects, readProject, putProject, deleteProject }