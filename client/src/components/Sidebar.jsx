
import dayjs from 'dayjs';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Container, Row, Form, Button, Table, } from 'react-bootstrap';
import { useState  } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import '../App.css'

function MyDiv(props){
    let filter = props.filter;
    let name = props.name;
    const id = props.id;
    
    return(
        <>
        {
            <Link to={`/filter/${name}`}>
                <div className={filter === name ? "p-2 select" : "p-2"}  
                    onClick={() => {filter === name ? false : props.setInitialLoading(true); props.setFilter(name);  }}  >
                        { name }
                </div>
            </Link>
        }
        </>
    )
}

function MySidebar(props) {
    const filter = props.filter;
    const vettFilter = props.vettFilter;
    const hiddenSide = props.hiddenSide;

    return (
        <div className={hiddenSide ? "sidebar px-3 pt-3 pb-4 active" : "sidebar px-3 pt-3 pb-4"} id="side_nav">
            {
                vettFilter.map( (f, i) =>
                    <MyDiv name={f} id={i} key={i} filter={filter} setFilter={props.setFilter} 
                            setInitialLoading={props.setInitialLoading} /> )
            }
            <div className="content" id="altro"></div>
        </div>
    )
  }
  export default MySidebar