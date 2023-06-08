
import dayjs from "dayjs";

const URL = 'http://localhost:3001/api';

async function getAllFilms() {
  // call  /api/films
  const response = await fetch(URL + '/films', {
    credentials: 'include',
  });
  const films = await response.json();
  
  if (response.ok) {
    return films.map((elem) => ({
      id: elem.id,
      title: elem.title,
      favorite: elem.favorite,
      rating: elem.rating,
      date: dayjs(elem.watchdate),
      user: elem.userId
    }))
  } else {
    throw films;  // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
  }
}

async function getFavorite() {
  // call  /api/filter/Favorites
  const response = await fetch(URL + '/filter/Favorites', {
    credentials: 'include',
  });
  const films = await response.json();
  if (response.ok) {
    return films.map((elem) => ({
      id: elem.id,
      title: elem.title,
      favorite: elem.favorite,
      rating: elem.rating,
      date: dayjs(elem.watchdate),
      user: elem.user
    }))
  } else {
    throw films;  // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
  }
}

async function getBestRates() {
  // call  /api/filter/Best%20Rates
  const response = await fetch(URL + '/filter/Best%20Rates', {
    credentials: 'include',
  });
  const films = await response.json();
  if (response.ok) {
    return films.map((elem) => ({
      id: elem.id,
      title: elem.title,
      favorite: elem.favorite,
      rating: elem.rating,
      date: dayjs(elem.watchdate),
      user: elem.user
    }))
  } else {
    throw films;  // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
  }
}

async function getSeenLastMonth() {
  // call  /api/filter/Seen%20Last%20Month
  const response = await fetch(URL + '/filter/Seen%20Last%20Month', {
    credentials: 'include',
  });
  const films = await response.json();
  if (response.ok) {
    return films.map((elem) => ({
      id: elem.id,
      title: elem.title,
      favorite: elem.favorite,
      rating: elem.rating,
      date: dayjs(elem.watchdate),
      user: elem.user
    }))
  } else {
    throw films;  // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
  }
}

async function getUnseen() {
  // call  /api/filter/Unseen
  const response = await fetch(URL + '/filter/Unseen', {
    credentials: 'include',
  });
  const films = await response.json();
  if (response.ok) {
    return films.map((elem) => ({
      id: elem.id,
      title: elem.title,
      favorite: elem.favorite,
      rating: elem.rating,
      date: dayjs(elem.watchdate),
      user: elem.user
    }))
  } else {
    throw films;  // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
  }
}

function addFilm(film) {
  // call  POST /api/films 
  return new Promise((resolve, reject) => {
    fetch(URL+`/films`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Object.assign({}, film, {watchdate: dayjs(film.date).format("YYYY-MM-DD")})),
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        // analyze the cause of error
        response.json()
          .then((message) => { reject(message); }) // error message in the response body
          .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
      }
    }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
}

function editFilm(film) {
  // call  PUT /api/films/<id>
  return new Promise((resolve, reject) => {
    fetch(URL + `/films/${film.id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Object.assign({}, film, { watchdate: film.date !== undefined ?dayjs(film.date).format("YYYY-MM-DD") : null})), //user default
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        // analyze the cause of error
        response.json()
          .then((message) => { reject(message); }) // error message in the response body
          .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
      }
    }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
}


/*
function toggleFavorite(film) {
  // call  PUT /api/films/<id>/toggleFavorite
  return new Promise((resolve, reject) => {
    fetch(URL+`/films/${film.id}/toggleFavorite`, {
      method: 'POST',
      credentials: 'include',
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        // analyze the cause of error
        response.json()
          .then((message) => { reject(message); }) // error message in the response body
          .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
      }
    }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
}
function updateRating(film, newRating) {
  // call  PUT /api/films/<id>/rating
  return new Promise((resolve, reject) => {
    fetch(URL+`/films/${film.id}/rating`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Object.assign({}, film, {rating: newRating})),
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        // analyze the cause of error
        response.json()
          .then((message) => { reject(message); }) // error message in the response body
          .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
      }
    }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
}
*/
async function deleteFilm(id) {
  // call  /api/films/<id>
  const response = await fetch(URL + `/films/${id}`, {
    credentials: 'include',
    method: 'DELETE',
  });
  const films = await response.json();
  if (response.ok) {
    if (films >= 1) {
      //trovato
    }
  } else {
    response.json()
      .then((message) => { reject(message); }) // error message in the response body
      .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
  }
}


async function logIn(credentials) {
  let response = await fetch(URL + '/sessions', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
    const errDetail = await response.json();
    throw errDetail.message;
  }
}

async function logOut() {
  await fetch(URL+'/sessions/current', {
    method: 'DELETE', 
    credentials: 'include' 
  });
}

async function getUserInfo() {
  const response = await fetch(URL+'/sessions/current', {
    credentials: 'include'
  });
  const userInfo = await response.json();
  if (response.ok) {
    return userInfo;
  } else {
    throw userInfo;  // an object with the error coming from the server
  }
}



const API = {
  getAllFilms, getFavorite, getBestRates, getSeenLastMonth, getUnseen,
  deleteFilm, addFilm, editFilm, logIn, logOut, getUserInfo
};
export default API;