
import dayjs from 'dayjs';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Container, Row, Form, Button, Table, Alert } from 'react-bootstrap';
import MySidebar from './Sidebar';
import MyNavbar from './Navbar';
import { useState  } from 'react';
import FilmFilter from './FilmComponent';
import '../App.css'
/*


*/
function FilmRoute(props) {
    const loggedIn = props.loggedIn;
    const hiddenSide = props.hiddenSide;
    const setHiddenSide = props.setHiddenSide;
    const [filter, setFilter] = useState(props.vettFilter[0]);

    return (
        <div className="main-container">
            <Row>
                <MyNavbar hiddenSide={hiddenSide} setHiddenSide={setHiddenSide} loggedIn={loggedIn} 
                    doLogOut={props.doLogOut} user={props.user}/>
            </Row>
            
            <div className="wrapper">
                    <MySidebar listFilm={props.list} vettFilter={props.vettFilter} filter={filter} setFilter={setFilter} 
                            hiddenSide={hiddenSide} setInitialLoading={props.setInitialLoading} />

                    <div className="container-fluid d-flex px-3 pt-3 pb-4">
                        <FilmFilter  
                            vettFilter={props.vettFilter}
                            filter={props.filter} 
                            setFilter={setFilter}
                            list={props.list} 
                            setList={props.setList} 
                            hiddenSide={props.hiddenSide}
                            addToList={props.addToList} 
                            deleteRow={props.deleteRow} 
                            editRow={props.editRow}        
                            dirty={props.dirty}
                            setDirty={props.setDirty}
                            initialLoading={props.initialLoading}
                            setInitialLoading={props.setInitialLoading}
                            welcomeMessage={props.welcomeMessage}
                            setWelcomeMessage={props.setWelcomeMessage}
                            loggedIn={loggedIn}
                            visibleAlert={props.visibleAlert}
                            setAlertVisible={props.setAlertVisible}
                            
                        />
                    </div> 
                
            </div>
        </div>
    )
  }
  
  export default FilmRoute