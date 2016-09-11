var express = require('express');
var app = express();
var db = require('./db.js');
// var db = require('./lewdb.js');
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.get('/foo', function (req, res) {
    res.send('yo');
});

var tweet = {
    author: '',
    message: '',
    tid: '',
    ts: ''
};

var user = {
    userid: '',
    name: ''
};

var respObj = {
    respCode: '',
    respDesc: '',
    data: {}
};

app.get('/gettweets/:userid', function(req, res) {
    res.contentType('application/json');
    var myRespObj = Object.create(respObj);

    var p = db.selectTweetsFor(req.params.userid);

    p.then(
        (data) => {
            console.log(data);
            myRespObj.respCode = '0000';
            myRespObj.respDesc = 'success';
            myRespObj.data = data;

            res.send(JSON.stringify(myRespObj));
            console.log('response sent');
        },
        (err) => {
            myRespObj.respCode = '9999';
            myRespObj.respDesc = 'error';
            myRespObj.data = data;

            res.send(JSON.stringify(myRespObj));
        }
    );
});

app.post('/createtweet', (req, res) => {
    var json = JSON.parse(req.body);
    var p = db.insertTweet(json.username, json.message);

    var myRespObj = Object.create(respObj);

    p.next(
        function() {
            myRespObj.respCode = '0000';
            myRespObj.respDesc = 'Tweet created successfully';
            myRespObj.data = {};

            res.send(JSON.stringfy(myRespObj));
        }
    ).catch(
        (err) => {
            myRespObj.respCode = '9999';
            myRespObj.respDesc = 'Tweet creation failed';
            myRespOjb.data = {};
            
            res.send(JSON.stringify(myRespObj));
        }
    )
});

// Implments the Create User
app.post('/createuser', (req, res) => {
    var p = db.insertUser(req.body.userid, req.body.name);

    p.then(
        () => {
            myRespObj.respCode = '0000';
            myRespObj.respDesc = 'create user success';
            myRespObj.data = {};

            res.send(JSON.stringify(myRespObj));
        }
    ).catch(
        (err) => {
            myRespObj.respCode = '9999';
            myRespObj.respDesc = 'create user failed';
            myRespObj.data = {};
            
            res.send(JSON.stringify(myRespObj));
        }
    )

    res.send('User Added');
});

// Implements update of user
app.post('/updateuser', (req, res) => {
    var p = db.updateUser(req.body.userid, req.body.name);
    var myRespObj = Object.create(respObj);

    p.then(
        () => {
            myRespObj.respCode = '0000';
            myRespObj.respDesc = 'success';
            myRespObj.data = {};

            res.send(JSON.stringify(myRespObj));
        },
        (err) => {
            myRespObj.respCode = '9999';
            myRespObj.respDesc = 'update user failed';
            myRespObj.data = {};
            
            res.send(JSON.stringify(myRespObj));
        }
    );
});

// Implements Read of User
app.get('/getuser/:userid', (req, res) => {
    res.contentType('application/json');

    // No need to parse, engine has already done this for you.
    var myRespObj = Object.create(respObj);

    var p = db.selectUser(req.params.userid);

    p.then(
        (data) => {
            if (data === 'undefined') {
                // Nothing was found.
                myRespObj.respCode = '9999';
                myRespObj.respDesc = 'user not found';
                myRespObj.data = '';
            } else {
                myRespObj.respCode = '0000';
                myRespObj.respDesc = 'success';
                myRespObj.data = data;
            }

            res.send(JSON.stringify(myRespObj));
        }
    ).catch(
        (err) => {
            myRespObj.respCode = '9999';
            myRespObj.respDesc = 'select user failed';
            myRespObj.data = '';
            
            res.send(JSON.stringify(myRespObj));
        }
    );
});

// Implment delete of user
app.post('/deleteuser', (req, res) => {
    var p = db.deleteUser(req.body.userid);

    var myRespObj = Object.create(respObj);

    p.then(
        () => {
            console.log('Inside delete promise resolve');
            myRespObj.respCode = '0000';
            myRespObj.respDesc = 'success';
            myRespObj.data = {};

            res.send(myRespObj);
        },
        function(err) {
            console.log('Inside delete error');
            myRespObj.respCode = '9999';
            myRespObj.respDesc = 'delete user failed';
            myRespObj.data = {};
            
            res.send(myRespObj);
        }
    );
});

app.get('/getallusers', function (req, res) {
    res.contentType('application/json');
    var allUsers = {};
    var myRespObj = Object.create(respObj);

    var p = db.selectAllUsers();

    /*
    p.then(
        (rows) => {
            console.log('Got list of users');
            console.log(rows);

            for (row of rows) {
                var aUser = Object.create(user);
                console.log(row);
                aUser.userid = row.USERID;
                aUser.name = row.NAME;

                allUsers[aUser.userid] = aUser;
            }

            
            console.log(allUsers);
            return allUsers;
        }
    ).then(
        (data) => {
            // Here it just sends the data back to the caller.
            console.log('Sending ' + data);
            myRespObj.respCode = '0000';
            myRespObj.respDesc = 'success';
            myRespObj.data = data;

            res.send(JSON.stringify(myRespObj));
        },
        (err) => {
            myRespObj.respCode = '9999';
            myRespObj.respDesc = 'error of some sort';
            myRespObj.data = '';

            res.send(JSON.stringify(myRespObj));
        }
    );
    */
    p.then(
        (data) => {
            // Here it just sends the data back to the caller.
            console.log('Sending ' + data);
            myRespObj.respCode = '0000';
            myRespObj.respDesc = 'success';
            myRespObj.data = data;

            res.send(JSON.stringify(myRespObj));
        },
        (err) => {
            myRespObj.respCode = '9999';
            myRespObj.respDesc = 'error of some sort';
            myRespObj.data = '';

            res.send(JSON.stringify(myRespObj));
        }
    );
});

app.listen(8080, function () {
    console.log('Example app listening on port 8080!');
});
