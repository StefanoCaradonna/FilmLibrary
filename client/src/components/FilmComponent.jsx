import dayjs from 'dayjs';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Container, Row, Form, Button, Table, Spinner, Alert } from 'react-bootstrap';
import { useEffect, useState  } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { faHeart as fasFaHeart } from '@fortawesome/free-solid-svg-icons'
import { faHeart as farFaHeart } from '@fortawesome/free-regular-svg-icons'
import { Link, useNavigate, useParams } from 'react-router-dom';
import API from '../API';
import '../App.css'

import * as Icon from 'react-bootstrap-icons';

function createFilmWithRate(elem, newRating, editRow){
    //devono essere a 1 star sia il precedente che quello che sto cliccando
    newRating = (elem.rating == 1 && newRating == 1) ? 0 : newRating;
    const e = {
        title: elem.title,
        favorite: elem.favorite,
        rating: newRating,
        date: elem.date,
        id: elem.id,
        user: elem.user
    }
    editRow(e);
}

function createWithToggleFave(elem, editRow){
    const e = {
        title: elem.title,
        favorite: !elem.favorite,
        rating: elem.rating,
        date: elem.date,
        id: elem.id,
        user: elem.user
    }
    editRow(e);
}

function MyStar(props){
    const elem = props.elem;
    const n_star = props.n_star;
    let tag = [];
    for(let i = 1; i <= 5 ; i++){
        if(i <= n_star){
            tag[i] = <a key={i} title={`Set ${(elem.rating == 1 && i == 1) ? 0 : i} star`} href="#" className="text-decoration-none" style={{color: "black",}}>
                        <Icon.StarFill onClick={() => {createFilmWithRate(elem, i, props.editRow); }} />
                    </a>;
        }
        else{
            tag[i] = <a key={i} title={`Set ${(elem.rating == 1 && i == 1) ? 0 : i} star`} href="#" className="text-decoration-none" style={{color: "black",}}>
                        <Icon.Star onClick={() => {createFilmWithRate(elem, i, props.editRow);}} />
                    </a>;
        }
    }
    return(tag)
}

function MyRow(props){
    const [colorTrash, setColorTrash] = useState("#05285d");
    const [colorEdit, setColorEdit] = useState("#05285d");
    const [shakeTrash, setShakeTrash] = useState(false);
    const [shakeEdit, setShakeEdit] = useState(false);
    const [shakeHeart, setShakeHeart] = useState(false);
    const elem = props.elem;
    
    let statusClass = null;

    switch (elem.status) {
        case 'added':
            statusClass = 'table-success';
            break;
        case 'deleted':
            statusClass = 'table-danger';
            break;
        case 'updated':
            statusClass = 'table-warning';
            break;
        default:
            break;
    }

    return(
        <tr className={statusClass}>
            <td title="Title">{elem.favorite == true ? <font color="red">{elem.title}</font> : elem.title}</td> 
            <td title="Favorite">
                {   elem.favorite == false ? 
                    
                    <a title={`Set favorite`} href="#" className="text-decoration-none" style={{color: "red",}}>
                        <FontAwesomeIcon icon={farFaHeart} color="red" shake={shakeHeart}
                            onClick={() => { 
                                //setShakeHeart(true);
                                createWithToggleFave(elem, props.editRow);
                             }} />
                    </a>
                    : 
                    <a title={`Set not favorite`} href="#" className="text-decoration-none" style={{color: "red",}}>
                         <FontAwesomeIcon icon={fasFaHeart} color="red" shake={shakeHeart}
                            onClick={() => { 
                                //setShakeHeart(true);
                                createWithToggleFave(elem, props.editRow);
                            }} />
                    </a>
                }
                <span padding="10"> Favorite</span>
            </td>
            <td title="Date of viewing">{dayjs(elem.date).isValid() ? dayjs(elem.date).format("MMMM D, YYYY") : false}</td>
            <td title="Rating">
                {
                    elem.rating == undefined ? 
                        false : 
                        <MyStar n_star={elem.rating} elem={elem} editRow={props.editRow} setDirty={props.setDirty} />
                }
            </td>
            <td align='center'>
                <a title="Delete row" href="#" className="text-decoration-none">
                    <FontAwesomeIcon icon={faTrash} color={colorTrash}  shake={shakeTrash}
                        onClick={props.deleteRow }
                        onMouseOver={() => {setColorTrash("#d20404"); setShakeTrash(true)}} 
                        onMouseOut={() => {setColorTrash("#05285d"); setShakeTrash(false)}}
                    />
                </a>
            </td>
            <td align='center' >
                <Link title="Edit row" to={`/edit/${elem.id}`}> 
                    <FontAwesomeIcon  icon={faPencil}  color={colorEdit} shake={shakeEdit}
                        onMouseOver={() => {setColorEdit("#efb81f"); setShakeEdit(true)}} 
                        onMouseOut={() => {setColorEdit("#05285d"); setShakeEdit(false)}}
                    />
                </Link>
            </td>

        </tr>
    )
}

