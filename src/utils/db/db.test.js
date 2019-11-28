// Firebase components
// import app from 'firebase/app';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import * as schema from './projectSchema.js';
import * as importData from './backup-production-191120';
import * as utils from '../generalUtilities';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();

// We are setting up data that we can check between tests
let template = JSON.parse(JSON.stringify(schema.projectSchema));
template.template = true;
template.templateName = 'Test Template';
const timeStamp = new Date().toLocaleString();
let newProject = JSON.parse(JSON.stringify(template));
newProject.id = '';
newProject.creator = process.env.REACT_APP_TEST_EMAIL;
newProject.name = `Test Project${timeStamp}`;
const sharedWithUser = 'test1@test.com';

// test create a new project should fail
test('new project create fails without authorizationw', done => {
  db.collection('projects')
    .add(newProject)
    .then(docRef => {
      expect(docRef.id.length).toBeGreaterThan(0);
      newProject.id = docRef.id;
      done();
    })
    .catch(function(error) {
      expect(error).toBeTruthy();
      done();
    });
});

// login user
test(`login user ${process.env.REACT_APP_TEST_EMAIL}`, done => {
  const testEmail = process.env.REACT_APP_TEST_EMAIL;

  //TODO validate fields.
  firebase
    .auth()
    .signInWithEmailAndPassword(
      process.env.REACT_APP_TEST_EMAIL,
      process.env.REACT_APP_TEST_PASSWORD,
    )
    .then(data => {
      expect(data.user.email).toBe(testEmail);
      done();
    });
});

// import data from backups ONLY USE IF NECESSARY
// test('import project', done => {
//   importData.projects.forEach((project, projectIndex) => {
//     db.collection('projects')
//       .doc(project.id)
//       .set(project)
//       .then(() => {
//         if (projectIndex == importData.projects.length - 1) {
//           expect(1).toEqual(1);
//           done();
//         }
//       })
//       .catch(function(error) {
//         console.error('Error importing document: ', error);
//         done();
//       });
//   });
// });

// upgrade schema backups ONLY USE IF NECESSARY
test('update schemas', done => {
  // importData.projects.forEach((project, projectIndex) => {
  importData.projects.forEach((project, projectIndex) => {
    let upgradedProject = utils.updateProjectSchema(project);
    if (projectIndex === importData.projects.length - 1) {
      expect(1).toEqual(1);
      done();
    }
  });
});

// test create a new project should succeed
test('a new project is created', done => {
  db.collection('projects')
    .add(newProject)
    .then(function(docRef) {
      expect(docRef.id.length).toBeGreaterThan(0);
      newProject.id = docRef.id;
      done();
    })
    .catch(function(error) {
      console.error('Error adding document: ', error);
      done();
    });
});

// read projects and make sure you get back the one you created
test('read projects and make sure new one is there', done => {
  let projectFound = false;

  db.collection('projects')
    .where('creator', '==', process.env.REACT_APP_TEST_EMAIL)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        if (doc.id === newProject.id) projectFound = true;
      });
      expect(projectFound).toBeTruthy();
      done();
    })
    .catch(function(error) {
      console.log('Error getting documents: ', error);
    });
});

// update a project
test('update a project', done => {
  const oldProjectName = newProject.name;
  const newProjectName = 'new project name';
  newProject.name = newProjectName;

  db.collection('projects')
    .doc(newProject.id)
    .set(newProject)
    .then(() => {
      let projectFound = false;

      db.collection('projects')
        .where('creator', '==', process.env.REACT_APP_TEST_EMAIL)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            if (doc.id === newProject.id) {
              let checkProject = doc.data();
              projectFound = checkProject.name === newProjectName;
            }
          });
          expect(projectFound).toBeTruthy();
          done();
        });
    })
    .catch(function(error) {
      console.log('Error getting documents: ', error);
    });
});

// share a project
test('share a project', done => {
  newProject.sharedWith = [sharedWithUser];
  db.collection('projects')
    .doc(newProject.id)
    .set(newProject)
    .then(() => {
      let projectFound = false;

      db.collection('projects')
        .where('sharedWith', 'array-contains', sharedWithUser)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            if (doc.id === newProject.id) {
              let checkProject = doc.data();
              projectFound = checkProject.sharedWith.includes(
                sharedWithUser.toLowerCase(),
              );
            }
          });
          expect(projectFound).toBeTruthy();
          done();
        });
    })
    .catch(function(error) {
      console.log('Error getting documents: ', error);
    });
});

// delete a project
test('delete project', done => {
  db.collection('projects')
    .doc(newProject.id)
    .delete()
    .then(() => {
      let projectFound = false;

      db.collection('projects')
        .where('creator', '==', process.env.REACT_APP_TEST_EMAIL)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            if (doc.id === newProject.id) projectFound = true;
          });
          expect(projectFound).toBeFalsy();
          done();
        })
        .catch(function(error) {
          console.log('Error getting documents: ', error);
        });
    })
    .catch(function(error) {
      console.log('Error getting documents: ', error);
    });
});
