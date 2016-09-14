var sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database('twitty.db');

exports.insertUser = insertUser;                // inserts uid, name, pwd, profile (all strings) row id generated
exports.updateUser = updateUser;                // uid, name, pwd, profile (all strings) updates name, pwd & profile
exports.updateUserName = updateUserName;        // uid, name (all strings)
exports.updateUserPwd = updateUserPwd;          // uid, pwd (all strings)
exports.updateUserProfile = updateUserProfile;  // uid, profile (all strings)
exports.deleteUser = deleteUser;                // uid
exports.selectAllUsers = selectAllUsers;        // return all users
exports.selectUser = selectUser;                // uid return one user/uid
exports.insertTweet = insertTweet;
exports.updateTweet = updateTweet;
exports.deleteTweet = insertTweet;
exports.updateTweet = updateTweet;
exports.insertFollowing = insertFollowing;
exports.selectFollowing = selectFollowing;
exports.selectFollowed = selectFollowed;
exports.deleteFollowing = deleteFollowing;
exports.insertLike = insertLike;
exports.deleteLike = deleteLike;
exports.selectILike = selectILike;
exports.selectLikedBy = selectLikedBy;
exports.selectWhoLikesTweet = selectWhoLikesTweet;
exports.selectTweetsLikedBy = selectTweetsLikedBy;
exports.insertReply = insertReply;
exports.updateReply = updateReply;
exports.deleteReply = deleteReply;
exports.selectRepliesForTweet = selectRepliesForTweet;
exports.selectRepliesForUser = selectRepliesForUser;
exports.selectTweetsFor = selectTweetsFor;
exports.selectUserFeed = selectUserFeed;

var tweet = {
    author: '',
    message: '',
    tid: '',
    ts: ''
};
var user = {
    primaryKey: '',
    userid: '',
    name: '',
    password: '',
    profile: ''
};
var reply = {
    original: '',
    tid: '',
    author: '',
    message: '',
    ts: ''
};
var likedTweet = {
    userid: '',
    tid: '',
    ts: ''
};
var following = {
    leader: '',
    follower: '',
};
// Create DB tables Production should  
function initDB(db) {
    console.log('creating tables');
    db.serialize(function () {

        db.run("DROP TABLE users", function (err) { if (err) { } });
        console.log("create users table");
        db.run("CREATE TABLE users \
        (USERPK INTEGER PRIMARY KEY NOT NULL, \
        USERID TEXT UNIQUE NOT NULL, \
        NAME TEXT NOT NULL, \
        PASSWORD TEXT NOT NULL, \
        PROFILE TEXT)", function (err) { if (err) { } });
    });
    db.serialize(function () {
        db.run("DROP TABLE tweets", function (err) { if (err) { } });
        console.log("create tweets table");
        db.run("CREATE TABLE tweets \
        (TID INTEGER PRIMARY KEY NOT NULL, \
        AUTHOR TEXT NOT NULL,\
        MESSAGE CHAR(140) NOT NULL,\
        TS TEXT NOT NULL)", function (err) { if (err) { } });
    });
    db.serialize(function () {

        db.run("DROP TABLE replies", function (err) { if (err) { } }); //x
        console.log("create replies table");
        db.run("CREATE TABLE replies \
        (REPID INTEGER PRIMARY KEY NOT NULL, \
        TID INT NOT NULL, \
        AUTHOR TEXT NOT NULL,\
        MESSAGE CHAR(140) NOT NULL,\
        TS TEXT NOT NULL)", function (err) { if (err) { } });
    });
    db.serialize(function () {

        db.run("DROP TABLE followRel", function (err) { if (err) { } }); //x
        console.log("create followRel table");
        db.run("CREATE TABLE followRel \
        (LEADER TEXT NOT NULL, \
        FOLLOWER TEXT NOT NULL)", function (err) { if (err) { } });
    });
    db.serialize(function () {

        db.run("DROP TABLE likeRel", function (err) { if (err) { } }); //x
        console.log("create likeRel table");
        db.run("CREATE TABLE likeRel \
        (TWEET_ID TEXT NOT NULL, \
        UID TEXT NOT NULL, \
        TS TEXT NOT NULL)", function (err) { if (err) { } });
    });

}

