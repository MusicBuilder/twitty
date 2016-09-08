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

exports.insertUser = insertUser;
exports.selectAllUsers = selectAllUsers;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;

function insertUser (uid, uname) {
    return new Promise(function(resolve, reject) {
        db.serialize(function (err) {
        //     var key = selectNextUserKey() + 1;
        var values = uid + ', \'' + uname + '\'';
        var stmt = db.prepare("INSERT INTO users (USERID, NAME) VALUES (" + values + ")");
        stmt.run();
        if (err) {
            reject(err);
        }
        stmt.finalize();
        if (err) {
            reject(err);
        }
        resolve();        
    });
    });
}

function updateUser(uid, name) {
    return new Promise(
        (resolve, reject) => {
            db.serialize(function (err) {
                var command = "UPDATE users SET NAME=\'" + name + "\' WHERE USERID=" + uid;
                var stmt = db.prepare(command);
                stmt.run();
                
                if (err) {
                    reject(err);
                    return;
                }
                
                stmt.finalize();

                resolve();
            });
        });
}

function deleteUser(uid) {
    return new Promise(
        function(resolve, reject) {
            db.serialize(function (err) {
                var command = "DELETE FROM users WHERE USERID=" + uid;
                var stmt = db.prepare(command);
                stmt.run();
                
                if (err) {
                    reject(err);
                    return;
                }
        
                stmt.finalize();
                resolve();
            });
        });
}

function selectAllUsers() {
    return new Promise((resolve, reject) => {
        db.serialize((err) => {
            db.all("SELECT * FROM users", (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(rows);
            });
        });
    });
}

function selectUser(uid) {
     return new Promise(function(resolve, reject) {
   db.serialize(function (err) {
        var count = 0;
        db.each("SELECT * FROM users WHERE USERID=" + uid, function (err, row) {
        if (err) {
            reject(err);
        }
//            console.log(count + ':' + row.USERID + ": " + row.NAME);
 //           count++;
        });
         resolve();
   });
    });
}
function insertTweet(key, uid, msg) {
     return new Promise(function(resolve, reject) {
   db.serialize(function (err) {

        var ts = new Date();
        var values = key + ', ' + uid + ', \'' + msg + '\', \'' + ts + '\'';
        var stmt = db.prepare("INSERT INTO tweets (TID, AUTHOR,MESSAGE,TS) VALUES (" + values + ")");
        stmt.run();
        if (err) {
            reject(err);
        }
        stmt.finalize();
        if (err) {
            reject(err);
        }
        resolve();
    });
    });
}
function updateTweet(tid, message) {
    return new Promise(function(resolve, reject) {
    db.serialize(function (err) {

        var command = "UPDATE tweets SET MESSAGE=\'" + message + "\' WHERE TID=" + tid;
        var stmt = db.prepare(command);
        stmt.run();
        if (err) {
            reject(err);
        }
        stmt.finalize();
        if (err) {
            reject(err);
        }
        resolve();
    });
    });
}
function deleteTweet(tid) {
    return new Promise(function(resolve, reject) {
    db.serialize(function (err) {
        var command = "DELETE FROM tweets WHERE TID=" + tid;
        var stmt = db.prepare(command);
        stmt.run();
        if (err) {
            reject(err);
        }
        stmt.finalize();
         if (err) {
            reject(err);
        }
        resolve();
    });
    });
}
function selectAllTweets() {
    return new Promise(function(resolve, reject) {
    db.serialize(function (err) {
        db.each("SELECT * FROM tweets", function (err, row) {
         if (err) {
            reject(err);
        }
            console.log(row.TID + "." + row.AUTHOR + ": " + row.MESSAGE);
        });
        resolve();
    });
    });
}
function selectTweetsFor(uid) {
     return new Promise(function(resolve, reject) {
   db.serialize(function (err) {
        db.each("SELECT * FROM tweets WHERE AUTHOR=" + uid, function (err, row) {
         if (err) {
            reject(err);
        }
            console.log(row.TID + "," + row.AUTHOR + ": " + row.MESSAGE + " " + row.TS);
            resolve();
        });
        resolve();
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