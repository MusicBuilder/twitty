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
    user: '',
    text: '',
    id: ''
};

var user = {
    userid: '',
    name: ''
};

app.get('/gettweets/:id', function(req, res) {
    res.contentType('application/json');
    // var tweets = db.getUserTweets(req.params.id);

    /*
    var tweets = [];
    var tweet1 = Object.create(tweet);
    tweet1.user = 'Lew';
    tweet1.text = 'Sample text 1';
    tweet1.id = '1';
    var tweet2 = Object.create(tweet);
    tweet2.user = 'Lew';
    tweet2.text = 'Sample text 2';
    tweet2.id = '2';

    tweets.push(tweet1);
    tweets.push(tweet2);
    */

    // console.log('Id passed in was ' + req.params.id);
    var tweets = db.getUserTweets(req.query['id]']);
    var outputText = {};

    for (tweet of tweets) {
        // console.log('Adding tweet:  ' + tweet['text']);
        outputText[tweet.tid] = tweet;
    }

    res.send(JSON.stringify(outputText));
});

app.post('/createtweet', (req, res) => {
    // Get post parameters and call db
    var user = req.body.username;
    var message = req.body.message;

    db.insertTweet(user, message);
});

// Implments the Create User
app.post('/createuser', (req, res) => {
    var aname = req.body.name;
    var userId = req.body.userid;
    var p = db.insertUser(userId, aname);

    p.then(
        () => {
            console.log('User with name ' + name + ' added');
        }
    ).catch(
        (err) => {
            console.log("Error inserting user.");
        }
    )

    res.send('User Added');
});

// Implements update of user
app.post('/updateuser', (req, res) => {
    var userid = req.body.userid;
    var name = req.body.name;

    var p = db.updateUser(userid, name);

    p.then(
        () => {
            res.send("Update Successful");
        },
        (err) => {
            res.send("Update failed");
        }
    );
});

// Implements Read of User
app.get('/getuser/:id', (req, res) => {
    res.contentType('application/json');
    var userid = req.query.id;

    // Get the promise from the db layer.


    var user = db.getUser(userid);
    res.send(JSON.stringify(user));
});

// Implment delete of user
app.post('/deleteuser', (req, res) => {
    var p = db.deleteUser(req.body.userid);

    p.then(
        () => {
            res.send("Delete successful");
        },
        function(err) {
            res.send("Delete failed");
        }
    );
});

app.get('/getallusers', (req, res) => {
    res.contentType('application/json');
    var allUsers = {};
    var p = db.selectAllUsers();

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
            res.send(JSON.stringify(data));
        },
        (err) => {
            console.log('Error getting all users');
        }
    );
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
