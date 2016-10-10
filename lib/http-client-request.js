'use strict';

const http = require('http');

const method = (process.argv[2] || 'get').toUpperCase();

const data = JSON.stringify({
  key: 'value',
});

const headers = {
  'Content-Type': 'application/json',
  'Content-Length': data.length,
};

// returns true if method is POST or PATCH
// simpler than if method === POST || method === PATCH then sendData = true else false
const sendData = ['POST', 'PATCH'].some(e => e === method);

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/upload',
  method,
};

if (sendData) {
  options.headers = headers;
}

const request = http.request(options, (response) => {
  let data = '';
  response.setEncoding('utf8');
  response.on('error', console.error);
  response.on('data', (chunk) => {
    data += chunk;
  });
  response.on('end', () => {
    console.log(data);
  });
});

request.on('error', console.error);

if (sendData) {
  request.write(data);
}

request.end();
