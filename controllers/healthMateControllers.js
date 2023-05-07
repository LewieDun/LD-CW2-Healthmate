const aspirations = require("../models/aspirationsModel.js");
const errorCheck = 'Please Input All Values Below';

exports.home_page = function (req, res) {
    res.render("user/home");
  };

exports.LoggedIn_home_page = function (req, res) {
    res.render("user/home", {
      loggedIn: true,
      title: req.username,
    });
  };

exports.info = function (req, res) {
    res.render("user/info");
  };

exports.LoggedIn_info = function (req, res) {
    res.render("user/info", {
      loggedIn: true,
    });
  };

exports.show_login = function (req, res) {
    res.render("user/login");
  };

exports.handle_login = function (req, res) {
    res.render("user/home", {
      loggedIn: true,
      title: req.body.username,
    });
  };

exports.show_register = function (req, res) {
    res.render("user/register") ;    
  };
  
exports.handle_register = function (req, res) {
  res.render("user/login");
};

exports.loggedIn_fitness = async function (req, res) {
  const category = 'fitness'
  try {
    const inprogressAspirations = await aspirations.getAspirationsForUser(req.username, category);
    const achievedAspirations = await aspirations.getAchievedAspirationsForUser(req.username, category);
    res.render('user/fitness', { inprogressAspirations, achievedAspirations, loggedIn: true });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

exports.loggedIn_lifestyle = async function (req, res) {
  const category = 'lifestyle'
  try {
    const inprogressAspirations = await aspirations.getAspirationsForUser(req.username, category);
    const achievedAspirations = await aspirations.getAchievedAspirationsForUser(req.username, category);
    res.render('user/lifestyle', { inprogressAspirations, achievedAspirations, loggedIn: true });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};


exports.loggedIn_nutrition = async function (req, res) {
  const category = 'nutrition'
  try {
    const inprogressAspirations = await aspirations.getAspirationsForUser(req.username, category);
    const achievedAspirations = await aspirations.getAchievedAspirationsForUser(req.username, category);
    res.render('user/nutrition', { inprogressAspirations, achievedAspirations, loggedIn: true });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

exports.show_editGoal = async function (req, res) {
  const id = req.query.id;
  const record = await aspirations.findById(id)

  let title = record.title;
  const category = record.category;
  let description = record.description;

  res.render("user/editGoal", { 
    id: id,
    title: title,
    category: category,
    description: description,
   });
};

exports.show_goalCreator = function (req, res) {
  res.render("user/goalCreator", { loggedIn: true });
}; 

exports.add = function (req, res) {
  res.render("user/goalCreator", { loggedIn: true });
}; 

exports.add_goal  = async function (req, res) {
  const username = req.username;
  let title = req.body.title;
  const category = req.body.category;
  let description = req.body.desc;
  const start_date = req.body.start_date;
  const end_date = req.body.end_date;

  title = title.substring(0, 1).toUpperCase() + title.substring(1);
  category.toLowerCase();
  description = description.substring(0, 1).toUpperCase() + description.substring(1);

  if (title === '' || category === '' || description === '' || start_date === '' || end_date === '') {
    res.render("user/goalCreator", { 
      warning: errorCheck,
      loggedIn: true
    }); 
  } else {
    try {
      await aspirations.addRecord(username, title, category, description, start_date, end_date, false, '', '1/1/1999', 0 );
      res.redirect(`${category}`);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  }
};

exports.delete_goal  = async function (req, res) {
  const id = req.params.id;
  const record = await aspirations.findById(id)
  aspirations.delete(record);
  res.sendStatus(200);
}

exports.update_goal  = async function (req, res) {
  const id = req.body.id;
  const record = await aspirations.findById(id)

  record.title = req.body.title;
  record.category = req.body.category;
  record.description = req.body.desc;
  record.start_date = req.body.start_date;
  record.end_date = req.body.end_date;

  if (record.title === '' || record.category === '' || record.description === '' || record.start_date === '' || record.end_date === '') {  
    res.render("user/editGoal", { 
      warning: errorCheck,
      id: id,
      loggedIn: true
    }); 
  } else {
    try {
      await aspirations.save(record);
      console.log('record -- ', record.category);
      res.redirect(`${record.category}`);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  }
};

module.exports.update_aspirations = async function (req, res) {
  const id = req.params.id;
  try {
    const aspiration = await aspirations.findById(id);
    const date = new Date();

    if (aspiration.completed) {
      aspiration.completed = false;
    }
    else {
      aspiration.completed = true;
      aspiration.completed_date = date.toLocaleDateString();
      aspiration.repetitions = parseInt(aspiration.repetitions) + 1; 
    }  
    const updatedAspiration = await aspirations.save(aspiration);
    console.log('updatedAspiration', updatedAspiration);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

exports.logout = function (req, res) {
  console.log('logged out')
  res.clearCookie("jwt").status(200).redirect("/");
};