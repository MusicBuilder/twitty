var sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database('twitty.db');

initDB(db);

function initDB(db) {
    db.serialize(function () {
        //     db.run("DROP TABLE tweets", function(err){ if (err) {}});
        db.run("CREATE TABLE tweets (TID INT NOT NULL, AUTHOR INT NOT NULL,MESSAGE CHAR(140) NOT NULL,TS TEXT NOT NULL)", function (err) { if (err) { } });
    });
    db.serialize(function () {
        //  db.run("DROP TABLE users", function(err){ if (err) {}}); //x
        db.run("CREATE TABLE users (USERID INT PRIMARY KEY NOT NULL, NAME TEXT NOT NULL)", function (err) { if (err) { } });
    });
}
function selectNextTweetKey()
{
    db.each("SELECT MAX(USERID) AS LASTKEY FROM users", function (err, row) {
        if (err) {
            return 0;
        }
        return (row.LASTKEY);
    });

}
function insertUser(uname) {
    var key = selectNextUserKey() + 1;
    var values = key + ', ' + uname;
    var stmt = db.prepare("INSERT INTO users VALUES (" + values + ")");
    stmt.run();
    stmt.finalize();
    return key;
}
function updateUser(uid, name) {
   var command = "UPDATE users SET NAME=" + uid + " WHERE USERID=" + uid;
    var stmt = db.prepare(command);
    stmt.run();
    stmt.finalize();

}
function deleteUser(uid) {
    var command = "DELETE users WHERE USERID=" + uid;
    var stmt = db.prepare(command);
    stmt.run();
    stmt.finalize();
}
function selectAllUser() {
    db.all("SELECT USERID, NAME FROM users", function (err, row) {
        if (err) {
            console.log(err);
        }
        console.log(row.USERID + ": " + row.NAME);
    });
}
function selectUser(uid) {
    db.each("SELECT USERID, NAME FROM users WHERE USERID=" + uid, function (err, row) {
        if (err) {
            console.log(err);
        }
        console.log(row.USERID + ": " + row.NAME);
    });

}
function selectNextTweetKey()
{
    db.each("SELECT MAX(TID) AS LASTKEY FROM tweets", function (err, row) {
        if (err) {
            return 0;
        }
        return (row.LASTKEY);
    });

}
function insertTweet(uid, msg) {
    var ts = new Date();
    var key = selectNextTweetKey('tweets') + 1;
    var values = key + ', ' + uid + ', ' + msg + ', ' + ts;
    var stmt = db.prepare("INSERT INTO tweets VALUES (" + values + ")");
    stmt.run();
    stmt.finalize();
    return key;
}
function updateTweet(tid, message) {
   var command = "UPDATE tweets SET MESSAGE=" + message + " WHERE TID=" + tid;
    var stmt = db.prepare(command);
    stmt.run();
    stmt.finalize();

}
function deleteTweet(tid) {
    var command = "DELETE tweets WHERE TID=" + tid;
    var stmt = db.prepare(command);
    stmt.run();
    stmt.finalize();

}
function selectAllTweets() {
    db.each("SELECT TID, AUTHOR, MESSAGE, TS FROM tweets", function (err, row) {
        if (err) {
            console.log(err);
        }
        console.log(row.TID + "." + row.AUTHOR + ": " + row.MESSAGE + " " + row.TS);
    });

}
function selectTweetsFor(uid) {
   db.each("SELECT AUTHOR, MESSAGE, TS FROM tweets WHERE AUTHOR=" + uid, function (err, row) {
        if (err) {
            console.log(err);
        }
        console.log(row.TID + "." + row.AUTHOR + ": " + row.MESSAGE + " " + row.TS);
    });

}
select
// db.close();
