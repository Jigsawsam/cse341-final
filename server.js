const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');
const dotenv = require('dotenv');
const { initDB, getDatabase } = require('./data/database');
const { ObjectId } = require('mongodb');
const adminRoutes = require('./routes/adminRoutes');

// Load environment variables
dotenv.config();

const mediaRoutes = require('./routes/mediaRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const tagRoute = require('./routes/tagRoutes');
const indexRoutes = require('./routes/index');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

app.use(cors({
  origin: '*',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// GitHub OAuth Setup
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const db = getDatabase();
        let user = await db.collection('users').findOne({ githubId: profile.id });
        if (!user) {
          // create new user with default role
          user = {
            githubId: profile.id,
            displayName: profile.displayName || profile.username,
            role: 'user', // default role
            createdAt: new Date(),
          };
          const result = await db.collection('users').insertOne(user);
          user._id = result.insertedId;
     }
     done(null, user);
   } catch (err) {
     done(err, null);
   }
}));

passport.serializeUser((user, done) => {
  done(null, user.githubId);
});
passport.deserializeUser(async (githubId, done) => {
    try {
        const db = getDatabase();
        const user = await db.collection('users').findOne({ githubId });
        done(null, user || null);
    } catch (err) {
      done(err, null);
    }
});
    

// OAuth Routes
app.get('/github/login', passport.authenticate('github'));
app.get('/github/callback', passport.authenticate('github', {
  failureRedirect: '/api-docs',
}), (req, res) => {
  req.session.user = req.user;
  res.redirect('/');
});

app.get('/logout', (req, res) => {
  req.logout(() => {
    req.session.destroy(() => {
      res.redirect('/');
    });
  });
});

// API Routes
app.use('/', indexRoutes);
app.use('/media', mediaRoutes);
app.use('/reviews', reviewRoutes);
app.use('/tags', tagRoute);
app.use('/admins', adminRoutes);

// Initialize DB and start server
initDB(err => {
  if (err) {
    console.error('DB connection failed:', err);
    process.exit(1);
  } else {
    app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
  }
});
