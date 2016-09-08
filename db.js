var sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database('twitty.db');


function initDB(db) {
    db.serialize(function () {
        db.run("DROP TABLE tweets", function (err) { if (err) { } });
        db.run("CREATE TABLE tweets (TID INTEGER PRIMARY KEY NOT NULL, AUTHOR INT NOT NULL,MESSAGE CHAR(140) NOT NULL,TS TEXT NOT NULL)", function (err) { if (err) { } });
    });
    db.serialize(function () {

        db.run("DROP TABLE users", function (err) { if (err) { } }); //x
        db.run("CREATE TABLE users (USERID INTEGER PRIMARY KEY NOT NULL, NAME TEXT NOT NULL)", function (err) { if (err) { } });
    });
}
//function selectNextUserKey() {
//    db.serialize(function () {
//        var count = 0;
//    db.each("SELECT MAX(USERID) AS LASTKEY FROM users", function (err, row) {
//        if (err) {
//            console.log("ERR");
//            return 0;
//        }
//       console.log(count++);
//       if (Number.isNaN(row.LASTKEY))
//        {
//             console.log("NAN");
//           return 0;
//        }
//            console.log("REAL");
//        return row.LASTKEY;
//    });
//
//    });

//}
function insertUser(uid, uname) {
    db.serialize(function (err) {
        //     var key = selectNextUserKey() + 1;
        var values = uid + ', \'' + uname + '\'';
        var stmt = db.prepare("INSERT INTO users (USERID, NAME) VALUES (" + values + ")");
        stmt.run();
        if (err) {
            console.log(err);
        }
        stmt.finalize();
    });
}
function updateUser(uid, name) {
    db.serialize(function (err) {
        var command = "UPDATE users SET NAME=\'" + name + "\' WHERE USERID=" + uid;
        var stmt = db.prepare(command);
        stmt.run();
        stmt.finalize();
    });
}
function deleteUser(uid) {
    db.serialize(function (err) {
        var command = "DELETE FROM users WHERE USERID=" + uid;
        var stmt = db.prepare(command);
        stmt.run();
        if (err) {
            console.log(err);
        }
        stmt.finalize();
        if (err) {
            console.log(err);
        }
    });
}
function selectAllUsers() {
    db.serialize(function (err) {
        var output = new Array();
        db.all("SELECT * FROM users", function (err, row) {
            if (err) {
                console.log(err);
            }output.push(row);
            console.log(row.USERID + ": " + row.NAME);
        });
        return output;
    });
}
function selectUser(uid) {
    db.serialize(function (err) {
        var count = 0;
        db.each("SELECT * FROM users WHERE USERID=" + uid, function (err, row) {
            if (err) {
                console.log(err);
            }
            console.log(count + ':' + row.USERID + ": " + row.NAME);
            count++;
        });
    });
}
function insertTweet(key, uid, msg) {
    db.serialize(function (err) {

        var ts = new Date();
        var values = key + ', ' + uid + ', \'' + msg + '\', \'' + ts + '\'';
        var stmt = db.prepare("INSERT INTO tweets (TID, AUTHOR,MESSAGE,TS) VALUES (" + values + ")");
        stmt.run();
        if (err)
            console.log(err);
        stmt.finalize();
        if (err)
            console.log(err);
    });
}
function updateTweet(tid, message) {
    db.serialize(function (err) {

        var command = "UPDATE tweets SET MESSAGE=\'" + message + "\' WHERE TID=" + tid;
        var stmt = db.prepare(command);
        stmt.run();
        stmt.finalize();
    });
}
function deleteTweet(tid) {
    db.serialize(function (err) {
        var command = "DELETE FROM tweets WHERE TID=" + tid;
        var stmt = db.prepare(command);
        stmt.run();
        if (err) { }
        stmt.finalize();
        if (err) { }
    });
}
function selectAllTweets() {
    db.serialize(function (err) {
        db.each("SELECT * FROM tweets", function (err, row) {
            if (err) {
                console.log(err);
                throw err;
            }
            console.log(row.TID + "." + row.AUTHOR + ": " + row.MESSAGE);
        });
    });
}
function selectTweetsFor(uid) {
    db.serialize(function (err) {
        db.each("SELECT * FROM tweets WHERE AUTHOR=" + uid, function (err, row) {
            if (err) {
                console.log(err);
            }
            console.log(row.TID + "," + row.AUTHOR + ": " + row.MESSAGE + " " + row.TS);
        });
    });
}
initDB(db);

function debugit() {
    var xuid = 1;
    console.log("add Users");
    insertUser(xuid++, 'brianr');
    insertUser(xuid++, 'billr');
    insertUser(xuid++, 'lewisE');
    insertUser(xuid++, 'oprah');
    console.log("display Users");
    var list = selectAllUsers();
    for (var i in list)
               console.log(list[i].USERID + ": " + list[i].NAME);
    console.log("select single row");
    selectUser(3);
    console.log("add tweets");
    insertTweet(1, 3, "It cant be done");
    insertTweet(2, 3, "It cant be done well");
    insertTweet(3, 1, "It cant be done here");
    insertTweet(4, 2, "It cant be done today");
    insertTweet(5, 3, "It cant be done anywhere");
    console.log("select for Users");
    selectTweetsFor(2);
    selectTweetsFor(1);
    selectTweetsFor(3);
    console.log("select all tweets");
    selectAllTweets();
    console.log("delete twwet 2");
    deleteTweet(2)
    selectAllTweets();
    console.log("update a User");
    updateUser(2, "Inigo Montoya");
    selectUser(2);

    console.log("delete User 1");
    deleteUser(1);
    list = selectAllUsers();
    for (var i in list)
               console.log(list[i].USERID + ": " + list[i].NAME);

}
debugit();