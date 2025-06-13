require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const authRoutes = require('./routes/auth');
const resumeRoutes = require('./routes/routes_resumeRoutes');
const User = require('./models/User');
const ResumeData=require(`./models/resumeModel`);
const jwt = require('jsonwebtoken');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// JWT Authentication Middleware
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

// Admin Authentication Middleware
const authenticateAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admin only.' });
    }
};

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);

// Admin routes
app.get('/api/userdata', async (req, res) => {
    try {
      const UserData = await ResumeData.find();
      res.json(UserData);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  });

  app.get('/api/users', async (req, res) => {
    try {
      const UserData = await User.find();
      res.json(UserData);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  });

  app.delete('/api/users/:id', async (req, res) => {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ message: 'User deleted successfully', user: deletedUser });
    } catch (error) {
      console.error('Delete error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
// Registration route
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const user = new User({ name, email, password, isVerified: true });
        await user.save();

        // Send registration confirmation email
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Welcome to Our Platform',
            html: `
                <h1>Welcome to Our Platform</h1>
                <p>Dear ${name},</p>
                <p>You have successfully registered on our platform. We're excited to have you on board!</p>
                <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
                <p>Best regards,<br>The Platform Team</p>
            `
        });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({
            message: 'You have successfully registered on this platform. A confirmation email has been sent to your email address.',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(400).json({ error: error.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.post('/api/ai-assist', async (req, res) => {
  try {
    const systemPrompt = "You are a professional CV and career assistant. Only answer questions related to CV building, resume improvement, and career advice. Be concise, clear, and professional.";
    const { question } = req.body;
    const normalized = question.trim().toLowerCase();
    // Check for "who made you" or similar queries
    if (
      normalized.includes('who made you') ||
      normalized.includes('who created you') ||
      normalized.includes('your creator') ||
      normalized.includes('who is your developer')
    ) {
      return res.json({
        response: "I was made by Aniket Saha who is a high-IQ full-stack developer trained in the MERN stack, known for turning complex problems into elegant solutions. His analytical thinking, refined through a rare blend of self-discipline and natural cognitive strength, empowers him to craft secure, scalable, and impactful applications. He’s not just learning code—he’s engineering progress"
      });
    }
    let prompt= systemPrompt + "\n\nUser: " + question
    const aiRes = await axios.post('https://gemini-app-iota-two.vercel.app/getResponse', {prompt});
    // Forward the AI response to the frontend
    res.json(aiRes.data);
  } catch (error) {
    console.error('AI Proxy error:', error.message);
    res.status(500).json({ error: 'Failed to fetch AI response' });
  }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});