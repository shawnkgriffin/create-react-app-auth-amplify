import * as db from './db.js'
let createdProject = {};
let projects = [];
let template = require('./project.json');
template.template = true;
template.templateName = 'Test Template'
const timeStamp = new Date().toLocaleString();

// test create a new project
test('a new project is created', done => {
  const testEmail = 'test@test.com';
  const testProjectName = `Test Project${timeStamp}`;
  function callback(newProject) {
    expect(newProject.name).toBe(testProjectName);
    done();
    createdProject = newProject;
  }
  db.createNewProject(testProjectName, testEmail, template, callback);
});

// test update a new project
test('update a project', done => {
  const testProjectName = 'Test Project Update';
  createdProject.name = testProjectName;
  function callback(response) {
    expect(response.status).toBe(200);
    done();
  }
  db.putProject(createdProject, callback);
});

// test delete a project
test('delete a project', done => {
  function callback(response) {
    expect(response.status).toBe(200);
    done();
  }
  db.deleteProject(createdProject.id, callback);
});
