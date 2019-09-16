// file system module to perform file operations
const fs = require('fs');

/**
* Description
* @function getUsers
* @param {integer}  
* @param {function} callback 
* @param {string}  
* @returns {string} status 200 success.
**/
  
function convertCSVtoProject(){
  // get the raw project from converted csv
  let csv = require('./projectCSV.json');
  
  let project = {
    name: "Project Assistant",
    background: "background",
    creator : "1",
    steps : []
  }

  csv.forEach(row => {
    if(row.StepNumber && row.QuestionNumber === null ) { // push the step info
      project.steps.push({
        stepLabel: row.StepLabel, 
        stepNumber : project.steps.length + 1,
        skip : false,
        tip : row.Tips,
        "questions": []
      });
    } else if (row.StepNumber && row.QuestionNumber) { // push the question info
      project.steps[row.StepNumber - 1].questions.push(
        {
          "number": `${row.StepNumber}.${row.QuestionNumber}`,
          "question": `${row.QuestionNumber}. ${row.Questions}`,
          "validAnswers" :'',
           answer : "",
           answerHistory : []
         }
      )
    }
    
  });
return(project);
}
 /**
 * Description
 * @function getUsers
 * @param {integer}  
 * @param {function} callback 
 * @param {string}  
 * @returns {string} status 200 success.
 **/
 
function convertCSVtoJSON(){
  // get the raw project
  let csv = require('./projectCSV.json');
  
  let project = {
    name: "Project Assistant",
    showProgressBar: "top",
    "pages": []
  }

  csv.forEach(row => {
    if(row.StepNumber && row.QuestionNumber === null ) { // push the step info
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
return(project);
}
 
// json data
var jsonData = convertCSVtoProject();
 
// parse json
// var jsonObj = JSON.parse(jsonData);
// console.log(jsonObj);
 
// stringify JSON Object
var jsonContent = JSON.stringify(jsonData);
console.log(jsonContent);
 
fs.writeFile("./src/utils/db/project.json", jsonContent, 'utf8', function (err) {
    if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
    }
 
    console.log("JSON file has been saved.");
});