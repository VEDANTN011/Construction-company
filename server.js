 const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_secret_key'; // Ideally store in .env file



const User = require('./models/User');
const Post = require('./models/Post');
const Application = require('./models/Application')

const app = express();
const saltRounds = 10;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// 🔗 Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/construction')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// ✅ Registration endpoint
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existing = await User.findOne({ username });
        if (existing) return res.json({ message: "Username already exists" });

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();

        res.json({ message: "success", username: user.username });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Registration failed" });
    }
});

// ✅ Login endpoint
// ✅ Login endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.json({ message: "Invalid username or password" });
        }

        const token = jwt.sign(
            { username: user.username, email: user.email },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        const posts = await Post.find({ author: username });

        res.json({
            message: "success",
            token, // Send the token to frontend
            user: {
                username: user.username,
                email: user.email,
                posts: posts
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Login failed" });
    }
});



// ✅ Create Post endpoint
// 🔐 Protected: Create Post endpoint with JWT
app.post('/posts', authenticateToken, async (req, res) => {
    const { title, content } = req.body;
    const author = req.user.username; // Extract from verified token

    try {
        const newPost = new Post({ title, content, author });
        await newPost.save();
        res.send('Post created successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to create post');
    }
});



function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 🌐 Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});




// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Save CVs in uploads/ directory
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, uniqueSuffix);
  }
});
const upload = multer({ storage: storage });



// CV Application Form Endpoint
// ✅ THIS IS CORRECT
app.post('/submit-application', upload.single('cv'), async (req, res) => {
  const { name, email, mobile, experience, department, location } = req.body;
  const cvFile = req.file;

  try {
    const application = new Application({
      name,
      email,
      mobile,
      experience,
      department,
      location,
      cvFileName: cvFile?.filename
    });

    await application.save();
    res.json({ message: "Application submitted successfully" });
  } catch (err) {
    console.error('Application submission error:', err);
    res.status(500).json({ message: "Failed to submit application" });
  }
});


const fs = require('fs');
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
