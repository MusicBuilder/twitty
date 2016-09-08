var sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database('twitty.db');

// initDB(db);

function initDB(db) {
    db.serialize(function() {
   //     db.run("DROP TABLE tweets", function(err){ if (err) {}});
        db.run("CREATE TABLE tweets (AUTHOR INT NOT NULL,MESSAGE CHAR(140) NOT NULL,TS TEXT NOT NULL)", function(err){ if (err) {}});

        var stmt = db.prepare("INSERT INTO tweets VALUES (1,'test', '9/8/2016')");
        stmt.run();
        stmt.finalize();

        db.each("SELECT AUTHOR, MESSAGE, TS FROM tweets", function (err, row) {
            if (err) {
                console.log(err);
            }
            console.log(row.AUTHOR + ": " + row.MESSAGE + " " + row.TS);
        });
    });
    db.serialize(function() {
     //  db.run("DROP TABLE users", function(err){ if (err) {}}); //x
        db.run("CREATE TABLE users (USERID INT PRIMARY KEY NOT NULL, NAME TEXT NOT NULL)", function(err){ if (err) {}});

        var stmt = db.prepare("INSERT INTO users VALUES (1, 'Brian')");
        stmt.run();
        stmt.finalize();

        db.each("SELECT USERID, NAME FROM users", function (err, row) {
            if (err) {
                console.log(err);
            }
            console.log(row.USERID + ": " + row.NAME);
        });
    });
}
initDB(db);
// db.close();
