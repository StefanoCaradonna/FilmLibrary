
import dayjs from 'dayjs';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Col, Container, Row, Form, Button, Table, InputGroup, } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClapperboard } from '@fortawesome/free-solid-svg-icons'
import { faBarsStaggered } from '@fortawesome/free-solid-svg-icons'
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useState  } from 'react';
import API from '../API';

import * as Icon from 'react-bootstrap-icons';

import '../App.css'

function MyNavbar(props) {
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    return (
        <Navbar expand="lg"  bg="primary" variant="dark" className="navbar navbar-expand-lg bg-primary" >
            <Container fluid>
                <Nav className="d-flex p-2 justify-content-start" id="menu">
                    {
                        props.hiddenSide !== undefined ? (
                            props.hiddenSide ? 
                            <Button className="btn px-3 py-0 open-btn" id="btn_menu" disabled={!props.loggedIn} onClick={() => props.setHiddenSide(false)} > 
                                <Icon.ListNested size="30"/>
                            </Button> :
                            <Button className="btn px-3 py-0 open-btn" id="btn_menu" disabled={!props.loggedIn} onClick={() => props.setHiddenSide(true)} > 
                                <Icon.ListNested size="30"/>
                            </Button>
                        )
                        :
                        false
                    }
                </Nav>
                <Nav className="d-flex p-2 justify-content-start titolo">
                    <Link to="/" >
                        <Navbar.Brand>
                            <FontAwesomeIcon icon={faClapperboard} size="xl" style={{color: "#ffffff",}} />
                            <span className='p-1' style={{color: '#ffffff'}}>Film Library</span> 
                        </Navbar.Brand>
                    </Link>
                </Nav>
                <Nav className="d-flex p-2 justify-content-between" >
                {
                    props.loggedIn === true ? (
                    props.hiddenSide !== undefined ?
                        <InputGroup className="collapse navbar-collapse " id="navbarSupportedContent">
                            <Form className='d-flex'>
                                <Form.Control
                                    type="search"
                                    placeholder="Search"
                                    className="me-2"
                                    aria-label="Search"
                                    
                                    value={search} 
                                    onChange={e => {setSearch(e.target.value); navigate(`/${e.target.value}`)} }
                                />
                                <Link to={`/${search}`}>
                                    <InputGroup.Text className="btn btn-secondary " type="submit" id="basic-addon1">
                                            Search
                                    </InputGroup.Text>
                                </Link>
                            </Form>
                        </InputGroup>
                    
                    :
                    false)
                    : false
                }
                </Nav>
                <Nav className="d-flex  justify-content-end">
                    { props.loggedIn ? 
                        <>
                            <NavDropdown title={`${props.user.name}`} id="collasible-nav-dropdown" align="end" >
                                <NavDropdown.Item >{props.user.username}</NavDropdown.Item>
                                <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={()=>{ props.doLogOut(); navigate('/');  }} >
                                        Logout
                                    </NavDropdown.Item>
                            </NavDropdown>
                            <Link to="/" >
                                <Navbar.Brand>
                                    <Icon.PersonFill color="white" size="40"/>
                                </Navbar.Brand>
                            </Link>
                        </>
                        :
                        <Link to="/login" >
                            <Navbar.Brand>Login</Navbar.Brand>
                        </Link>
                    }   
                    
                </Nav>
            </Container>
    </Navbar>
    )
  }
  
  export default MyNavbar