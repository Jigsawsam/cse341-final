const express = require('express');
const router = express.Router();
const passport = require('passport');

router.use('/', require('./swagger'));

router.get('/', (req, res) => {
  if (req.session.user) {
    const name = req.session.user.displayName || req.session.user.username;
    res.send(`Logged in as ${name}`);
    } else {
    res.send('Logged out');
    }
    });
    
router.use('/media', require('./mediaRoutes'));
router.use('/review', require('./reviewRoutes'));
router.use('/tag', require('./tagRoutes'));

router.get('/login', passport.authenticate('github'), (req, res) => {});

router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

module.exports = router;
