const express = require('express');
const router = express.Router();
const controller = require('../controllers/healthMateControllers.js');
const {login} = require('../auth/auth')
const {verify} = require('../auth/auth')
const {create} = require('../auth/auth')



router.get("/", controller.home_page);
router.get("/home", verify, controller.LoggedIn_home_page);

router.get("/info", controller.info);
router.get("/information", verify, controller.LoggedIn_info);


router.get("/login", controller.show_login);
router.post('/login', login, controller.handle_login);

router.get("/register", controller.show_register);
router.post("/register", create, controller.handle_register);

router.get("/fitness", verify, controller.loggedIn_fitness);
router.get("/lifestyle", verify, controller.loggedIn_lifestyle);
router.get("/nutrition", verify, controller.loggedIn_nutrition);

router.patch('/update/:id', verify, controller.update_aspirations);


router.get("/goalCreator", verify, controller.show_goalCreator);
router.post("/goalCreator", verify, controller.add_goal);

router.get('/editGoal', verify, controller.show_editGoal);
router.post('/editGoal', verify, controller.update_goal);
router.delete('/deleteGoal/:id', verify, controller.delete_goal);

router.get("/logout", controller.logout);

router.use(function(req, res) {
    res.status(404);
    res.type('text/plain');
    res.send('404 Not found.');
});

router.use(function(err, req, res, next) {
    res.status(500);
    res.type('text/plain');
    res.send('Internal Server Error.');
});

module.exports = router;