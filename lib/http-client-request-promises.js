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

// create new promise
// this doesn't have a wrapper (unlike previous versions we've seen)
new Promise((resolve, reject) => {
  const request = http.request(options, (response) => {
    let data = '';
    response.setEncoding('utf8');
    response.on('error', reject);
    response.on('data', (chunk) => {
      data += chunk;
    });
    response.on('end', () => {
      // resolve marks the promise as successful
      // passes "data" to callback inside next "then"
      resolve(data);
    });
  });

  request.on('error', reject);

  if (sendData) {
    request.write(data);
  }

  request.end();
}).then(console.log).catch(console.error);
