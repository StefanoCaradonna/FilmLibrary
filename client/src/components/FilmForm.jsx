
import dayjs from 'dayjs'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Container, Row, Form, Button, Table, Alert, } from 'react-bootstrap';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useState  } from 'react';
import MyNavbar from './Navbar';

function FormRoute(props){
    return(
        <div className="main-container">
            <Row>
                <MyNavbar hiddenSide={undefined} setHiddenSide={undefined} />
            </Row>
            <MyForm 
                list={props.list}
                addToList={props.addToList} 
                editRow={props.editRow}
            />
        </div>
    )
}

//il tag Form mi serve per poter avere il gestore dell'onSubmit
function MyForm(props){
    const navigate = useNavigate();
    const { filmId } = useParams();
    const objToEdit = filmId && props.list.find(e => e.id === parseInt(filmId));
    const [title, setTitle] = useState(objToEdit ? objToEdit.title : '');
    const [date, setDate] = useState( objToEdit ? 
                                        (objToEdit.date ? 
                                                objToEdit.date.format('YYYY-MM-DD') 
                                                : dayjs().format('YYYY-MM-DD')
                                        ) 
                                    : dayjs().format('YYYY-MM-DD'));
    const [favorite, setFavorite] = useState(objToEdit ? objToEdit.favorite : 0);
    const [rating, setRating] = useState(objToEdit ? (objToEdit.rating ? objToEdit.rating : 0) : 0);

    //stato per errore
    const [errorMsg, setErrorMsg] = useState(''); //stringa vuota -> non c'è errore


    //onSubmit
    function handlerSubmit(event){
        event.preventDefault();
        //Form validation
        if(date === '')
            setErrorMsg("Invalid date!");
        else if(title === '')
            setErrorMsg("Invalid title!");
        else if(isNaN(parseInt(rating))) // senza parse non va ('' -> NaN-> true)
                setErrorMsg("Invalid rating!");
        else if(parseInt(rating) < 0)
                setErrorMsg("Negative score not accepted!"); 
        else if(parseInt(rating) > 5)
                setErrorMsg("Score over 5 star is not accepted!"); 
        else{
            const e = {
                title: title,
                favorite: favorite,
                rating: parseInt(rating),
                date: dayjs(date).format("YYYY-MM-DD"),
            }

            if (objToEdit) {  // decide if this is an edit or an add
                e.id = objToEdit.id;
                props.editRow(e);
            } else{
                e.id = props.list[props.list.length-1].id + 1;
                e.status = 'added';
                props.addToList(e);
            }
            navigate('/');
        }
    }

    return(
        <>
            {errorMsg ?   <Alert style={{ weight: "100%", }} variant='danger' onClose={() => setErrorMsg('')} dismissible> {errorMsg} </Alert> : false}
            <div className="wrapper">
                <div className="container-fluid d-flex px-3 pt-3 pb-4">
                    <Form onSubmit={handlerSubmit} onChange={() => setErrorMsg('')} onClick={() => setErrorMsg('')}>
                        <Form.Group className="mb-3">
                            <Form.Label> Title</Form.Label>
                            <Form.Control type="text" name="title" style={{  width: 500,  }} value={title} onChange={e => setTitle(e.target.value)} placeholder="Film Title" />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label> Favorite</Form.Label>
                            <Form.Check type="checkbox" value={favorite} defaultChecked={favorite} 
                                onChange={e => setFavorite(e.target.checked ? 1 : 0)} />
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                            <Form.Label> Date</Form.Label>
                            <Form.Control type="date" name="date" style={{  width: 150,  }} value={date} onChange={e => setDate(e.target.value)} placeholder="Date of viewing" />
                        </Form.Group>
                        
                        <Form.Group className="mb-4">
                            <Form.Label> Rate</Form.Label>
                            <Form.Control type="number" style={{  width: 100,  }} value={rating} onChange={e => setRating(e.target.value)} placeholder="Rate" />
                        </Form.Group>
                        
                        <Button type="submit" title="Add film" variant="primary">{ objToEdit ? 'Save' : 'Add'}</Button>
                        <Link to='/'>
                            <Button className='mx-2' type="submit" title="Close Form" onClick={props.closeForm} variant="secondary">Close Form</Button>
                        </Link>
                    </Form>
                </div>
            </div>
        </>
    )
}

export { MyForm, FormRoute };