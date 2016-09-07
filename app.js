'use strict';
//Super quick Node.js server so I can access the JSON file.
var express = require('express');
var app = express();
app.use('/', express.static(__dirname + '/'));
app.listen(3000, 'localhost');
console.log('Running static file server at http://localhost:3000');
