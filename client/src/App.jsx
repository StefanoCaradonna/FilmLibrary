
import dayjs from 'dayjs';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Container, Row, Form, Button, Table, } from 'react-bootstrap';
import FilmRoute from './components/FilmRoute';
import { FormRoute } from './components/FilmForm';
import { LoginForm } from './components/AuthComponents';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import API from './API';

import './App.css'

const vettFilter = [
  "All", "Favorites", "Best Rates", "Seen last month", "Unseen"
];

function DefaultRoute() {
  return(
    <Container className='App'>
      <h1>No data here...</h1>
      <h2>This is not the route you are looking for!</h2>
      <Link to='/'><button>Please go back to main page</button></Link>
    </Container>
  );
}

function App() {
  const [list, setList] = useState([]); 
  const [initialLoading, setInitialLoading] = useState(true);
  const [dirty, setDirty] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [user, setUser] = useState(undefined);
  const [loggedIn, setLoggedIn] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [hiddenSide, setHiddenSide] = useState(loggedIn ? false : true); //props.loggedIn ? false : true
  const [visibleAlert, setAlertVisible] = useState(true); // info

    
  function handleError(err) {
    console.log(err);
    let errMsg = 'Unkwnown error';
    if (err.errors)
      if (err.errors[0].msg)
        errMsg = err.errors[0].msg;
    else if (err.error)
      errMsg = err.error;
        
    setErrorMsg(errMsg);
  }

  const handleVisible = () => { 
    setAlertVisible(true)
    setTimeout(() => {
        setAlertVisible(false)
    }, 2000);
} 

  function deleteRow(id){
    setList((oldList) => oldList.map(
      e => e.id !== id ? e : Object.assign({}, e, {status: 'deleted'})
    ));
    //setInitialLoading(true);//per adesso  
    API.deleteFilm(id)
      .then(() => {
        setDirty(true);
        //setList((oldList) => oldList.filter((elem) => elem.id !== id )); //superfluo
      })
      .catch((err) => handleError(err)); 

  }

  function addToList(elem) {
      setList( (oldList) => [...oldList, elem] )
      //setInitialLoading(true);
      API.addFilm(elem)
        .then(() => {
          setDirty(true);
        })
        .catch((err) => handleError(err));
  }

  function editRow(newEl){
      setList((oldList) => oldList.map((e) => {
      if (e.id === newEl.id) {
        newEl.status = 'updated';
          return newEl;
      } else {
          return e;
      }
      }));
      
      //setInitialLoading(true); //provvisorio
      API.editFilm(newEl)
        .then(() => {
          setDirty(true);
        })
        .catch((err) => handleError(err));
  }

  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
    setUser(undefined);
    setHiddenSide(true);
    setList([]);
    setWelcomeMessage("Logout done.");
    setAlertVisible(true);
  }

  const loginSuccessful = (user) => {
    setUser(user);
    setLoggedIn(true);
    setDirty(true);     // load latest version of data, if appropriate
    setHiddenSide(false);
    setWelcomeMessage("Welcome back, " + user.name + "!");
    setAlertVisible(true);
  }

  useEffect(()=> {
    setTimeout(() => { setAlertVisible(false) }, 3000);
  }, [visibleAlert]);

  
  useEffect(()=> {
    const checkAuth = async() => {
      try {
        // here you have the user info, if already logged in
        const user = await API.getUserInfo();
        setLoggedIn(true);
        setUser(user);
      } catch(err) {
        // NO need to do anything: user is simply not yet authenticated
        //handleError(err);
      }
    };
    checkAuth();
  }, []);

  useEffect(()=> {
    loggedIn ? setHiddenSide(false) : setHiddenSide(true);
  }, [loggedIn]);


  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={ <FilmRoute  
                                    vettFilter={vettFilter}
                                    list={list} 
                                    setList={setList} 
                                    addToList={addToList} 
                                    deleteRow={deleteRow} 
                                    editRow={editRow} 
                                    initialLoading={initialLoading} 
                                    setInitialLoading={setInitialLoading}
                                    setDirty={setDirty}
                                    dirty={dirty} 
                                    loggedIn={loggedIn}
                                    doLogOut={doLogOut}
                                    user={user}
                                    welcomeMessage={welcomeMessage}
                                    setWelcomeMessage={setWelcomeMessage}
                                    hiddenSide={hiddenSide}
                                    setHiddenSide={setHiddenSide}
                                    visibleAlert={visibleAlert}
                                    setAlertVisible={setAlertVisible}
                                    />
                                }
        />

        <Route path='/:filmName' element={ <FilmRoute  
                                    vettFilter={vettFilter}
                                    list={list} 
                                    setList={setList} 
                                    addToList={addToList} 
                                    deleteRow={deleteRow} 
                                    editRow={editRow} 
                                    initialLoading={initialLoading}
                                    setInitialLoading={setInitialLoading} 
                                    setDirty={setDirty}
                                    dirty={dirty} 
                                    loggedIn={loggedIn}
                                    doLogOut={doLogOut}
                                    user={user}
                                    welcomeMessage={welcomeMessage}
                                    setWelcomeMessage={setWelcomeMessage}
                                    hiddenSide={hiddenSide}
                                    setHiddenSide={setHiddenSide}
                                    visibleAlert={visibleAlert}
                                    setAlertVisible={setAlertVisible} />
                                }
        />
        
        <Route path='/add'  element={ <FormRoute list={list} addToList={addToList} /> } />

        <Route path='/edit/:filmId' element={ <FormRoute list={list} addToList={addToList} editRow={editRow} /> } />
        <Route path='/filter/:filterName' 
                element={ <FilmRoute 
                    vettFilter={vettFilter}
                    list={list} 
                    setList={setList} 
                    addToList={addToList} 
                    deleteRow={deleteRow} 
                    editRow={editRow} 
                    initialLoading={initialLoading} 
                    setInitialLoading={setInitialLoading}
                    setDirty={setDirty}
                    dirty={dirty} 
                    loggedIn={loggedIn}
                    doLogOut={doLogOut}
                    user={user}
                    welcomeMessage={welcomeMessage}
                    setWelcomeMessage={setWelcomeMessage}
                    hiddenSide={hiddenSide}
                    setHiddenSide={setHiddenSide}
                    visibleAlert={visibleAlert}
                    setAlertVisible={setAlertVisible}
                           />} />        
        <Route path='/login' element={loggedIn? <Navigate replace to='/' /> : <LoginForm loginSuccessful={loginSuccessful} />} />
        <Route path='/*' element={<DefaultRoute />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App