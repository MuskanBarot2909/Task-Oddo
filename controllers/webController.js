// app/controllers/webController.js


const Session = require('../models/session');
const Course = require('../models/course');
const CourseMembers = require('../models/courseMembers');
const Tag = require('../models/tags');
const CourseRating = require('../models/courseRating');

const generateAccessToken = () => {
  // Logic to generate a new access token (customize according to your requirements)
  const randomToken = Math.random().toString(36).substr(2);
  return randomToken;
};

const webController = {

  index: async (req, res) => {
    try {
      // Force the generation of a new access token
      const accessToken = generateAccessToken();
  
      // Save the access token to the user's session
      req.session.accessToken = accessToken;
  
      // Print the access token to the console
      console.log('Generated Access Token:', accessToken);
  
      // Save the access token to the session collection in the database
      await Session.create({ accessToken });
  
      // Print the session object
      console.log('Session:', req.session);
  
      // Continue with your existing code
      res.sendFile('index.html', { root: 'views' });
    } catch (error) {
      console.error('Error in index:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  

  generateSession: async (req, res) => {
    try {
      // Generate a random access token
      const accessToken = generateAccessToken();

      // Save the access token to the user's session
      req.session.accessToken = accessToken;

      // Print the access token to the console
      console.log('Generated Access Token:', accessToken);

      // Print the session object
      console.log('Session:', req.session);

      // Save the access token to the session collection in the database
      await Session.create({ accessToken });

      res.json({ message: 'Session generated successfully.' });
    } catch (error) {
      console.error('Error in generateSession:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  // index: async (req, res) => {
  //   try {
  //     // Generate a random access token
  //     console.log('Entering index function');
  //     const accessToken = generateAccessToken();
  
  //     // Save the access token to the user's session
  //     req.session.accessToken = accessToken;
  
  //     // Print the access token to the console
  //     console.log('Generated Access Token:', accessToken);
  
  //     // Print the session object
  //     console.log('Session:', req.session);
  
  //     // Save the access token to the session collection in the database
  //     await Session.create({ accessToken });
  
  //     // Send the HTML file as the response
  //     res.sendFile('index.html', { root: 'views' });
  //   } catch (error) {
  //     console.error('Error in index:', error);
  //     res.status(500).json({ error: 'Internal Server Error' });
  //   }
  // },


  search: async (req, res) => {
    try {
      const { query } = req.params;
  
      // Search for courses with a title, description, or tags matching the query
      const courses = await Course.find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          {
            tags: {
              $in: await Tag.find({ name: { $regex: query, $options: 'i' } }).select('_id'),
            },
          },
        ],
      }).populate('tags');
  
      res.json(courses);
    } catch (error) {
      console.error('Error in search:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  

  view: async (req, res) => {
    try {
      const courseId = req.params.id;
      const course = await Course.findById(courseId).populate('tags');
      const enrolledStudents = await CourseMembers.countDocuments({ courseId });
      const courseDuration = course ? course.duration : null;
      res.json({ course, enrolledStudents, courseDuration });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  giveRate: async (req, res) => {
    try {
        const { courseId, userId, rating } = req.body;
        console.log('Received data:', { courseId, userId, rating });

        // Attempt to save the rating
        const savedRating = await CourseRating.create({ courseId, userId, rating });
        console.log('Saved Rating:', savedRating);

        res.json({ message: 'Rating submitted successfully.' });
    } catch (error) {
        console.error('Error in giveRate:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
},



  getAllCourses: async (req, res) => {
    try {
      const courses = await Course.find().populate('tags');
      res.json(courses);
    } catch (error) {
      console.error('Error in getAllCourses:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  joinCourse: async (req, res) => {
    try {
      const courseId = req.params.id;

      // Find the course and update the enrolledStudents count
      const updatedCourse = await Course.findByIdAndUpdate(
        courseId,
        { $inc: { enrolledStudents: 1 }, lastActivity: new Date() },
        { new: true }
      ).populate('tags');

      // Respond with the updated course data
      res.json(updatedCourse);
    } catch (error) {
      console.error('Error joining course:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  logout: async (req, res) => {
    try {
        // Check if the access token is present in the session
        if (req.session.accessToken) {
            // Delete the session from the database
            await Session.deleteOne({ accessToken: req.session.accessToken });

            // Destroy the session
            req.session.destroy();

            res.json({ message: 'Logout successful.' });
        } else {
            res.status(400).json({ error: 'No active session to logout.' });
        }
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
},

checkLoggedIn: async (req, res) => {
  try {
      // Check if the access token is present in the session
      const loggedIn = !!req.session.accessToken;

      res.json({ loggedIn });
  } catch (error) {
      console.error('Error checking login status:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
},
};

module.exports = webController;
