
import axios from "axios";

axios.create({
  baseURL:"https://us-central1-project-534d9.cloudfunctions.net/api",
  responseType: "json"
});

/**
 * Description
 * @function initProject
 * @param {integer}  
 * @param {function} callback 
 * @param {string}  
 * @returns {string} status 200 success.
 **/

function initProject() {

}
/**
 * Description
 * @function createProject
 * @param {integer}  
 * @param {function} callback 
 * @param {string}  
 * @returns {string} status 200 success.
 **/

function createProject() {

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
* @function readProjects
* @param {integer}  
* @param {function} callback 
* @param {string}  
* @returns {string} status 200 success.
**/

async function readProjects  () {

  let response = await axios.get('https://us-central1-project-534d9.cloudfunctions.net/api/projects');
  console.log(`readProjects(${response}, ${response.data})`)
  let projects = response.data;
  
  return (projects);
}
/**
* Description
* @function updateProject
* @param {integer}  
* @param {function} callback 
* @param {string}  
* @returns {string} status 200 success.
**/

function updateProject() {

}
/**
* Description
* @function deleteProject
* @param {integer}  
* @param {function} callback 
* @param {string}  
* @returns {string} status 200 success.
**/

function deleteProject() {

}


export { initProject, createProject, readSurvey, readProjects, readProject, updateProject, deleteProject }