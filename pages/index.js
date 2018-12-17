import React from 'react'
import { Card, Col, Row, CardBody, CardTitle, CardText, Button, NavLink, Form, FormGroup, Label, Input, Alert } from 'reactstrap'
import Navigation from '../components/Navigation'
import API from '../config/easyorder-api'
import Router from 'next/router'
import Loader from '../components/Loader'

export default class Index extends React.Component {
  constructor () {
    super()
    this.state = {
      emailOrUsername: '',
      password: '',
      emptyFieldAlert: 0,
      wrongCredentialsAlert: 0,
      loading: 0
    }
    this.handleChange = this.handleChange.bind(this)
    this.login = this.login.bind(this)
  }

  handleChange (e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  login () {
    let call
    this.setState({
      emptyFieldAlert: 0,
      loading: 1
    })
    if (this.state.emailOrUsername && this.state.password) {
      if (this.state.emailOrUsername.includes('@')) {
        call = API.login({
          email: this.state.emailOrUsername,
          password: this.state.password,
          username: 0
        })
      } else {
        call = API.login({
          username: this.state.emailOrUsername,
          password: this.state.password,
          email: 0
        })
      }
      call.then((result) => {
        if (result.data.cypher) {
          Router.push({
            pathname: '/dashboard',
            query: { login: result.data.cypher }
          })
        } else {
          this.setState({
            wrongCredentialsAlert: 1,
            loading: 0
          })
        }
      })
    } else {
      if (!this.state.emailOrUsername || !this.state.password) {
        this.setState({
          emptyFieldAlert: 1,
          loading: 0
        })
      }
    }
  }

  render () {
    return (
      <div className='font'>
        <Navigation />
        <Card style={{backgroundColor: '#f7f7f7', borderColor: '#f7f7f7'}}>
          <div>
            <Row>
              <Col style={{marginLeft: 300, marginTop: 10}}>
                <div >
                  <img src='../static/LoginAppTrans.png' style={{width: 300, height: 580}} />
                </div>
              </Col>
              <Col>
                <Card style={{width: '400px', height: '410px', marginLeft: 680, marginTop: -500}}>
                  {this.state.loading ? (
                    <CardBody>
                      <Loader color={'#FF8000'} loading={this.state.loading} size={150} />
                    </CardBody>
                  ) : (
                    <div>
                      <CardBody >
                        <CardTitle className='text-center' >Willkommen!</CardTitle>
                        <Form>
                          <FormGroup >
                            <Label for='exampleEmail' className='mr-sm-2'>Email / Username</Label>
                            <Input type='email' name='emailOrUsername' value={this.state.emailOrUsername} onChange={this.handleChange} id='exampleEmail' placeholder='cook@restaurant.com / cookie' />
                          </FormGroup>
                          <FormGroup >
                            <Label for='examplePassword' className='mr-sm-2'>Password</Label>
                            <Input type='password' name='password' value={this.state.password} onChange={this.handleChange} id='examplePassword' placeholder='Secretti!' />
                          </FormGroup>
                        </Form>
                      </CardBody>
                      <CardBody style={{marginTop: -40, marginLeft: 5}}>
                        <Button color='warning' onClick={() => this.login()} block outline>Login</Button>
                        <br />
                        <CardText className='text-center'>Sie haben noch kein Konto?</CardText>
                        <NavLink color='dark' href='/init'><Button color='dark' block outline>Registrierung</Button></NavLink>
                      </CardBody>
                      {this.state.emptyFieldAlert ? (
                        <Alert color='warning' >Bitte Email und Passwort eingeben!</Alert>
                      ) : ''}
                      {this.state.wrongCredentialsAlert ? (
                        <Alert color='warning' >Passwort, Username oder Email sind nicht korrekt!</Alert>
                      ) : ''}
                    </div>
                  )}
                </Card>
              </Col>
            </Row>
          </div>
        </Card>
      </div>
    )
  }
}