function asMyQuote(input) {
    return '\'' + input + '\'';
}
function selectLastPK(col, tbl) {
    var p;
    p = new Promise(function (resolve, reject) {
        db.serialize(function () {
            var command = "SELECT MAX(" + col + ") AS MAXPK FROM " + tbl;
            db.all(command, function (err, rows) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        });
    }).then(
        (rows) => {
            // Process them.
            var value;
            for (thisROW of rows) {
                value = thisROW.MAXPK;
            }
            console.log(value);
            return value;
        },
        (err) => {
            console.log('Error getting last primary key');
            return -1;
        });

    return p;
}

// User Table functions

function insertUser(uid, uname, pw, pro) {
    var p;
    p = new Promise(function (resolve, reject) {
        db.serialize(function () {
            var values = asMyQuote(uid) + ', ' + asMyQuote(uname) + ', ' + asMyQuote(pw) + ', ' + asMyQuote(pro);
            var stmt = db.prepare("INSERT INTO users (USERID, NAME, PASSWORD, PROFILE) VALUES (" + values + ")");
            stmt.run();
            if (err) {
                console.log(err);
                reject(err);
            }
            stmt.finalize();
            if (err) {
                console.log(err);
                reject(err);
            }
            resolve();
        });
        resolve();

    });
    return p;

}
function updateUser(uid, name, pw, pro) {
    var p;
    p = new Promise(function (resolve, reject) {
        db.serialize(function () {
            var quid = asMyQuote(uid);
            var qName = asMyQuote(name);
            var qpwd = asMyQuote(pw);
            var qpro = asMyQuote(pro);
            var command = "UPDATE users SET NAME=" + qName + ", PASSWORD=" + qpwd + ", PROFILE=" + qpro + " WHERE USERID=" + quid;
            var stmt = db.prepare(command);
            stmt.run();
            if (err) {
                reject(err);
            }
            stmt.finalize();
            if (err) {
                reject(err);
            }
            console.log(command);
            resolve();
        });
    });
    return p;
}
function updateUserName(uid, name) {
    var p;
    p = new Promise(function (resolve, reject) {
        db.serialize(function () {
            var quid = asMyQuote(uid);
            var qName = asMyQuote(name);
            var command = "UPDATE users SET NAME=" + qName + " WHERE USERID=" + quid;
            var stmt = db.prepare(command);
            stmt.run();
            if (err) {
                reject(err);
            }
            stmt.finalize();
            if (err) {
                reject(err);
            }
            console.log(command);
            resolve();
        });
    });
    return p;
}
function updateUserPwd(uid, name) {
    var p;
    p = new Promise(function (resolve, reject) {
        db.serialize(function () {

            var quid = asMyQuote(uid);
            var qName = asMyQuote(name);
            var command = "UPDATE users SET PASSWORD=" + qName + " WHERE USERID=" + quid;
            var stmt = db.prepare(command);
            stmt.run();
            if (err) {
                reject(err);
            }
            stmt.finalize();
            if (err) {
                reject(err);
            }
            console.log(command);
            resolve();
        });
    });
    return p;
}
function updateUserProfile(uid, name) {
    var p;
    p = new Promise(function (resolve, reject) {
        db.serialize(function () {
            var quid = asMyQuote(uid);
            var qName = asMyQuote(name);
            var command = "UPDATE users SET PROFILE=" + qName + " WHERE USERID=" + quid;
            var stmt = db.prepare(command);
            stmt.run();
            if (err) {
                reject(err);
            }
            stmt.finalize();
            if (err) {
                reject(err);
            }
            console.log(command);
            resolve();
        });
    });
    return p;
}
function deleteUser(uid) {
    var p;
    p = new Promise(function (resolve, reject) {
        db.serialize(function () {
            var quid = asMyQuote(uid);
            var command = "DELETE FROM users WHERE USERID = " + quid;
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
    return p;
}
function selectAllUsers() {
    var allUsers = {};
    var p;
    p = new Promise(function (resolve, reject) {
        db.serialize(function () {
            var command = "SELECT * FROM users";
            db.all(command, function (err, rows) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        });
    }).then(
        (rows) => {
            // Process them.
            var outputData = {};
            var count = 0;
            for (thisROW of rows) {
                var aUser = Object.create(user);
                aUser.primaryKey = thisROW.USERPK;
                aUser.userid = thisROW.USERID;
                aUser.name = thisROW.NAME;
                aUser.password = thisROW.PASSWORD;
                aUser.profile = thisROW.PROFILE;
                outputData[count] = aUser;
                console.log('The output of row  ' + outputData[count].primaryKey + ': '+ outputData[count].userid);
                count++;
            }
            return outputData;
        },
        (err) => {
            console.log('Error getting users');
            return {};
        });

    return p;
}

//tweet table functions
function selectUser(uid) {
    var p;

    p = new Promise(function (resolve, reject) {
        db.serialize(function () {
            var quid = asMyQuote(uid);
            var command = "SELECT * FROM users WHERE USERID = " + quid;

            db.all(command, function (err, rows) {
                if (err) {
                    reject(err);
                }

                console.log(command);
                resolve(rows);
            });
        });
    }).then(
        (rows) => {
            // Process them.
            var outputData = {};

            if (rows.length > 0) {
                var aUser = Object.create(user);

                aUser.primaryKey = thisROW.USERPK;
                aUser.userid = thisROW.USERID;
                aUser.name = thisROW.NAME;
                aUser.password = thisROW.PASSWORD;
                aUser.profile = thisROW.PROFILE;

                return aUser;
            } else {
                return {};
            }
        },
        (err) => {
            console.log('Error getting users');
            return {};
        }
    );

    return p;

}
function insertTweet(tid, uid, msg) {
    var p;
    p = new Promise(function (resolve, reject) {
        db.serialize(function () {
            var quid = asMyQuote(uid);
            var qmsg = asMyQuote(msg);

            var ts = asMyQuote(new Date());
            var values = tid + ', ' + quid + ',' + qmsg + ', ' + ts;
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
        }).then((data) => {
            var pkVal = selectLastPK('TID', 'tweets');
            pk1.then((pk) => { return pk; });

        });
    });
    return p;
}
function updateTweet(tid, message) {
    var p;
    p = new Promise(function (resolve, reject) {
        db.serialize(function () {
            var ts = asMyQuote(new Date());
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
    return p;
}
function deleteTweet(tid) {
    var p;
    p = new Promise(function (resolve, reject) {
        db.serialize(function () {

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
    return p;
}
function selectAllTweets() {
    var p;
    p = new Promise(function (resolve, reject) {
        db.serialize(function () {

            var command = "SELECT * FROM tweets";
            db.all(command, function (err, row) {
                if (err) {
                    reject(err);
                }
                resolve(row);
            });
        });
    }).then(
        (rows) => {
            // Process them.
            var outputData = {};

            for (thisRow of rows) {
                var aTweet = Object.create(tweet);

                aTweet.author = thisRow.AUTHOR;
                aTweet.message = thisRow.MESSAGE;
                aTweet.tid = thisRow.TID;
                aTweet.ts = thisRow.TS;

                outputData[aTweet.message] = aTweet;
                console.log('The output of row:  ' + outputData.AUTHOR);
            }
            return outputData;
        },
        (err) => {
            console.log('Error getting tweets');
            return {};
        }
        );
    return p;
}

function selectTweetsFor(uid) {
    var p;
    p = new Promise(function (resolve, reject) {
        db.serialize(function () {

            var quid = asMyQuote(uid);
            db.serialize(function (err) {
                var command = "SELECT * FROM tweets WHERE AUTHOR=" + quid;
                db.all(command, function (err, row) {
                    if (err) {
                        reject(err);
                    }
                    resolve(row);
                });
            });
        });
    }).then(
        (rows) => {
            // Process them.
            var outputData = {};

            for (thisRow of rows) {
                var aTweet = Object.create(tweet);

                aTweet.author = thisRow.AUTHOR;
                aTweet.message = thisRow.MESSAGE;
                aTweet.tid = thisRow.TID;
                aTweet.ts = thisRow.TS;

                outputData[aTweet.tid] = aTweet;
                console.log('The output of row:  ' + outputData[aTweet.tid].author + ": " + outputData[aTweet.tid].message);
            }
            return outputData;
        },
        (err) => {
            console.log('Error getting tweets');
            return {};
        }
    );

    return p;
}

// replies table functions
// insert
function insertReply(tid, uid, msg) {
    var p;
    p = new Promise(function (resolve, reject) {
        db.serialize(function () {
            var quid = asMyQuote(uid);
            var qmsg = asMyQuote(msg);

            var ts = asMyQuote(new Date());
            var values = tid + ', ' + quid + ',' + qmsg + ', ' + ts;
            var stmt = db.prepare("INSERT INTO replies (TID, AUTHOR,MESSAGE,TS) VALUES (" + values + ")");
            stmt.run();
            if (err) {
                reject(err);
            }
            stmt.finalize();
            if (err) {
                reject(err);
            }
            resolve();
        }).then((data) => {
            var pkVal = selectLastPK('REPID', 'replies');
            pk1.then((pk) => { return pk; });

        });
    });
    return p;
}
// update
function updateReply(repid, msg) {
    var p;
    p = new Promise(function (resolve, reject) {
        db.serialize(function () {
            var ts = asMyQuote(new Date());
            var command = "UPDATE replies SET MESSAGE=\'" + message + "\' WHERE REPID=" + repid;
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
    return p;

}
// delete
function deleteReply(repid) {
    var p;
    p = new Promise(function (resolve, reject) {
        db.serialize(function () {

            var command = "DELETE FROM replies WHERE REPID=" + repid;
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
    return p;

}

// select all for tweet id
 function selectRepliesForTweet(tid) {
   var p;
    p = new Promise(function (resolve, reject) {
        db.serialize(function () {
            var command = "SELECT * FROM replies WHERE TID=" + tid;
            db.all(command, function (err, rows) {
                if (err) {
                    reject(err);
                }
                resolve(rows);
            });
        });
    }).then(
        (rows) => {
            // Process them.
            var outputData = {};
            for (thisRow of rows) {
                var aReply = Object.create(reply);

                aReply.original = thisRow.TID;
                aReply.tid = thisRow.REPID;
                aReply.message = thisRow.MESSAGE;
                aReply.author = thisRow.AUTHOR;
                aReply.ts = thisRow.TS;

                outputData[aReply.tid] = aReply;
                console.log('The output of row:  ' + outputData[aReply.tid].author + ": " + outputData[aReply.tid].message);
            }
            return outputData;
        },
        (err) => {
            console.log('Error getting tweets');
            return {};
        }
    );

    return p;
}
// select all for user id
function selectRepliesForUser(uid) {
    var p;
    p = new Promise(function (resolve, reject) {
        db.serialize(function () {
            var quid = asMyQuote(uid);
            var command = "SELECT * FROM replies WHERE AUTHOR=" + quid;
            db.all(command, function (err, row) {
                if (err) {
                    reject(err);
                }
                resolve(row);
            });
        });
    }).then(
        (rows) => {
            // Process them.
            var outputData = {};
            var count = 0;
            for (thisRow of rows) {
                var aReply = Object.create(reply);

                aReply.original = thisRow.TID;
                aReply.tid = thisRow.REPID;
                aReply.message = thisRow.MESSAGE;
                aReply.author = thisRow.AUTHOR;
                aReply.ts = thisRow.TS;

                outputData[count] = aReply;
                console.log('The output of row:  ' + outputData[count].author + ": " + outputData[count].message);
                count++;
            }
            return outputData;
        },
        (err) => {
            console.log('Error getting tweets');
            return {};
        }
        );
    return p;

}

// followRel Table functions
function insertFollowing(lead, follow) {
    var p;
    p = new Promise(function (resolve, reject) {
        db.serialize(function () {
            var qlead = asMyQuote(lead);
            var qfollow = asMyQuote(follow);

            var values = qlead + ', ' + qfollow;
            var command = "INSERT INTO followRel (LEADER, FOLLOWER) VALUES (" + values + ")";
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
        }).then((data) => {
            var pkVal = selectLastPK('rowid', 'followRel');
            pk1.then((pk) => { return pk; });

        });
    });
    return p;
}
function deleteFollowing(lead, follow) {
    var p;
    p = new Promise(function (resolve, reject) {
        db.serialize(function () {
            var qload = asMyQuote(lead);
            var qfollow = asMyQuote(follow);
            var command = "DELETE FROM followRel WHERE LEADER = " + qlead + " AND FOLLOWER = " + qfollow;
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
    return p;
}
function selectFollowing(follow) {
    var p;
    p = new Promise(function (resolve, reject) {
        db.serialize(function () {
            var qfollow = asMyQuote(follow);
            var command = "SELECT * FROM followRel WHERE FOLLOWER = " + qfollow;
            db.all(command, function (err, row) {
                if (err) {
                    reject(err);
                }
                resolve(row);
            });
        });
    }).then(
        (rows) => {
            // Process them.
            var outputData = {};

            for (thisRow of rows) {
                var aFollow = Object.create(follow);

                aFollow.leader = thisRow.LEADER;
                aFollow.follower = thisRow.FOLLOWER;

                outputData[aFollow.leader] = aFollow;
                console.log('The output of row:  ' + outputData.AUTHOR);
            }
            return outputData;
        },
        (err) => {
            console.log('Error getting followRel');
            return {};
        }
    );

    return p;
}

function selectUserFeed(userid) {
    var p = new Promise((resolve, reject) => {
        db.serialize(() => {
            var command = 'SELECT * FROM tweets, followrel where followrel.LEADER = tweets.AUTHOR and followrel.FOLLOWER = ' + asMyQuote(userid) + ' ORDER BY tweets.TS DESC';

            console.log('About to run:  ' + command);
            db.all(command , (err, rows) => {
                if (err) {
                    reject(err);
                }

                console.log('Tweet feed lookup has ' + JSON.stringify(rows));
                resolve(rows);
            });
        });
    }).then(
        (data) => {
            var feedData = {};

            for (eachTweet of data) {
                // console.log(JSON.stringify(eachTweet));

                var aTweet = Object.create(tweet);

                aTweet.tid = eachTweet.TID;
                aTweet.author = eachTweet.AUTHOR;
                aTweet.message = eachTweet.MESSAGE;
                aTweet.ts = eachTweet.TS;

                // console.log(JSON.stringify(aTweet));

                feedData[aTweet.tid] = aTweet;
            }

            console.log(JSON.stringify(feedData));
            return feedData;
        }
    );

    return p;
}

function selectFollowed(leader) {
    var p;
    p = new Promise(function (resolve, reject) {
        db.serialize(function () {
            var qleader = asMyQuote(leader);
            var command = "SELECT * FROM followRel WHERE LEADER = " + qleader;
            db.all(command, function (err, row) {
                if (err) {
                    reject(err);
                }
                resolve(row);
            });
        });
    }).then(
        (rows) => {
            // Process them.
            var outputData = {};
            var count = 0;
            for (thisRow of rows) {
                var aFollow = Object.create(follow);

                aFollow.leader = thisRow.LEADER;
                aFollow.follower = thisRow.FOLLOWER;

                outputData[count] = aFollow;
                count++;
                console.log('The output of row:  ' + outputData.AUTHOR);
            }

            // console.log(outputData);
            return outputData;
        },
        (err) => {
            console.log('Error getting followRel');
            return {};
        }
        );
    return p;
}
// likeRel table functions
function insertLike(tweet, uid) {
    var p;
    p = new Promise(function (resolve, reject) {
        db.serialize(function () {
            var ts = asMyQuote(new Date());
            var quid = asMyQuote(uid);
            var values = tweet + ', ' + quid + ', ' + ts;
            var command = "INSERT INTO likeRel (TWEET_ID, UID, TS) VALUES (" + values + ")";
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
        }).then((data) => {
            var pkVal = selectLastPK('rowid', 'likeRel');
            pk1.then((pk) => { return pk; });

        });
    });
    return p;
}
function deleteLike(tweet, uid) {
    var p;
    p = new Promise(function (resolve, reject) {
        db.serialize(function () {
            var quid = asMyQuote(uid);
            var command = "DELETE * FROM likeRel WHERE TWEET_ID = " + tweet + " AND UID = " + quid;
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
    return p;
}
function selectILike(uid) {
    var p;
    p = new Promise(function (resolve, reject) {
        db.serialize(function () {
            var quid = asMyQuote(uid);
            var command = "SELECT * FROM likeRel WHERE UID = " + quid;
            db.all(command, function (err, row) {
                if (err) {
                    reject(err);
                }
                resolve(row);
            });
        });
    }).then(
        (rows) => {
            // Process them.
            var outputData = {};
            var count = 0;
            for (thisRow of rows) {
                var aLikedTweet = Object.create(likedTweet);

                aLikedTweet.tweetid = thisRow.TWEET_ID;
                aLikedTweet.userid = thisRow.UID;
                aLikedTweet.timeStamp = thisRow.TS;

                outputData[count] = aLikedTweet;
                count++;
            }
            return outputData;
        },
        (err) => {
            console.log('Error getting liked tweets');
            return {};
        }
        );
    return p;
}
function selectLikedBy(tweet) {
    var p;
    p = new Promise(function (resolve, reject) {
        db.serialize(function () {

            var command = "SELECT * FROM likeRel WHERE TWEET_ID = " + tweet;
            db.all(command, function (err, row) {
                if (err) {
                    reject(err);
                }
                resolve(row);
            });
        });
    }).then(
        (rows) => {
            // Process them.
            var outputData = {};
            var count = 0;
            for (thisRow of rows) {
                var aLikedTweet = Object.create(likedTweet);

                aLikedTweet.tweetid = thisRow.TWEET_ID;
                aLikedTweet.userid = thisRow.UID;
                aLikedTweet.timeStamp = thisRow.TS;

                outputData[count] = aLikedTweet;
                count++;
            }
            return outputData;
        },
        (err) => {
            console.log('Error getting liked tweets');
            return {};
        }
        );
    return p;
}

// JOIN functions
function selectTweetsLikedBy(uid) {
    var p = new Promise(function (resolve, reject) {
        var quid = asMyQuote(uid);
        var command = "SELECT * FROM likeRel, tweets WHERE likeRel.UID = " + quid + " AND  likeRel.TWEET_ID = tweets.TID";
        db.all(command, function (err, row) {
            if (err) {
                reject(err);
            }
            resolve(row);
        });

    }).then(
        (rows) => {
            // Process them.
            var outputData = {};
            var count = 0;
            for (thisRow of rows) {
                var aTweet = Object.create(tweet);
                aTweet.tid = thisRow.TID;
                aTweet.author = thisRow.AUTHOR;
                aTweet.message = thisRow.MESSAGE;
                aTweet.ts = thisRow.TS;

                outputData[count] = aTweet;
                console.log(outputData[count].author + ": " + outputData[count].message);
                count++;
            }
            return outputData;
        },
        (err) => {
            console.log('Error getting liked tweets');
            return {};
        });
    return p;
}
function selectWhoLikesTweet(tid) {
    var p = new Promise(function (resolve, reject) {
        var qtid = asMyQuote(tid);
        var command = "SELECT * FROM likeRel, users WHERE likeRel.TWEET_ID = " + qtid + " AND likeRel.UID = users.USERID";
        db.all(command, function (err, row) {
            if (err) {
                reject(err);
            }
            resolve(row);
        });

    }).then(
        (rows) => {
            // Process them.
            var outputData = {};
            var count = 0;
            for (thisRow of rows) {
                var aUser = Object.create(tweet);
                aUser.userid = thisRow.USERID;
                aUser.name = thisRow.NAME;
                aUser.password = thisRow.PASSWORD;
                aUser.profile = thisRow.PROFILE;

                outputData[count] = aUser;
                console.log(outputData[count].userid + ": " + outputData[count].name);
                count++;
            }
            return outputData;
        },
        (err) => {
            console.log('Error getting liked tweets');
            return {};
        });
    return p;
}

initDB(db);

function debugit() {
    var xuid = 1;
    console.log("add Users");
    var brian = Object.create(user);
    brian.name = 'brianR';
    brian.userid = 'brianr';
    brian.password = 'me';
    brian.profile = 'Ner do well';
    brian.primaryKey = -1;
    var p = insertUser(brian.name, brian.userid, brian.password, brian.profile);
    var pkr = selectLastPK('USERPK', 'users');
    pkr.then((val) => { 
            brian.primaryKey = val;
            console.log("USERPK = " + brian.primaryKey);
    });

    var bill = Object.create(user);
    bill.name = 'billr';
    bill.userid = 'billr';
    bill.password = 'meme';
    bill.profile = 'Surgeon';
    p = insertUser(bill.name, bill.userid, bill.password, bill.profile);
    pkr = selectLastPK('USERPK', 'users');
    pkr.then((val) => { 
            bill.primaryKey = val;
            console.log("USERPK = " + bill.primaryKey);
    });
    var lew = Object.create(user);
    lew.name = 'lewisE';
    lew.userid = 'lewisE';
    lew.password = 'mememe';
    lew.profile = 'Malcontent';
    p = insertUser(lew.name, lew.userid, lew.password, lew.profile);
    pkr = selectLastPK('USERPK', 'users');
    pkr.then((val) => { 
            lew.primaryKey = val;
            console.log("USERPK = " + lew.primaryKey);
    });
    var oprah = Object.create(user);
    oprah.name = 'oprah';
    oprah.userid = 'oprah';
    oprah.password = 'password';
    oprah.profile = 'egotist';
    p = insertUser(oprah.name, oprah.userid, oprah.password, oprah.profile);
    pkr = selectLastPK('USERPK', 'users');
    pkr.then((val) => { 
            oprah.primaryKey = val;
            console.log("USERPK = " + oprah.primaryKey);
    });

    console.log("display All Users");
    var ul = selectAllUsers();
    ul.then((outputData) => {
        var count = 0;
         for (count = 0; i < outputData.length; count++) {
            var user1 = outputData[count];
            console.log("User: " + user1.primaryKey + " NAME: " + user1.name + " UID: " + user1.userid);
        }
    });
    console.log("select single row");
    selectUser(3);
    console.log("add tweets");
    insertTweet(1, 'billr', "It cant be done");
    insertTweet(2, 'oprah', "It cant be done well");
    insertTweet(3, 'brianr', "It cant be done here");
    insertTweet(4, 'lewisE', "It cant be done today");
    insertTweet(5, 'oprah', "It cant be done anywhere");
    console.log("select for Users");
    selectTweetsFor('lewisE');
    selectTweetsFor('brianr');
    selectTweetsFor('oprah');
    console.log("select all tweets");
    selectAllTweets();

    updateUserName('billr', "Inigo Montoya");
    updateUserPwd('billr', "inconceivable");
    updateUserProfile('billr', "Butterflies and Rainbows");
    selectUser("billR");
    insertFollowing("billr", "oprah");
    insertFollowing("billr", "brianr");
    insertFollowing("billr", "lewisE");
    selectFollowed("billr");
    selectFollowed("brianr");
    selectFollowing("brianr");

    insertLike(1, "brianr");
    insertLike(1, "lewisE");
    selectILike("brianr");

    selectLikedBy(1);
    selectTweetsLikedBy("brianr");
    selectWhoLikesTweet(1);
    insertReply(1, "billr", "You are wrong");
    insertReply(1, "lewisE", "You are all wrong");
    insertReply(1, "oprah", "Dr Phil is a fake");
    insertReply(1, "billr", "Youre wrong");
    selectRepliesForTweet(1);
    selectRepliesForUser("billr");
    selectLastPK("REPID", "replies");

}
debugit();