function getFilterFunct(filterName, vettFilter){
    if(filterName === vettFilter[0] || filterName === undefined){
        return API.getAllFilms();
    }
    else if(filterName === vettFilter[1]){
        return API.getFavorite();
    }
    else if(filterName === vettFilter[2]){
        return API.getBestRates();
    }
    else if(filterName === vettFilter[3]){
        return API.getSeenLastMonth();
    }
    else if(filterName === vettFilter[4]){
        return API.getUnseen();
    }
}

function Loading(props) {
    return (
      <Spinner className='m-2' animation="border" role="status" />
    )
  }

function FilmFilter(props) {
    const list = props.list;
    const setList = props.setList;
    const filter = props.filter;
    const setFilter = props.setFilter;
    const vettFilter = props.vettFilter; 
    const welcomeMessage = props.welcomeMessage;
    const setWelcomeMessage = props.setWelcomeMessage;
    
    const [editObj, setEditObj] = useState(undefined);  // state to keep the info about the object to edit
    const [colorCircle, setColorCircle] = useState("#0d6efd");

    const { filterName } = useParams();
    const { filmName } = useParams();
 
    useEffect( () => {
        setFilter(filterName === undefined ? vettFilter[0] : filterName);
        getFilterFunct(filterName, vettFilter)
            .then((list) => {
                props.setDirty(false);
                props.setInitialLoading(false); 
                setList(list);
            })
            .catch((err) => console.log(err));
    }, [filterName, props.dirty]);

    return (
        <div className="onTheRight ">
            {   
                welcomeMessage ?
                <Alert show={props.visibleAlert} style={{ weight: "100%", }} align="center" variant={props.loggedIn ? 'success':'warning'}  onClose={() => setWelcomeMessage('')} dismissible> 
                    {welcomeMessage} 
                </Alert> 
                : false 
            }
                
            { props.loggedIn ?
                <>
                    { props.initialLoading ? 
                        <Loading /> :   
                        <>  
                            <h2>{filterName == undefined ? vettFilter[0] : filterName}</h2>
                    
                            <div className="p-3">
                                <Table hover>
                                    <tbody>
                                        {
                                            list.filter(f => 
                                                {         
                                                    if(filmName !== undefined ){
                                                        if( f.title.toUpperCase().toLowerCase().includes(filmName.toUpperCase().toLowerCase()))
                                                            return true;
                                                        else return false;
                                                    }
                                                    else return true;
                                                })
                                                .map( (e, i) =>
                                                <MyRow elem={e} key={i} 
                                                    deleteRow ={() => props.deleteRow(e.id)}
                                                    editRow={props.editRow}
                                                    setDirty={props.setDirty}
                                                /> ) 
                                        }
                                    </tbody>
                
                                </Table>
                            </div>
                            <div className="d-flex align-items-start flex-column bd-highlight p-4 "  >
                                <Link to='/add'>
                                    {
                                        <Icon.PlusCircleFill id="circle" title="Add new film - Open Form" color={colorCircle} size="48px" 
                                            onClick={() => {setEditObj(undefined); setColorCircle("#0d6efd")}} 
                                            onMouseOver={() => setColorCircle("#05285d")}
                                            onMouseOut={() => setColorCircle("#0d6efd")}
                                            /> 
                                    }
                                </Link>
                            </div>
                        </>
                       
                    }   
                </>
                : 
                <Container className='pt-4'>
                    <Row xs={2}>
                        <Col xs={3}></Col>
                        <Col xs={6}>
                            <h2>Not Autorized, you must login before</h2>                  
                        </Col>
                        <Col xs={3}></Col>
                    </Row>
                </Container>
            }
        </div>
    )
}

export default FilmFilter
/*
<>
            
         </>
*/