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

  // for the demo the password is the bcrypt of the user name
  init() {
    let myUser = "Lewie";
    return new Promise((resolve, reject) => {
      this.db.find({ user: myUser }, (err, entries) => {
        if (err) {
          reject(err);
        } else if (entries != null && entries.some(e => e.user === myUser)) {
          console.log("User Already Inserted");
          console.log(entries)
          resolve(this);
        } else {
          this.db.insert({
            firstname: "Lewie",
            lastname: "Duncan",
            user: "Lewie",
            password:"$2a$12$b6Uu6KWKxSHm95lxsLmy7uxMI.BwI0te2tLye7NQRNQMpctTH5fnG",
          }, (err) => {
            if (err) {
              reject(err);
            } else {
              console.log("User insert Done");
              resolve(this);
            }
          });
        }
      });
    });
  }

  create(firstname, lastname, username, password) {
    const that = this;
    bcrypt.hash(password, saltRounds).then(function (hash) {
      var entry = {
        firstname: firstname,
        lastname: lastname,
        user: username,
        password: hash,
      };
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
const dao = new UserDAO("user-database.db");
dao.init().then((result) => {
    console.log("Init completed:", result);
  }).catch((err) => {
    console.error("Init failed:", err);
  });

module.exports = dao;
