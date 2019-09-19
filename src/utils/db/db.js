const NUMBER_PROJECTS = 3;

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
  return (project);
}
/**
* Description
* @function readProjects
* @param {integer}  
* @param {function} callback 
* @param {string}  
* @returns {string} status 200 success.
**/

function readProjects() {
  let project = require('./project.json');
  let projects = [];
  projects.name = `Project 1`
  projects.push(project)

  for (let i = 0; i < NUMBER_PROJECTS; i++ ){

    projects.push(Object.create(project))
    projects[projects.length - 1].name = `Project ${i+1}`
  }
  
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