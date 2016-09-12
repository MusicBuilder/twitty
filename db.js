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

var tweet = {
    author: '',
    message: '',
    tid: '',
    ts: ''
};

var user = {
    userid: '',
    name: '',
    password: '',
    profile: ''
};

function initDB(db) {
    db.serialize(function () {

        db.run("DROP TABLE users", function (err) { if (err) { } }); //x
        db.run("CREATE TABLE users \
        (USERID TEXT PRIMARY KEY NOT NULL, \
        NAME TEXT NOT NULL, \
        PASSWORD TEXT NOT NULL, \
        PROFILE TEXT)", function (err) { if (err) { } });
    });
    db.serialize(function () {
        db.run("DROP TABLE tweets", function (err) { if (err) { } });
        db.run("CREATE TABLE tweets \
        (TID INTEGER PRIMARY KEY NOT NULL, \
        AUTHOR TEXT NOT NULL,\
        MESSAGE CHAR(140) NOT NULL,\
        TS TEXT NOT NULL)", function (err) { if (err) { } });
    });
    db.serialize(function () {

        db.run("DROP TABLE followRel", function (err) { if (err) { } }); //x
        db.run("CREATE TABLE followRel \
        (LEADER INT NOT NULL, \
        FOLLOWER INT NOT NULL)", function (err) { if (err) { } });
    });
    db.serialize(function () {

        db.run("DROP TABLE likeRel", function (err) { if (err) { } }); //x
        db.run("CREATE TABLE likeRel \
        (TWEET_ID INT NOT NULL, \
        UID INT NOT NULL, \
        TS TEXT NOT NULL)", function (err) { if (err) { } });
    });
}

