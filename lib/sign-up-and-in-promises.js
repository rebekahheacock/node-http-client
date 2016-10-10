'use strict';

// gain access to node-provided http module
const http = require('http');

// make a JSON string out of a Plain Old JS Object
const formData = JSON.stringify({
  credentials: {
    email: process.argv[2],
    password: process.argv[3],
  },
});

// error handler for error events
const onError = (error) => {
  // if error has a response property
  if (typeof error === 'object' && error.response) {
    console.error(error.response.statusCode, error.response.statusMessage);
    console.error(error.data);
  } else {
    console.error(error.stack);
  }
};

const onSignIn = (response) => {
  console.log(response);
  console.log('Signed in');
};

const onSignUp = (response) => {
  console.log(response);
  console.log('Signed up');
};

const baseOptions = {
  hostname: 'localhost',
  port: 3000,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': formData.length,
  },
};

// signUpOrIn is a fat arrow function that implicitly returns a new promise
const signUpOrIn = (credentials, path) =>
  new Promise((resolve, reject) => {
    const options = Object.assign({ path }, baseOptions);
    const request = http.request(options, (response) => {
      let data = '';
      response.setEncoding('utf8');

      // on error, reject promise
      // call reject(error), which goes to catch,
      // which calls onError(error)
      response.on('error', reject);
      response.on('data', (chunk) => {
        data += chunk;
      });
      // resolve on completed response
      response.on('end', () => {
        if (response.statusCode >= 200 &&
            response.statusCode < 300) {
          resolve(data);
        } else {
          // reject promise with response.error data if status code isn't success
          // pass { response, data } to catch (and by extension to onError)
          reject({ response, data });
        }
      });
    });

    // on error, reject promise with request error
    request.on('error', reject);

    // data sent in request body
    request.write(credentials);
    request.end();
  });

const signUp = (credentials) => signUpOrIn(credentials, '/sign-up');
const signIn = (credentials) => signUpOrIn(credentials, '/sign-in');

signUp(formData)
.then(onSignUp)
.then(() => signIn(formData))
.then(onSignIn)
.catch(onError);
