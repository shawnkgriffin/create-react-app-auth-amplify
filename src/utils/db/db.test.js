import * as db from './db.js'
const dotenv = require('dotenv');
dotenv.config();
// Firebase components
// import app from 'firebase/app';
import * as firebase from "firebase/app";
import "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
}

firebase.initializeApp(firebaseConfig);

// login user
test(`login user ${process.env.REACT_APP_TEST_EMAIL}`, done => {
  const testEmail = process.env.REACT_APP_TEST_EMAIL;
  
  //TODO validate fields. 
  firebase.auth().signInWithEmailAndPassword(process.env.REACT_APP_TEST_EMAIL, process.env.REACT_APP_TEST_PASSWORD)
    .then(data => {
      expect(data.user.email).toBe(testEmail);
    done();
    });
});

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
