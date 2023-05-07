const Datastore = require("nedb");

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

  init() {
    return new Promise((resolve, reject) => {
      this.db.count({}, (err, count) => {
        if (err) {
          reject(err);
        } else if (count > 0) {
          console.log("Pre-Loaded Data Already Inserted");
          resolve(this);
        } else {
          this.db.insert(
            {
              username: "Lewie",
              title: "Gym x3 A Week",
              category: "fitness",
              description: "My goal is to go the gym x3 a week!",
              start_date: "01/05/23",
              end_date: "28/05/23",
              completed: false,
              completed_date: "",
              repetitions: 0,
            },
            (err) => {
              if (err) {
                reject(err);
              } else {
                console.log("Fitness Goal insert Done");
              }
            }
          );
          this.db.insert(
            {
              username: "Lewie",
              title: "Limit Screen Time",
              category: "lifestyle",
              description: "Limit Screen time to no more than 2 hours a day!",
              start_date: "10/05/23",
              end_date: "17/05/23",
              completed: false,
              completed_date: "",
              repetitions: 0,
            },
            (err) => {
              if (err) {
                reject(err);
              } else {
                console.log("Health Goal insert Done");
              }
            }
          );
          this.db.insert(
            {
              username: "Lewie",
              title: "5 A Day",
              category: "nutrition",
              description: "Make sure to eat my 5 day of fruit and veg",
              start_date: "03/05/23",
              end_date: "26/05/23",
              completed: false,
              completed_date: "",
              repetitions: 0,
            },
            (err) => {
              if (err) {
                reject(err);
              } else {
                console.log("Nutrition Goal insert Done");
                resolve(this);
              }
            }
          );
        }
      });
    });
  }

  addRecord(
    username,
    title,
    category,
    description,
    start_date,
    end_date,
    completed,
    completed_date
  ) {
    const that = this;
    var entry = {
      username: username,
      title: title,
      category: category,
      description: description,
      start_date: start_date,
      end_date: end_date,
      completed: completed,
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

  // Returns a Promise that resolves to a list of achieved aspirations for a given user and category
  getAchievedAspirationsForUser(username, category) {
    return new Promise((resolve, reject) => {
      // Query the database for aspirations that match the provided username, category, and have been completed
      this.db.find(
        { username: username, completed: true, category: category },
        (err, docs) => {
          // If there's an error, reject the Promise with the error
          if (err) {
            reject(err);
          } else {
            // If successful, resolve the Promise with the list of matching aspirations
            resolve(docs);
          }
        }
      );
    });
  }

  // Returns a promise that resolves with a list of aspirations for the given user and category that have not been completed
  getAspirationsForUser(username, category) {
    return new Promise((resolve, reject) => {
      // Find all documents in the database that match the given criteria
      this.db.find(
        { username: username, completed: false, category: category },
        (err, docs) => {
          if (err) {
            // If there is an error, reject the promise with the error
            reject(err);
          } else {
            // If there is no error, resolve the promise with the documents found
            resolve(docs);
          }
        }
      );
    });
  }

  findById(id) {
    // Return a new Promise
    return new Promise((resolve, reject) => {
      // Call the "find" method on "this.db" with an object containing the "_id" property set to "id"
      // Also provide a callback function which will be called once the query has finished executing
      this.db.find({ _id: id }, (err, docs) => {
        // If an error occurred, reject the promise with the error object
        if (err) {
          reject(err);
        } else {
          // If no error occurred, check if any documents were found
          if (docs.length === 0) {
            // If no documents were found, log a message to the console
            console.log(`No records found matching Id ${id}`);
          } else {
            // If at least one document was found, resolve the promise with the first document in the array
            resolve(docs[0]);
          }
        }
      });
    });
  }

  async updateRecord(aspiration) {
    return new Promise((resolve, reject) => {
      // Update the record with the given aspiration ID
      this.db.update({ _id: aspiration._id }, { $set: aspiration }, (err) => {
        if (err) {
          reject(err);
        } else {
          // Reload the database and resolve the updated aspiration
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
}

const dao = new Aspirations("aspirations-database.db"); // set db path
dao
  .init()
  .then((result) => {
    console.log("Init completed:", result); // print the result of init
  })
  .catch((err) => {
    console.error("Init failed:", err); // otherwise print the error
  });

module.exports = dao;
