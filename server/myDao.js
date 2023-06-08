'use strict';
/* Data Access Object (DAO) module for accessing questions and answers */

const sqlite = require('sqlite3');
const dayjs = require('dayjs');

// open the database
const db = new sqlite.Database('films.db', (err) => {
  if(err) throw err;
});

// get all films
exports.listFilms = (userId) => {
    return new Promise((resolve, reject) => {
    const sql = 'SELECT films.id AS id, title, favorite, watchdate, rating, films.user AS user, users.name AS username FROM films JOIN users ON films.user = users.id WHERE user = ?';    
      db.all(sql, [userId], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        const films = rows.map((e) => ({ 
            id: e.id, 
            title: e.title, 
            favorite: e.favorite, 
            watchdate: dayjs(e.watchdate).format("MMMM D, YYYY"), 
            rating: e.rating, 
            user: e.user
        }));
        resolve(films);
      });
    });
  };

  
// get list favorites films
exports.getFavorite = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT films.id AS id, title, favorite, watchdate, rating, films.user AS user, users.name AS username FROM films JOIN users ON films.user = users.id WHERE favorite=1 AND user = ?';
        db.all(sql, [userId], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const films = rows.map((e) => ({ 
                id: e.id, 
                title: e.title, 
                favorite: e.favorite, 
                watchdate: dayjs(e.watchdate).format("MMMM D, YYYY"), 
                rating: e.rating, 
                user: e.user  
            }));
            resolve(films);
        });
    });
};


//get list of Best Rated films 
exports.getBestRate = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT films.id AS id, title, favorite, watchdate, rating, films.user AS user, users.name AS username FROM films JOIN users ON films.user = users.id WHERE rating=5 AND user = ?';
        db.all(sql, [userId], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const films = rows.map((e) => ({ 
                id: e.id, 
                title: e.title, 
                favorite: e.favorite, 
                watchdate: dayjs(e.watchdate).format("MMMM D, YYYY"), 
                rating: e.rating, 
                user: e.user  
            }));
            resolve(films);
        });
    });
};

//get list of films watched last month
exports.getSeenLastMonth = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT films.id AS id, title, favorite, watchdate, rating, films.user AS user, users.name AS username FROM films JOIN users ON films.user = users.id WHERE user = ?';
        db.all(sql, [userId], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const films = rows.filter(f => {
                let now = dayjs().unix(); //secondi
                let lastMonth = now - 2592000; //30 giorni
                if (dayjs(f.watchdate) == undefined)
                    return false;

                if (dayjs(f.watchdate).unix() > lastMonth && dayjs(f.watchdate).unix() <= now)
                    return true;
                else return false;
            }).map((e) => ({ id: e.id, title: e.title, favorite: e.favorite, watchdate: dayjs(e.watchdate).format("MMMM D, YYYY"), rating: e.rating, user: e.user  }));
            resolve(films);
        });
    });
};

//get list of unseen films  
exports.getUnseen = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT films.id AS id, title, favorite, watchdate, rating, films.user AS user, users.name AS username FROM films JOIN users ON films.user = users.id WHERE (watchdate IS NULL OR watchdate="") AND user = ?';
        db.all(sql, [userId], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const films = rows.map((e) => ({ 
                id: e.id, 
                title: e.title, 
                favorite: e.favorite, 
                watchdate: dayjs(e.watchdate).format("MMMM D, YYYY"), 
                rating: e.rating, 
                user: e.user
            }));
            resolve(films);
        });
    });
};

//return an existing film by id
exports.getFilmById = (id, userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT films.id AS id, title, favorite, watchdate, rating, films.user AS user, users.name AS username FROM films JOIN users ON films.user = users.id  WHERE id=? AND user = ?';
        db.get(sql, [id, userId], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row == undefined) { //es. se inserisco nella richiesta un id che non esiste
                resolve({ error: 'Film not found.' });
            } else {
                const film = {
                    id: row.id,
                    title: row.title,
                    favorite: row.favorite,
                    watchdate: dayjs(row.watchdate).format("MMMM D, YYYY"),
                    rating: row.rating,
                    user: e.user
                }
                resolve(film);
            }
        });
    });
};

//create a new film
exports.createFilm = (film, userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO films(title, favorite, watchdate, rating, user) VALUES(?, ?, DATE(?), ?, ?)';
        db.run(sql, [film.title, film.favorite, film.watchdate, film.rating, film.user], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
};

// update an existing film
exports.updateFilm = (film, userId) => {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE films SET title=?, favorite=?, watchdate=DATE(?), rating=?  WHERE id=? AND user = ?"; // Double-check that the answer belongs to the userId
        db.run(sql, [film.title, film.favorite, film.watchdate, film.rating, film.id, userId], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);
        });
    });
};


// update rating of an existing film
exports.updateRatingById = (filmId, rating, userId) => {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE films SET rating=?  WHERE id=? AND user = ?"; // Double-check that the answer belongs to the userId
        db.run(sql, [rating, filmId, userId], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);
        });
    });
};
/*
// update rating of an existing film
exports.toggleFavorite = (filmId, newFav, userId) => {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE films SET favorite=?  WHERE id=? AND user = ?"; // Double-check that the answer belongs to the userId
        db.run(sql, [newFav, filmId, userId], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);
        });
    });
};
*/
exports.deleteFilm = (id, userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM films WHERE id=? AND user = ?'; // Double-check that the answer belongs to the userId
        db.run(sql, [id, userId], function (err) {
        if (err) {
            reject(err);
            return;
        }   
        resolve(this.changes);
        });
    });
};