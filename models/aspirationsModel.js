const Datastore = require("nedb");
const { isEmpty } = require("underscore");

class Aspirations {
  constructor(dbFilePath) {
    if (dbFilePath) {
      //embedded
      console.log(dbFilePath);
      this.db = new Datastore({ filename: dbFilePath, autoload: true });
    } else {
      //in memory
      console.log("No file path - asp");
      this.db = new Datastore();
    }
  }

  // for the demo the password is the bcrypt of the user name
  init() {
    return new Promise((resolve, reject) => {
      this.db.count({}, (err, count) => {
        if (err) {
          reject(err);
        } else if (count > 0) {
          console.log("Pre-Loaded Data Already Inserted");
          resolve(this);
        } else {
          this.db.insert({
            username: "Lewie",
            title: "Gym x3 A Week",
            category: "fitness",
            description:"My goal is to go the gym x3 a week!",
            start_date: '01/05/23',
            end_date: '28/05/23',
            completed: false,
            notes: '',
            completed_date: '',
            repetitions: 0,
          }, (err) => {
            if (err) {
              reject(err);
            } else {
              console.log("Fitness Goal insert Done");
            }
          });
          this.db.insert({
            username: "Lewie",
            title: "Limit Screen Time",
            category: "lifestyle",
            description:"Limit Screen time to no more than 2 hours a day!",
            start_date: '10/05/23',
            end_date: '17/05/23',
            completed: false,
            notes: '',
            completed_date: '',
            repetitions: 0,
          }, (err) => {
            if (err) {
              reject(err);
            } else {
              console.log("Health Goal insert Done");
            }
          });
          this.db.insert({
            username: "Lewie",
            title: "5 A Day",
            category: "nutrition",
            description:"Make sure to eat my 5 day of fruit and veg",
            start_date: '03/05/23',
            end_date: '26/05/23',
            completed: false,
            notes: '',
            completed_date: '',
            repetitions: 0,
          }, (err) => {
            if (err) {
              reject(err);
            } else {
              console.log("Nutrition Goal insert Done");
              resolve(this);
            }
          });
        }
      });
    });
  }

  addRecord(username, title, category, description, start_date, end_date, completed, notes, completed_date, repetitions) {

    const that = this;
    var entry = {
    username: username,
    title: title,
    category: category,
    description: description,
    start_date: start_date,
    end_date: end_date,
    completed: completed,
    notes: notes,
    completed_date: completed_date,
    repetitions: 0,
  };

    return new Promise((resolve, reject) => {
      that.db.insert(entry, function (err) {
        if (err) {
          reject(err);
        } else {
          if (entry.length === 0) {
            console.log(`No entry added`);
          } else {
            resolve(entry[0]); // return the first item in the array
          }
        }
      });
    });
  }

  getAchievedAspirationsForUser(username, category) {
    return new Promise((resolve, reject) => {
      this.db.find({ username: username, completed: true, category: category }, (err, docs) => {
        if (err) {
          reject(err);
        } else {
          resolve(docs);
        }
      });
    });
    }  

  getAspirationsForUser(username, category) {
  return new Promise((resolve, reject) => {
    this.db.find({ username: username, completed: false, category: category }, (err, docs) => {
      if (err) {
        reject(err);
      } else {
        resolve(docs);
      }
    });
  });
  }

  findById(id) {
    return new Promise((resolve, reject) => {
      this.db.find({ _id: id }, (err, docs) => {
        if (err) {
          reject(err);
        } else {
          if (docs.length === 0) {
            console.log(`No records found matching Id ${id}`);
          } else {
            resolve(docs[0]); // return the first item in the array
          }
        }
      });
    });
  }

  async save(aspiration) {
    return new Promise((resolve, reject) => {
      this.db.update({ _id: aspiration._id }, { $set: aspiration }, (err) => {
        if (err) {
          reject(err);
        } else {
          this.db.loadDatabase();
          resolve(aspiration);
        }
      });
    });
  }

  async delete(aspiration) {
      const deletedAspiration = await this.db.remove({ _id: aspiration._id }, {});
      this.db.loadDatabase();
  }

  async updateRecord(aspiration) {
    return new Promise((resolve, reject) => {
      this.db.update({ _id: aspiration._id }, { $set: aspiration }, (err) => {
        if (err) {
          reject(err);
        } else {
          this.db.loadDatabase();
          resolve(aspiration);
        }
      });
    });
  }
  
}

const dao = new Aspirations("aspirations-database.db");
dao.init().then((result) => {
    console.log("Init completed:", result);
  }).catch((err) => {
    console.error("Init failed:", err);
  });

module.exports = dao;