var express = require('express');
var app = express();
var db = require('./db.js');

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.get('/foo', function (req, res) {
    res.send('yo');
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
