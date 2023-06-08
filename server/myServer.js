'use strict';

const express = require('express');
const morgan = require('morgan'); // logging middleware
const {check, validationResult} = require('express-validator'); // validation middleware
const dao = require('./myDao'); // module for accessing the DB

const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session'); // enable sessions
const userDao = require('./user-dao'); // module for accessing the user info in the DB
const cors = require('cors');

/*** Set up Passport ***/
// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(new LocalStrategy(
  function(username, password, done) {
    userDao.getUser(username, password).then((user) => {  // getUser recupera l'utente
      if (!user)
        return done(null, false, { message: 'Incorrect username and/or password.' });
        
      return done(null, user);
    })
  }
));

// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
  done(null, user.id); // user.id non è in chiaro è associato alla session
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
  userDao.getUserById(id)   // id dentro la sessione req.user.id
    .then(user => {
      done(null, user); // this will be available in req.user
    }).catch(err => {
      done(err, null);
    });
});


// init express
const app = express();
const port = 3001;

const answerDelay = 500;

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json());
const corsOptions = {
  origin: 'http://localhost:5173', // di vite
  credentials: true,
};

app.use(cors(corsOptions)); // NB: Usare solo per sviluppo e per l'esame! Altrimenti indicare dominio e porta corretti

// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated())
    return next();
  
  return res.status(401).json({ error: 'Not authenticated'});
}

// set up the session
app.use(session({
  // by default, Passport uses a MemoryStore to keep track of the sessions
  secret: 'sjrya27du0d5y64ah3',   //personalize this random string, should be a secret value
  resave: false,
  saveUninitialized: false 
}));

// then, init passport
app.use(passport.initialize());
app.use(passport.session());

/*  AP */

// GET /api/films
app.get('/api/films', isLoggedIn, (req, res) => {
    dao.listFilms(req.user.id)
      .then(films => setTimeout(()=>res.json(films), answerDelay)) //se promise fullfilled 
      .catch(() => res.status(500).end());    //se promise rejected
  });


// GET /api/filter/Favorites
app.get('/api/filter/Favorites', isLoggedIn, (req, res) => {
    dao.getFavorite(req.user.id)
      .then(films => setTimeout(()=>res.json(films), answerDelay)) //se promise fullfilled 
      .catch(() => res.status(500).end());    //se promise rejected
  });

// GET /api/filter/Best%20Rates
app.get('/api/filter/Best%20Rates', isLoggedIn, (req, res) => {
    dao.getBestRate(req.user.id)
      .then(films => setTimeout(()=>res.json(films), answerDelay)) //se promise fullfilled 
      .catch(() => res.status(500).end());    //se promise rejected
  });
  
// GET /api/filter/Seen%20Last%20Month
app.get('/api/filter/Seen%20Last%20Month', isLoggedIn, (req, res) => {
    dao.getSeenLastMonth(req.user.id)
      .then(films => setTimeout(()=>res.json(films), answerDelay)) //se promise fullfilled 
      .catch(() => res.status(500).end());    //se promise rejected
  });

  // GET /api/filter/Unseen
app.get('/api/filter/Unseen', isLoggedIn, (req, res) => {
    dao.getUnseen(req.user.id)
      .then(films => setTimeout(()=>res.json(films), answerDelay)) //se promise fullfilled 
      .catch(() => res.status(500).end());    //se promise rejected
  });

  
// GET /api/films/<id>
app.get('/api/films/:id', isLoggedIn, async (req, res) => {
    try {
      const result = await dao.getFilmById(req.params.id, req.user.id);
      if(result.error)
        res.status(404).json(result);
      else
        res.json(result);
    } catch(err) {
      res.status(500).end();
    }
  });

  