function insertUser(uid, uname, pw, pro) 
{
    var p;
    p =  new Promise(function (resolve, reject) 
    {
        db.serialize(function (err) 
        {
            //     var key = selectNextUserKey() + 1;
            var values = asMyQuote(uid) + ', ' +  asMyQuote(uname) + ', ' + asMyQuote(pw) + ', ' + asMyQuote(pro);
            console.log("INSERTING: " +  values);
            var stmt = db.prepare("INSERT INTO users (USERID, NAME, PASSWORD, PROFILE) VALUES (" + values + ")");
            stmt.run();
            if (err) 
            {
                console.log(err);
                reject(err);
            }
            stmt.finalize();
            if (err) 
            {
                console.log(err);
                reject(err);
            }
            console.log(values);
            resolve();
        });
    });
    return p;
}
function asMyQuote(input)
{
    return '\'' + input + '\'';
}
function updateUser(uid, name, pw, pro) 
{
    var p;
    p =  new Promise(function (resolve, reject) 
    {
        var quid = asMyQuote(uid);
        var qName = asMyQuote(name);
        var qpwd = asMyQuote(pw);
        var qpro = asMyQuote(pro);
        db.serialize(function (err) 
        {
            var command = "UPDATE users SET NAME=" + qName + ", PASSWORD=" + qpwd +  ", PROFILE=" + qpro + " WHERE USERID=" + quid;
            var stmt = db.prepare(command);
            stmt.run();
            if (err) 
            {
                reject(err);
            }
            stmt.finalize();
            if (err) 
            {
                reject(err);
            }
            console.log(command);
            resolve();
        });
    });
    return p;
}
function updateUserName(uid, name) 
{
    var p;
    p =  new Promise(function (resolve, reject) 
    {
        var quid = asMyQuote(uid);
        var qName = asMyQuote(name);
        db.serialize(function (err) 
        {
            var command = "UPDATE users SET NAME=" + qName + " WHERE USERID=" + quid;
            var stmt = db.prepare(command);
            stmt.run();
            if (err) 
            {
                reject(err);
            }
            stmt.finalize();
            if (err) 
            {
                reject(err);
            }
            console.log(command);
            resolve();
        });
    });
    return p;
}
function updateUserPwd(uid, name) 
{
    var p;
    p =  new Promise(function (resolve, reject) 
    {
        var quid = asMyQuote(uid);
        var qName = asMyQuote(name);
        db.serialize(function (err) 
        {
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
function updateUserProfile(uid, name) 
{
    var p;
    p =  new Promise(function (resolve, reject) 
    {
        var quid = asMyQuote(uid);
        var qName = asMyQuote(name);
        db.serialize(function (err) 
        {
            var command = "UPDATE users SET PROFILE=" + qName + " WHERE USERID=" + quid;
            var stmt = db.prepare(command);
            stmt.run();
            if (err) 
            {
                reject(err);
            }
            stmt.finalize();
            if (err) 
            {
                reject(err);
            }
            console.log(command);
            resolve();
        });
    });
    return p;
}
function deleteUser(uid) 
{
    var p;
    p =  new Promise(function (resolve, reject) 
    {
        var quid = asMyQuote(uid);
        db.serialize(function (err) 
        {
            var command = "DELETE FROM users WHERE USERID = " + quid;
            var stmt = db.prepare(command);
            stmt.run();
            if (err) 
            {
                reject(err);
            }
            stmt.finalize();
            if (err) 
            {
                reject(err);
            }
            console.log(command);
            resolve();
        });
    });
    return p;
}
function selectAllUsers() 
{
    var allUsers = {};
    var p;

    p =  new Promise(function (resolve, reject) 
    {
        db.serialize(function (err) 
        {
            var command = "SELECT * FROM users";

            db.all(command, function (err, rows) 
            {
                if (err) 
                {
                    reject(err);
                    return;
                }
                
                console.log(rows);
                resolve(rows);
           });

        });
    }).then(
        (rows) => {
<<<<<<< HEAD
            // Process them.
            var outputData = {};
            var count = 0;
            for (thisROW of rows) {
                var aUser = Object.create(user);

                aUser.userid = thisROW.USERID;
                aUser.name = thisROW.NAME;
                aUser.password = thisROW.PASSWORD;
                aUser.profile = thisROW.PROFILE;
                outputData[count] = aUser;
                console.log('The output of row:  ' + outputData.count);
            }

            // console.log(outputData);       
            return outputData;
        },
        (err) => {
            console.log('Error getting users');
            return {};
        }
    );
=======

            for (row of rows) {
                var aUser = Object.create(user);

                aUser.userid = row.USERID;
                aUser.name = row.NAME;
                aUser.password = row.PASSWORD;
                aUser.profile = row.PROFILE;

                allUsers[aUser.userid] = aUser;
            }

            return allUsers;
        },
        (err) => {
            return {};
        }
    );

>>>>>>> 9ea6c2f623e0b999e161bc2aed3b6070f9580b16
    return p;
}
function selectUser(uid) 
{
    var p;
    p =  new Promise(function (resolve, reject) 
    {
        var quid = asMyQuote(uid);
        db.serialize(function (err) 
        {
            var count = 0;
            var command = "SELECT * FROM users WHERE USERID = " + quid;
            db.each(command, function (err, row) 
            {
                if (err)
                {
                    reject(err);
                }
                console.log(command);
                resolve(row);
            });
        });
    }).then(
<<<<<<< HEAD
        (rows) => {
            // Process them.
            var outputData = {};
            var count = 0;
            for (thisROW of rows) {
                var aUser = Object.create(user);

                aUser.userid = thisROW.USERID;
                aUser.name = thisROW.NAME;
                aUser.password = thisROW.PASSWORD;
                aUser.profile = thisROW.PROFILE;

                outputData[count] = aUser;
                console.log('The output of row:  ' + outputData.count);
            }

            // console.log(outputData);       
            return outputData;
        },
        (err) => {
            console.log('Error getting users');
=======
        (user) => {
            // Process single user.
            var aUser = Object.create(user);
            aUser.userid = user.USERID
            aUser.name = user.NAME;
            aUser.password = user.PASSWORD;
            aUser.profile = user.PROFILE;
       
            return aUser;
        },
        (err) => {
            console.log('Error getting user');
>>>>>>> 9ea6c2f623e0b999e161bc2aed3b6070f9580b16
            return {};
        }
    );

    return p;

}
function insertTweet(tid, uid, msg) 
{
    var p;
    p =  new Promise(function (resolve, reject) 
    {
       var quid = asMyQuote(uid);
       var qmsg = asMyQuote(msg);

       db.serialize(function (err) 
        {
            var ts = asMyQuote(new Date());
            var values = tid + ', ' + quid + ',' + qmsg + ', ' + ts;
            var stmt = db.prepare("INSERT INTO tweets (TID, AUTHOR,MESSAGE,TS) VALUES (" + values + ")");
            stmt.run();
            if (err) 
            {
                reject(err);
            }
            stmt.finalize();
            if (err) 
            {
                reject(err);
            }
            console.log(values);
            resolve();
        });
    });
    return p;
}
function insertAltTweet(tid, uid, msg) 
{
    var p;
    p =  new Promise(function (resolve, reject) 
    {
       var quid = asMyQuote(uid);
       var qmsg = asMyQuote(msg);

       db.serialize(function (err) 
        {
            var ts = asMyQuote(new Date());
            var values = tid + ', ' + quid + ',' + qmsg + ', ' + ts;
            var stmt = db.prepare("INSERT INTO tweets (TID, AUTHOR,MESSAGE,TS) VALUES (" + values + ")");
            stmt.run();
            if (err) 
            {
                reject(err);
            }
            stmt.finalize();
            if (err) 
            {
                reject(err);
            }
            console.log(values);
            resolve();
        });
    });
    return p;
}
function updateTweet(tid, message) 
{
    var p;
    p =  new Promise(function (resolve, reject) 
    {
        db.serialize(function (err) 
        {
            var ts = asMyQuote(new Date());
            var command = "UPDATE tweets SET MESSAGE=\'" + message + "\' WHERE TID=" + tid;
            var stmt = db.prepare(command);
            stmt.run();
            if (err) 
            {
                reject(err);
            }
            stmt.finalize();
            if (err) 
            {
                reject(err);
            }
            console.log(command);
            resolve();
        });
    });
    return p;
}
function deleteTweet(tid) 
{
    var p;
    p =  new Promise(function (resolve, reject) 
    {
        db.serialize(function (err) 
        {
            var command = "DELETE FROM tweets WHERE TID=" + tid;
            var stmt = db.prepare(command);
            stmt.run();
            if (err) 
            {
                reject(err);
            }
            stmt.finalize();
            if (err) 
            {
                reject(err);
            }
            console.log(command);
            resolve();
        });
    });
    return p;
}
function selectAllTweets() 
{
    var p;
    p =  new Promise(function (resolve, reject) 
    {
        db.serialize(function (err) 
        {
            var command = "SELECT * FROM tweets";
            db.all(command, function (err, row) 
            {
                if (err) 
                {
                    reject(err);
                }
            console.log(command);
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

            // console.log(outputData);       
            return outputData;
        },
        (err) => {
            console.log('Error getting tweets');
            return {};
        }
    );
    return p;
}
function selectTweetsFor(uid) 
{
    var p;
    p =  new Promise(function (resolve, reject) 
    {
        var quid = asMyQuote(uid);
        db.serialize(function (err) 
        {
            var command = "SELECT * FROM tweets WHERE AUTHOR=" + quid;
            db.all(command, function (err, row) 
            {
                if (err) 
                {
                    reject(err);
                }
                console.log(command);
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

            // console.log(outputData);       
            return outputData;
        },
        (err) => {
            console.log('Error getting tweets');
            return {};
        }
    );
    return p;
}

function insertFollowing(lead, follow) 
{
    var p;
    p =  new Promise(function (resolve, reject) 
    {
        var qlead = asMyQuote(lead);
        var qfollow = asMyQuote(follow);
        db.serialize(function (err) 
        {

            var values = qlead + ', ' + qfollow;
            var command ="INSERT INTO followRel (LEADER, FOLLOWER) VALUES (" + values + ")";
            var stmt = db.prepare(command);
            stmt.run();
            if (err) 
            {
                reject(err);
            }
            stmt.finalize();
            if (err) 
            {
                reject(err);
            }
            console.log(command);
            resolve();
        });
    });
    return p;
}
function deleteFollowing(lead, follow) 
{
    var p;
    p =  new Promise(function (resolve, reject) 
    {
        var qload = asMyQuote(lead);
        var qfollow = asMyQuote(follow);
        db.serialize(function (err) 
        {
            var command = "DELETE FROM followRel WHERE LEADER = " + qlead + " AND FOLLOWER = " + qfollow;
            var stmt = db.prepare(command);
            stmt.run();
            if (err) 
            {
                reject(err);
            }
            stmt.finalize();
            if (err) 
            {
                reject(err);
            }
            console.log(command);
            resolve();
        });
    });
    return p;
}
function selectFollowing(follow) 
{
    var p;
    p =  new Promise(function (resolve, reject) 
    {
        var qfollow = asMyQuote(follow);
        db.serialize(function (err) 
        {
            var command = "SELECT * FROM followRel WHERE FOLLOWER = " + qfollow;
            db.all(command, function (err, row) 
            {
                if (err) {
                    reject(err);
                }
                console.log(command);
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
function selectFollowed(leader) 
{
    var p;
    p =  new Promise(function (resolve, reject) 
    {
        var qleader = asMyQuote(leader);
        db.serialize(function (err) 
        {
            var command = "SELECT * FROM followRel WHERE LEADER = " + qleader;
            db.all(command, function (err, row) 
            {
                if (err) 
                {
                    reject(err);
                }
                console.log(command);
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
function insertLike(tweet, uid) 
{
    var p;
    p =  new Promise(function (resolve, reject) 
    {
        var ts = asMyQuote(new Date());
        var quid = asMyQuote(uid);
        db.serialize(function (err) 
        {
            var values = tweet + ', ' + quid + ', ' + ts;
            var command = "INSERT INTO likeRel (TWEET_ID, UID, TS) VALUES (" + values + ")";
            var stmt = db.prepare(command);
            stmt.run();
            if (err) 
            {
                reject(err);
            }
            stmt.finalize();
            if (err) 
            {
                reject(err);
            }
            console.log(command);
            resolve();
        });
    });
    return p;
}
function deleteLike(tweet, uid) 
{
    var p;
    p =  new Promise(function (resolve, reject) 
    {
        var quid = asMyQuote(uid);
        db.serialize(function (err) 
        {
            var command = "DELETE * FROM likeRel WHERE TWEET_ID = " + tweet + " AND UID = " + quid;
            var stmt = db.prepare(command);
            stmt.run();
            if (err) 
            {
                reject(err);
            }
            stmt.finalize();
            if (err) 
            {
                reject(err);
            }
            console.log(command);
            resolve();
        });
    });
    return p;
}
function selectILike(uid) 
{
    var p;
    p = new Promise(function (resolve, reject) 
    {
        var quid = asMyQuote(uid);
        db.serialize(function (err) 
        {
            var command = "SELECT * FROM likeRel WHERE UID = " + quid;
            db.all(command, function (err, row) 
            {
                if (err) 
                {
                    reject(err);
                }
                console.log(command);
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
               // console.log('The output of row:  ' + outputData.AUTHOR);
            }

            // console.log(outputData);       
            return outputData;
        },
        (err) => {
            console.log('Error getting liked tweets');
            return {};
        }
    );
    return p;
}
function selectLikedBy(tweet) 
{
    var p;
    p = new Promise(function (resolve, reject) 
    {
        db.serialize(function (err) 
        {
            var command = "SELECT * FROM likeRel WHERE TWEET_ID = " + tweet;
            db.all(command, function (err, row) 
            {
                if (err) 
                {
                    reject(err);
                }
                console.log(command);
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
               // console.log('The output of row:  ' + outputData.AUTHOR);
            }

            // console.log(outputData);       
            return outputData;
        },
        (err) => {
            console.log('Error getting liked tweets');
            return {};
        }
    );
    return p;
}
initDB(db);

function debugit() {
    var xuid = 1;
    console.log("add Users");
    insertUser('brianr','brianR','me','');
    insertUser('billr','billr','meme','');
    insertUser('lewisE','mememe','');
    insertUser('oprah','oprah','password','');
    console.log("display Users");
   
    selectAllUsers();
    console.log("select single row");
    selectUser(3);
    console.log("add tweets");
    insertTweet(1,'billr', "It cant be done");
    insertTweet(2,'oprah', "It cant be done well");
    insertTweet(3,'brianr', "It cant be done here");
    insertTweet(4,'lewisE', "It cant be done today");
    insertTweet(5,'oprah', "It cant be done anywhere");
    console.log("select for Users");
    selectTweetsFor('lewisE');
    selectTweetsFor('brianr');
    selectTweetsFor('oprah');
    console.log("select all tweets");
    selectAllTweets();
    console.log("delete tweet 2");
    deleteTweet(2)
    selectAllTweets();
    console.log("update a User");
    updateUserName('billr', "Inigo Montoya");
    updateUserPwd('billr', "inconceivable");
    updateUserProfile('billr', "Butterflies and Rainbows");
    selectUser("billR");
    insertFollowing("billr","oprah");
    insertFollowing("billr","brianr");
    insertFollowing("billr","lewisE");
    selectFollowed("billr");
    selectFollowed("brianr");
    selectFollowing("brianr");
    console.log("delete User 1");
    selectAllUsers();
    insertLike(1,"brianr");
    insertLike(1,"lewisE");
    selectILike("brianr");
    
    selectLikedBy(1);
}
debugit();