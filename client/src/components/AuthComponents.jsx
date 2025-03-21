import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../API';

function LoginForm(props) {
  const [username, setUsername] = useState('stefano@test.com');
  const [password, setPassword] = useState('password');
  const [errorMessage, setErrorMessage] = useState('') ;

  const navigate = useNavigate();

  const doLogIn = (credentials) => {
    API.logIn(credentials)
      .then( user => {
        setErrorMessage('');
        props.loginSuccessful(user);
      })
      .catch(err => {
        setErrorMessage('Wrong username or password');
      })
  }

  function isEmail(val) {
    let regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regEmail.test(val))
      return false;
    else return true;
  }

  const handleSubmit = (event) => {
      event.preventDefault();
      setErrorMessage('');
      const credentials = { username, password };

      let valid = true;
      if(username === '' || password === '')
          valid = false;
      valid = isEmail(username);
      
    if (valid) {
      doLogIn(credentials);
    } else {
      setErrorMessage('Wrong username or password!');
    }
  };

  return (
      <Container>
          <Row>
              <Col xs={3}></Col>
              <Col xs={6}>
                  <h2>Login</h2>                    
                  <Form onSubmit={handleSubmit} onChange={() => setErrorMessage('')} onClick={() => setErrorMessage('')} >
                      {errorMessage ? <Alert style={{ weight: "100%", }} variant='danger' onClose={() => setErrorMessage('')} dismissible> {errorMessage} </Alert> : false }
                      <Form.Group controlId='username'>
                          <Form.Label>Email</Form.Label>
                          <Form.Control type='email' value={username} onChange={ev => setUsername(ev.target.value)} />
                      </Form.Group>
                      <Form.Group controlId='password'>
                          <Form.Label>Password</Form.Label>
                          <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} />
                      </Form.Group>
                      <Button className='my-2' variant='primary' type='submit'>Login</Button>
                      <Button className='my-2 mx-2' variant='danger' onClick={()=>navigate('/')}>Cancel</Button>
                  </Form>
              </Col>
              <Col xs={3}></Col>
          </Row>
      </Container>
    )
}

export { LoginForm };