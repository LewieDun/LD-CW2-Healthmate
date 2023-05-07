const Datastore = require("nedb");
const bcrypt = require("bcrypt");
const saltRounds = 10;

class UserDAO {
  constructor(dbFilePath) {
    if (dbFilePath) {
      //embedded
      console.log(dbFilePath);
      this.db = new Datastore({ filename: dbFilePath, autoload: true });
    } else {
      //in memory
      console.log("No file path");
      this.db = new Datastore();
    }
  }

  init() {
    // Set the username for the user we're looking for
    let myUser = "Lewie";

    // Return a new Promise to handle the async DB call
    return new Promise((resolve, reject) => {
      // Query the DB for entries with user = myUser
      this.db.find({ user: myUser }, (err, entries) => {
        if (err) {
          // Reject the Promise if an error occurs
          reject(err);
        } else if (entries != null && entries.some((e) => e.user === myUser)) {
          // If the user already exists, log a message and resolve the Promise
          console.log("User Already Inserted");
          console.log(entries);
          resolve(this);
        } else {
          // If the user doesn't exist, insert a new entry into the DB
          this.db.insert(
            {
              firstname: "Lewie",
              lastname: "Duncan",
              user: "Lewie",
              password:
                "$2a$12$b6Uu6KWKxSHm95lxsLmy7uxMI.BwI0te2tLye7NQRNQMpctTH5fnG",
            },
            (err) => {
              if (err) {
                // Reject the Promise if an error occurs
                reject(err);
              } else {
                // Log a message and resolve the Promise if the insert was successful
                console.log("User insert Done");
                resolve(this);
              }
            }
          );
        }
      });
    });
  }

  create(firstname, lastname, username, password) {
    const that = this;
    // Hash the password before inserting into the database
    bcrypt.hash(password, saltRounds).then(function (hash) {
      var entry = {
        firstname: firstname,
        lastname: lastname,
        user: username,
        password: hash,
      };
      // Insert the user record into the database
      that.db.insert(entry, function (err) {
        if (err) {
          console.log("Can't insert user: ", username);
        }
      });
    });
  }

  lookup(user, cb) {
    this.db.find({ user: user }, function (err, entries) {
      if (err) {
        return cb(null, null);
      } else {
        if (entries.length == 0) {
          return cb(null, null);
        }
        return cb(null, entries[0]);
      }
    });
  }
}

const dao = new UserDAO("user-database.db"); // Path for database
dao
  .init()
  .then((result) => {
    console.log("Init completed:", result); // print the result of init
  })
  .catch((err) => {
    console.error("Init failed:", err); // otherwise print the error
  });

module.exports = dao;
