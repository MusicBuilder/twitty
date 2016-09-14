var express = require('express');
var app = express();
var db = require('./db.js');
var bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
// app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.post('/login', function(req, res) {
    var user = req.body.userid;
    var pass = req.body.pass;

    legit = db.selectUser(user);

    legit.then(
        (data) => {
            console.log(data);
            if (data.password === pass) {
                res.status(200).send('success');
            } else {
                res.status(404).send('failure');
            }
        }
    );
});

app.get('/tweets/:id', function(req, res) {
    var p = db.selectTweetsFor(req.params.id);

    p.then(
        (tweets) => {
            res.status(200).send(tweets);
        }
    );
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