// POST /api/films
app.post('/api/films',  isLoggedIn, [
    check('rating').isInt(),
    check('title').isLength({min: 1}),
    check('watchdate').isDate({format: "YYYY-MM-DD", strictMode: true})
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({errors: errors.array()});
    }

    const film = {
        title: req.body.title,
        favorite: req.body.favorite,
        watchdate: req.body.watchdate,
        rating: req.body.rating,
        user: req.user.id,
    };

    try {
        const filmId = await dao.createFilm(film, req.user.id);
        // Return the newly created id of the film to the caller. 
        // A more complex object can also be returned (e.g., the original one with the newly created id)
        setTimeout(()=> answerDelay);
        res.status(201).json(filmId);
    } catch (err) {
        res.status(503).json({ error: `Database error during the creation of film ${film.title}.` });
    }
    
  });

  //UPDATE
// PUT /api/films/<id>
app.put('/api/films/:id',  isLoggedIn, [
    check('rating').isInt(),
    check('title').isLength({min: 1}),
    //check('watchdate').isDate({format: "YYYY-MM-DD", strictMode: true}),
    check('id').isInt()
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({errors: errors.array()});
    }
  
    const film = req.body;
    // you can also check here if the id passed in the URL matches with the id in req.body,
    // and decide which one must prevail, or return an error
    film.id = req.params.id;
  
    try {
      const numRowChanges = await dao.updateFilm(film, req.user.id);
      setTimeout(()=> answerDelay);
      res.json(numRowChanges);
      //res.status(200).end();
    } catch(err) {
      res.status(503).json({error: `Database error during the update of answer ${req.params.id}.`});
    }
  
  });

  
// POST /api/films/<id>/rating
app.post('/api/films/:id/rating', isLoggedIn, [
    check('id').isInt(),
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({errors: errors.array()});
    }
  
    try {
      const numRowChanges = await dao.updateRatingById(req.params.id, req.body.rating, req.user.id);
      // number of changed rows is sent to client as an indicator of success
      setTimeout(()=> answerDelay);
      res.json(numRowChanges);
    } catch (err) {
      res.status(503).json({ error: `Database error during the vote of answer ${req.params.id}.` });
    }
  
  });
/*
// POST /api/films/<id>/toggleFavorite
app.post('/api/films/:id/toggleFavorite', [
    check('id').isInt(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    try {
        //retrieve old value of favorite to toggle it
        const result = await dao.getFilmById(req.params.id, req.user.id);  // needed to ensure db consistency
        if (result.error)
            res.status(404).json(result);   // filmId does not exist
        else {
            let newFav = 0;
            //toggle
            if (result.favorite == 1)
                newFav = 0;
            else newFav = 1;

            try {
                const numRowChanges = await dao.toggleFavorite(req.params.id, newFav);
                setTimeout(() => answerDelay);
                res.json(numRowChanges);
            } catch (err) {
                res.status(503).json({ error: `Database error during the vote of answer ${req.params.id}.` });
            }
        }
    }
    catch (err) {
        res.status(500).end();
    }
});
*/
// DELETE /api/films/<id>
app.delete('/api/films/:id', isLoggedIn, async (req, res) => {
    try {
        const numRowChanges = await dao.deleteFilm(req.params.id, req.user.id);
        // number of changed rows is sent to client as an indicator of success
        setTimeout(()=> answerDelay);
        res.json(numRowChanges);
    } catch (err) {
        console.log(err);
        res.status(503).json({ error: `Database error during the deletion of answer ${req.params.id}.` });
    }
});


// POST /sessions 
// login
app.post('/api/sessions', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        // display wrong login messages
        return res.status(401).json(info);
      }
      // success, perform the login
      req.login(user, (err) => {
        if (err)
          return next(err);
        
        // req.user contains the authenticated user, we send all the user info back
        // this is coming from userDao.getUser()
        return res.json(req.user);
      });
  })(req, res, next);
});

// DELETE /sessions/current 
// logout
app.delete('/api/sessions/current', (req, res) => {
  req.logout( ()=> { res.end(); } );
});

// GET /sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current', (req, res) => {  
  if(req.isAuthenticated()) {
    res.status(200).json(req.user);}
  else
    res.status(401).json({error: 'Unauthenticated user!'});
  
});



/*** Other express-related instructions ***/

// Activate the server
app.listen(port, () => {
    console.log(`react-qa-server listening at http://localhost:${port}`);
});