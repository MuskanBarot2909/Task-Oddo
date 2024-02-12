

const express = require('express');
const webController = require('../controllers/webController');
const router = express.Router();

router.get('/', webController.index);
router.get('/search/:query', webController.search);
router.get('/view/:id', webController.view);
router.post('/joinCourse/:id', webController.joinCourse);
router.post('/giveRate', webController.giveRate);
router.get('/courses', webController.getAllCourses);
router.post('/giveRate/:id', webController.giveRate);
router.get('/generateSession', webController.generateSession);
router.post('/logout', webController.logout);
router.get('/checkLoggedIn', webController.checkLoggedIn);
module.exports = router;
