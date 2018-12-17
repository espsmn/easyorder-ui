import React from 'react'
import { Card, CardBody, Form, FormGroup, Label, Input, NavLink, Button, Alert, Progress, CardText, Col, Row, CardTitle, Container } from 'reactstrap'
import Navigation from '../components/Navigation'
import Loader from '../components/Loader'
import API from '../config/easyorder-api'
import store from '../store/store'

export default class Init extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      vorname: '',
      vornameAlert: 0,
      nachname: '',
      nachnameAlert: 0,
      email: '',
      emailAlert: 0,
      username: '',
      usernameAlert: 0,
      password: '',
      passwordAlert: {
        empty: 0,
        notEqual: 0
      },
      repeatPassword: '',
      restaurantName: '',
      type: '1',
      location: '97318',
      times: '',
      adresse: '',
      restaurantSaved: 0,
      inputFieldEmpty: 0,
      userCreated: 0,
      progress: undefined,
      restaurantId: 0,
      mondayFrom: 0,
      mondayTo: 0,
      tuesdayFrom: 0,
      tuesdayTo: 0,
      wednesdayFrom: 0,
      wednesdayTo: 0,
      thursdayFrom: 0,
      thursdayTo: 0,
      fridayFrom: 0,
      fridayTo: 0,
      saturdayFrom: 0,
      saturdayTo: 0,
      sundayFrom: 0,
      sundayTo: 0,
      mondayClosed: false,
      tuesdayClosed: false,
      wednesdayClosed: false,
      thursdayClosed: false,
      fridayClosed: false,
      saturdayClosed: false,
      sundayClosed: false,
      userList: [],
      usernameGivenAlert: 0,
      emailGivenAlert: 0,
      loading: 0
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.handleCheckChange = this.handleCheckChange.bind(this)
    this.saveToDatabase = this.saveToDatabase.bind(this)
    this.register = this.register.bind(this)
  }

  componentDidMount () {
    API.check()
      .then((result) => {
        this.setState({
          userList: result.data
        })
      })
  }

  handleSelectChange (e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleCheckChange (e) {
    this.setState({ [e.target.name]: e.target.checked })
  }

  register () {
    this.setState({
      usernameAlert: 0,
      vornameAlert: 0,
      nachnameAlert: 0,
      emailAlert: 0,
      usernameGivenAlert: 0,
      emailGivenAlert: 0,
      passwordAlert: {
        empty: 0,
        notEqual: 0
      },
      loading: 1
    })
    const checkArray = this.state.userList.map((user) => {
      if (this.state.username === user.username) {
        this.setState({
          usernameGivenAlert: 1
        })
      }
      if (this.state.email === user.email) {
        this.setState({
          emailGivenAlert: 1
        })
      }
    })
    if (!this.state.username) {
      this.setState({
        usernameAlert: 1
      })
    }
    if (!this.state.nachname) {
      this.setState({
        nachnameAlert: 1
      })
    }
    if (!this.state.vorname) {
      this.setState({
        vornameAlert: 1
      })
    }
    if (!this.state.email) {
      this.setState({
        emailAlert: 1
      })
    }
    if (!this.state.password) {
      this.setState({
        passwordAlert: {
          empty: 1,
          notEqual: 0
        }
      })
    } else {
      if (this.state.password !== this.state.repeatPassword) {
        this.setState({
          passwordAlert: {
            empty: 0,
            notEqual: 1
          }
        })
      }
    }
    Promise.all(checkArray).then(() => {
      this.setState({
        loading: 0
      })
      if (this.state.username && (this.state.password !== '' && this.state.password === this.state.repeatPassword) && this.state.email && this.state.vorname && this.state.nachname) {
        this.setState({
          userCreated: 1
        })
      }
    })
  }

  async saveToDatabase () {
    this.setState({
      progress: 1
    })
    if (this.state.restaurantName) {
      this.setState({
        progress: 50
      })
      const times = {
        monday: {closed: this.state.mondayClosed, from: this.state.mondayFrom, to: this.state.mondayTo},
        tuesday: {closed: this.state.tuesdayClosed, from: this.state.tuesdayFrom, to: this.state.tuesdayTo},
        wednesday: {closed: this.state.wednesdayClosed, from: this.state.wednesdayFrom, to: this.state.wednesdayTo},
        thursday: {closed: this.state.thursdayClosed, from: this.state.thursdayFrom, to: this.state.thursdayTo},
        friday: {closed: this.state.fridayClosed, from: this.state.fridayFrom, to: this.state.fridayTo},
        saturday: {closed: this.state.saturdayClosed, from: this.state.saturdayFrom, to: this.state.saturdayTo},
        sunday: {closed: this.state.sundayClosed, from: this.state.sundayFrom, to: this.state.sundayTo}
      }
      API.addRestaurant(this.state.restaurantName, this.state.location, this.state.type, times, this.state.adresse, this.state.vorname, this.state.nachname, this.state.username, this.state.email, this.state.password)
        .then((result) => {
          this.setState({
            restaurantId: result.restaurantId,
            progress: 100,
            restaurantSaved: 1
          })
          store.restaurantId = this.state.restaurantId
        }).catch((error) => {
          // TODO: errorhandling
          console.log(error)
        })
    } else {
      this.setState({
        inputFieldEmpty: 1
      })
    }
  }

  handleChange (e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  render () {
    const passwordAlert = this.state.passwordAlert
    return (
      <div className='font'>
        <Navigation />
        {!this.state.userCreated ? (
          <Card style={{backgroundColor: '#f7f7f7', borderColor: '#f7f7f7'}}>
            <Card className='login' style={{marginTop: 20}}>
              <CardBody className='center'>
                <CardTitle>Registrierung</CardTitle>
              </CardBody>
              <CardBody>
                {this.state.loading ? (
                  <div className='loader'>
                    <Loader color={'#FF8000'} loading={this.state.loading} size={200} />
                  </div>
                ) : (
                  <Form>
                    <FormGroup>
                      <Label for='exampleEmail'>Username</Label>
                      <Input type='text' name='username' value={this.state.username} onChange={this.handleChange} id='exampleUsername' placeholder='EasyCook' />
                    </FormGroup>
                    {this.state.usernameAlert ? (
                      <Alert color='warning' >Bitte Username eingeben!</Alert>
                    ) : ''}
                    {this.state.usernameGivenAlert ? (
                      <Alert color='warning' size='sm'>Dieser Username ist schon vergeben!</Alert>
                    ) : ''}
                    <FormGroup>
                      <Label for='exampleEmail'>Vorname</Label>
                      <Input type='text' name='vorname' value={this.state.vorname} onChange={this.handleChange} id='exampleVorname' placeholder='Stephen' />
                    </FormGroup>
                    {this.state.vornameAlert ? (
                      <Alert color='warning' >Bitte Vornamen eingeben!</Alert>
                    ) : ''}
                    <FormGroup>
                      <Label for='exampleEmail'>Nachname</Label>
                      <Input type='text' name='nachname' value={this.state.nachname} onChange={this.handleChange} id='exampleNachname' placeholder='Cook' />
                    </FormGroup>
                    {this.state.nachnameAlert ? (
                      <Alert color='warning' >Bitte Nachnamen eingeben!</Alert>
                    ) : ''}
                    <FormGroup>
                      <Label for='exampleEmail'>Email</Label>
                      <Input type='email' name='email' value={this.state.email} onChange={this.handleChange} id='exampleEmail' placeholder='barkeeper@restaurant.de' />
                    </FormGroup>
                    {this.state.emailAlert ? (
                      <Alert color='warning' >Bitte Email eingeben!</Alert>
                    ) : ''}
                    {this.state.emailGivenAlert ? (
                      <Alert color='warning' >Diese Email ist schon vergeben!</Alert>
                    ) : ''}
                    <FormGroup inline>
                      <Row>
                        <Col>
                          <Label for='examplePassword'>Passwort</Label>
                          <Input type='password' name='password' invalid={this.state.passwordAlert.empty} value={this.state.password} onChange={this.handleChange} id='examplePassword' placeholder='secret pizza' />
                        </Col>
                        <Col>
                          <Label for='exampleRepeatPassword'>Passwort wiederholen</Label>
                          <Input type='password' name='repeatPassword' invalid={this.state.passwordAlert.notEqual} valid={this.state.password ? this.state.password === this.state.repeatPassword : false} value={this.state.repeatPassword} onChange={this.handleChange} id='exampleRepeatPassword' placeholder='secret pizza' />
                        </Col>
                      </Row>
                    </FormGroup>
                    {passwordAlert.empty ? (
                      <Alert color='warning' >Bitte Passwort eingeben!</Alert>
                    ) : ''}
                    {passwordAlert.notEqual ? (
                      <Alert color='warning' >Eingegebene Passwörter sind nicht identisch!</Alert>
                    ) : ''}
                  </Form>
                )}
                <br />
                <Button color='warning' onClick={this.register} block outline>Registrieren</Button>
              </CardBody>
              <CardBody className='center'>
                <CardText>Sie haben schon ein Konto?</CardText>
                <NavLink color='warning' href='/'><Button color='dark' block outline>Zum Login</Button></NavLink>
              </CardBody>
            </Card>
          </Card>
        ) : (
          <Card style={{backgroundColor: '#f7f7f7', borderColor: '#f7f7f7'}}>
            <Card className='login' style={{marginTop: 20}}>
              <CardBody className='center'>
                <CardTitle>Restaurant anlegen</CardTitle>
              </CardBody>
              <CardBody>
                <Form>
                  <FormGroup>
                    <Label>Restaurantname</Label>
                    <Input type='text' name='restaurantName' value={this.state.restaurantName} onChange={this.state.restaurantSaved ? '' : this.handleChange} placeholder='Restaurantname' />
                    {this.state.inputFieldEmpty ? (
                      <Alert color='warning' >Bitte Restaurantname eingeben!</Alert>
                    ) : ''}
                  </FormGroup>
                  <FormGroup>
                    <Label>Typ</Label>
                    <Input type='select' name='type' value={this.state.type} onChange={this.state.restaurantSaved ? '' : this.handleChange}>
                      <option value='1'>Italienisch</option>
                      <option value='2'>International</option>
                      <option value='3'>Deutsch</option>
                      <option value='4'>Griechisch</option>
                      <option value='5'>Albanisch</option>
                      <option value='6'>Türkisch</option>
                      <option value='7'>Spanisch</option>
                    </Input>
                  </FormGroup>
                  <FormGroup>
                    <Label>Ort</Label>
                    <Input type='select' name='location' value={this.state.location} onChange={this.state.restaurantSaved ? '' : this.handleChange}>
                      <option value='97318'>Kitzingen</option>
                      <option value='97070'>Würzburg</option>
                    </Input>
                  </FormGroup>
                  <FormGroup>
                    <Label>Straße und Hausnummer</Label>
                    <Input type='text' name='adresse' value={this.state.adresse} onChange={this.state.restaurantSaved ? '' : this.handleChange} placeholder='Straße und Hausnummer' />
                  </FormGroup>
                  <FormGroup>
                    <Label>Öffnungszeiten</Label>
                    <Container>
                      <Row>
                        <Col className='col-sm-3'>
                          <p>Tag</p>
                        </Col>
                        <Col className='col-sm-3'>
                          <p>Von</p>
                        </Col>
                        <Col className='col-sm-3'>
                          <p>Bis</p>
                        </Col>
                        <Col className='col-sm-3'>
                          <p>Geschlossen</p>
                        </Col>
                      </Row>
                      <Row>
                        <Col className='col-sm-3'>
                          <Button color='dark' disabled style={{width: 200, height: 40}} outline>Montag</Button>
                        </Col>
                        <Col className='col-sm-3'>
                          <Input type='select' style={{height: 40}} name='mondayFrom' value={this.state.mondayFrom} onChange={this.handleSelectChange}>
                            <option value='0'>00:00</option>
                            <option value='1'>01:00</option>
                            <option value='2'>02:00</option>
                            <option value='3'>03:00</option>
                            <option value='4'>04:00</option>
                            <option value='5'>05:00</option>
                            <option value='6'>06:00</option>
                            <option value='7'>07:00</option>
                            <option value='8'>08:00</option>
                            <option value='9'>09:00</option>
                            <option value='10'>10:00</option>
                            <option value='11'>11:00</option>
                            <option value='12'>12:00</option>
                            <option value='13'>13:00</option>
                            <option value='14'>14:00</option>
                            <option value='15'>15:00</option>
                            <option value='16'>16:00</option>
                            <option value='17'>17:00</option>
                            <option value='18'>18:00</option>
                            <option value='19'>19:00</option>
                            <option value='20'>20:00</option>
                            <option value='21'>21:00</option>
                            <option value='22'>22:00</option>
                            <option value='23'>23:00</option>
                          </Input>
                        </Col>
                        <Col className='col-sm-3'>
                          <Input type='select' style={{height: 40}} name='mondayTo' value={this.state.mondayTo} onChange={this.handleSelectChange}>
                            <option value='0'>00:00</option>
                            <option value='1'>01:00</option>
                            <option value='2'>02:00</option>
                            <option value='3'>03:00</option>
                            <option value='4'>04:00</option>
                            <option value='5'>05:00</option>
                            <option value='6'>06:00</option>
                            <option value='7'>07:00</option>
                            <option value='8'>08:00</option>
                            <option value='9'>09:00</option>
                            <option value='10'>10:00</option>
                            <option value='11'>11:00</option>
                            <option value='12'>12:00</option>
                            <option value='13'>13:00</option>
                            <option value='14'>14:00</option>
                            <option value='15'>15:00</option>
                            <option value='16'>16:00</option>
                            <option value='17'>17:00</option>
                            <option value='18'>18:00</option>
                            <option value='19'>19:00</option>
                            <option value='20'>20:00</option>
                            <option value='21'>21:00</option>
                            <option value='22'>22:00</option>
                            <option value='23'>23:00</option>
                          </Input>
                        </Col>
                        <Col className='col-sm-3'>
                          <Label check>
                            <Input style={{width: 30, height: 30}} name='mondayClosed' checked={this.state.mondayClosed} onChange={this.handleCheckChange} type='checkbox' />{' '}
                          </Label>
                        </Col>
                      </Row>
                      <Row>
                        <Col className='col-sm-3'>
                          <Button color='dark' disabled style={{width: 200, height: 40}} outline>Dienstag</Button>
                        </Col>
                        <Col className='col-sm-3'>
                          <Input type='select' style={{height: 40}} name='tuesdayFrom' value={this.state.tuesdayFrom} onChange={this.handleSelectChange}>
                            <option value='0'>00:00</option>
                            <option value='1'>01:00</option>
                            <option value='2'>02:00</option>
                            <option value='3'>03:00</option>
                            <option value='4'>04:00</option>
                            <option value='5'>05:00</option>
                            <option value='6'>06:00</option>
                            <option value='7'>07:00</option>
                            <option value='8'>08:00</option>
                            <option value='9'>09:00</option>
                            <option value='10'>10:00</option>
                            <option value='11'>11:00</option>
                            <option value='12'>12:00</option>
                            <option value='13'>13:00</option>
                            <option value='14'>14:00</option>
                            <option value='15'>15:00</option>
                            <option value='16'>16:00</option>
                            <option value='17'>17:00</option>
                            <option value='18'>18:00</option>
                            <option value='19'>19:00</option>
                            <option value='20'>20:00</option>
                            <option value='21'>21:00</option>
                            <option value='22'>22:00</option>
                            <option value='23'>23:00</option>
                          </Input>
                        </Col>
                        <Col className='col-sm-3'>
                          <Input type='select' style={{height: 40}} name='tuesdayTo' value={this.state.tuesdayTo} onChange={this.handleSelectChange}>
                            <option value='0'>00:00</option>
                            <option value='1'>01:00</option>
                            <option value='2'>02:00</option>
                            <option value='3'>03:00</option>
                            <option value='4'>04:00</option>
                            <option value='5'>05:00</option>
                            <option value='6'>06:00</option>
                            <option value='7'>07:00</option>
                            <option value='8'>08:00</option>
                            <option value='9'>09:00</option>
                            <option value='10'>10:00</option>
                            <option value='11'>11:00</option>
                            <option value='12'>12:00</option>
                            <option value='13'>13:00</option>
                            <option value='14'>14:00</option>
                            <option value='15'>15:00</option>
                            <option value='16'>16:00</option>
                            <option value='17'>17:00</option>
                            <option value='18'>18:00</option>
                            <option value='19'>19:00</option>
                            <option value='20'>20:00</option>
                            <option value='21'>21:00</option>
                            <option value='22'>22:00</option>
                            <option value='23'>23:00</option>
                          </Input>
                        </Col>
                        <Col className='col-sm-3'>
                          <Label check>
                            <Input style={{width: 30, height: 30}} name='tuesdayClosed' checked={this.state.tuesdayClosed} onChange={this.handleCheckChange} type='checkbox' />{' '}
                          </Label>
                        </Col>
                      </Row>
                      <Row>
                        <Col className='col-sm-3'>
                          <Button color='dark' disabled style={{width: 200, height: 40}} outline>Mittwoch</Button>
                        </Col>
                        <Col className='col-sm-3'>
                          <Input type='select' style={{height: 40}} name='wednesdayFrom' value={this.state.wednesdayFrom} onChange={this.handleSelectChange}>
                            <option value='0'>00:00</option>
                            <option value='1'>01:00</option>
                            <option value='2'>02:00</option>
                            <option value='3'>03:00</option>
                            <option value='4'>04:00</option>
                            <option value='5'>05:00</option>
                            <option value='6'>06:00</option>
                            <option value='7'>07:00</option>
                            <option value='8'>08:00</option>
                            <option value='9'>09:00</option>
                            <option value='10'>10:00</option>
                            <option value='11'>11:00</option>
                            <option value='12'>12:00</option>
                            <option value='13'>13:00</option>
                            <option value='14'>14:00</option>
                            <option value='15'>15:00</option>
                            <option value='16'>16:00</option>
                            <option value='17'>17:00</option>
                            <option value='18'>18:00</option>
                            <option value='19'>19:00</option>
                            <option value='20'>20:00</option>
                            <option value='21'>21:00</option>
                            <option value='22'>22:00</option>
                            <option value='23'>23:00</option>
                          </Input>
                        </Col>
                        <Col className='col-sm-3'>
                          <Input type='select' style={{height: 40}} name='wednesdayTo' value={this.state.wednesdayTo} onChange={this.handleSelectChange}>
                            <option value='0'>00:00</option>
                            <option value='1'>01:00</option>
                            <option value='2'>02:00</option>
                            <option value='3'>03:00</option>
                            <option value='4'>04:00</option>
                            <option value='5'>05:00</option>
                            <option value='6'>06:00</option>
                            <option value='7'>07:00</option>
                            <option value='8'>08:00</option>
                            <option value='9'>09:00</option>
                            <option value='10'>10:00</option>
                            <option value='11'>11:00</option>
                            <option value='12'>12:00</option>
                            <option value='13'>13:00</option>
                            <option value='14'>14:00</option>
                            <option value='15'>15:00</option>
                            <option value='16'>16:00</option>
                            <option value='17'>17:00</option>
                            <option value='18'>18:00</option>
                            <option value='19'>19:00</option>
                            <option value='20'>20:00</option>
                            <option value='21'>21:00</option>
                            <option value='22'>22:00</option>
                            <option value='23'>23:00</option>
                          </Input>
                        </Col>
                        <Col className='col-sm-3'>
                          <Label check>
                            <Input style={{width: 30, height: 30}} name='wednesdayClosed' checked={this.state.wednesdayClosed} onChange={this.handleCheckChange} type='checkbox' />{' '}
                          </Label>
                        </Col>
                      </Row>
                      <Row>
                        <Col className='col-sm-3'>
                          <Button color='dark' disabled style={{width: 200, height: 40}} outline>Donnerstag</Button>
                        </Col>
                        <Col className='col-sm-3'>
                          <Input type='select' style={{height: 40}} name='thursdayFrom' value={this.state.thursdayFrom} onChange={this.handleSelectChange}>
                            <option value='0'>00:00</option>
                            <option value='1'>01:00</option>
                            <option value='2'>02:00</option>
                            <option value='3'>03:00</option>
                            <option value='4'>04:00</option>
                            <option value='5'>05:00</option>
                            <option value='6'>06:00</option>
                            <option value='7'>07:00</option>
                            <option value='8'>08:00</option>
                            <option value='9'>09:00</option>
                            <option value='10'>10:00</option>
                            <option value='11'>11:00</option>
                            <option value='12'>12:00</option>
                            <option value='13'>13:00</option>
                            <option value='14'>14:00</option>
                            <option value='15'>15:00</option>
                            <option value='16'>16:00</option>
                            <option value='17'>17:00</option>
                            <option value='18'>18:00</option>
                            <option value='19'>19:00</option>
                            <option value='20'>20:00</option>
                            <option value='21'>21:00</option>
                            <option value='22'>22:00</option>
                            <option value='23'>23:00</option>
                          </Input>
                        </Col>
                        <Col className='col-sm-3'>
                          <Input type='select' style={{height: 40}} name='thursdayTo' value={this.state.thursdayTo} onChange={this.handleSelectChange}>
                            <option value='0'>00:00</option>
                            <option value='1'>01:00</option>
                            <option value='2'>02:00</option>
                            <option value='3'>03:00</option>
                            <option value='4'>04:00</option>
                            <option value='5'>05:00</option>
                            <option value='6'>06:00</option>
                            <option value='7'>07:00</option>
                            <option value='8'>08:00</option>
                            <option value='9'>09:00</option>
                            <option value='10'>10:00</option>
                            <option value='11'>11:00</option>
                            <option value='12'>12:00</option>
                            <option value='13'>13:00</option>
                            <option value='14'>14:00</option>
                            <option value='15'>15:00</option>
                            <option value='16'>16:00</option>
                            <option value='17'>17:00</option>
                            <option value='18'>18:00</option>
                            <option value='19'>19:00</option>
                            <option value='20'>20:00</option>
                            <option value='21'>21:00</option>
                            <option value='22'>22:00</option>
                            <option value='23'>23:00</option>
                          </Input>
                        </Col>
                        <Col className='col-sm-3'>
                          <Label check>
                            <Input style={{width: 30, height: 30}} name='thursdayClosed' checked={this.state.thursdayClosed} onChange={this.handleCheckChange} type='checkbox' />{' '}
                          </Label>
                        </Col>
                      </Row>
                      <Row>
                        <Col className='col-sm-3'>
                          <Button color='dark' disabled style={{width: 200, height: 40}} outline>Freitag</Button>
                        </Col>
                        <Col className='col-sm-3'>
                          <Input type='select' style={{height: 40}} name='fridayFrom' value={this.state.fridayFrom} onChange={this.handleSelectChange}>
                            <option value='0'>00:00</option>
                            <option value='1'>01:00</option>
                            <option value='2'>02:00</option>
                            <option value='3'>03:00</option>
                            <option value='4'>04:00</option>
                            <option value='5'>05:00</option>
                            <option value='6'>06:00</option>
                            <option value='7'>07:00</option>
                            <option value='8'>08:00</option>
                            <option value='9'>09:00</option>
                            <option value='10'>10:00</option>
                            <option value='11'>11:00</option>
                            <option value='12'>12:00</option>
                            <option value='13'>13:00</option>
                            <option value='14'>14:00</option>
                            <option value='15'>15:00</option>
                            <option value='16'>16:00</option>
                            <option value='17'>17:00</option>
                            <option value='18'>18:00</option>
                            <option value='19'>19:00</option>
                            <option value='20'>20:00</option>
                            <option value='21'>21:00</option>
                            <option value='22'>22:00</option>
                            <option value='23'>23:00</option>
                          </Input>
                        </Col>
                        <Col className='col-sm-3'>
                          <Input type='select' style={{height: 40}} name='fridayTo' value={this.state.fridayTo} onChange={this.handleSelectChange}>
                            <option value='0'>00:00</option>
                            <option value='1'>01:00</option>
                            <option value='2'>02:00</option>
                            <option value='3'>03:00</option>
                            <option value='4'>04:00</option>
                            <option value='5'>05:00</option>
                            <option value='6'>06:00</option>
                            <option value='7'>07:00</option>
                            <option value='8'>08:00</option>
                            <option value='9'>09:00</option>
                            <option value='10'>10:00</option>
                            <option value='11'>11:00</option>
                            <option value='12'>12:00</option>
                            <option value='13'>13:00</option>
                            <option value='14'>14:00</option>
                            <option value='15'>15:00</option>
                            <option value='16'>16:00</option>
                            <option value='17'>17:00</option>
                            <option value='18'>18:00</option>
                            <option value='19'>19:00</option>
                            <option value='20'>20:00</option>
                            <option value='21'>21:00</option>
                            <option value='22'>22:00</option>
                            <option value='23'>23:00</option>
                          </Input>
                        </Col>
                        <Col className='col-sm-3'>
                          <Label check>
                            <Input style={{width: 30, height: 30}} name='fridayClosed' checked={this.state.fridayClosed} onChange={this.handleCheckChange} type='checkbox' />{' '}
                          </Label>
                        </Col>
                      </Row>
                      <Row>
                        <Col className='col-sm-3'>
                          <Button color='dark' disabled style={{width: 200, height: 40}} outline>Samstag</Button>
                        </Col>
                        <Col className='col-sm-3'>
                          <Input type='select' style={{height: 40}} name='saturdayFrom' value={this.state.saturdayFrom} onChange={this.handleSelectChange}>
                            <option value='0'>00:00</option>
                            <option value='1'>01:00</option>
                            <option value='2'>02:00</option>
                            <option value='3'>03:00</option>
                            <option value='4'>04:00</option>
                            <option value='5'>05:00</option>
                            <option value='6'>06:00</option>
                            <option value='7'>07:00</option>
                            <option value='8'>08:00</option>
                            <option value='9'>09:00</option>
                            <option value='10'>10:00</option>
                            <option value='11'>11:00</option>
                            <option value='12'>12:00</option>
                            <option value='13'>13:00</option>
                            <option value='14'>14:00</option>
                            <option value='15'>15:00</option>
                            <option value='16'>16:00</option>
                            <option value='17'>17:00</option>
                            <option value='18'>18:00</option>
                            <option value='19'>19:00</option>
                            <option value='20'>20:00</option>
                            <option value='21'>21:00</option>
                            <option value='22'>22:00</option>
                            <option value='23'>23:00</option>
                          </Input>
                        </Col>
                        <Col className='col-sm-3'>
                          <Input type='select' style={{height: 40}} name='saturdayTo' value={this.state.saturdayTo} onChange={this.handleSelectChange}>
                            <option value='0'>00:00</option>
                            <option value='1'>01:00</option>
                            <option value='2'>02:00</option>
                            <option value='3'>03:00</option>
                            <option value='4'>04:00</option>
                            <option value='5'>05:00</option>
                            <option value='6'>06:00</option>
                            <option value='7'>07:00</option>
                            <option value='8'>08:00</option>
                            <option value='9'>09:00</option>
                            <option value='10'>10:00</option>
                            <option value='11'>11:00</option>
                            <option value='12'>12:00</option>
                            <option value='13'>13:00</option>
                            <option value='14'>14:00</option>
                            <option value='15'>15:00</option>
                            <option value='16'>16:00</option>
                            <option value='17'>17:00</option>
                            <option value='18'>18:00</option>
                            <option value='19'>19:00</option>
                            <option value='20'>20:00</option>
                            <option value='21'>21:00</option>
                            <option value='22'>22:00</option>
                            <option value='23'>23:00</option>
                          </Input>
                        </Col>
                        <Col className='col-sm-3'>
                          <Label check>
                            <Input style={{width: 30, height: 30}} name='saturdayClosed' checked={this.state.saturdayClosed} onChange={this.handleCheckChange} type='checkbox' />{' '}
                          </Label>
                        </Col>
                      </Row>
                      <Row>
                        <Col className='col-sm-3'>
                          <Button color='dark' disabled style={{width: 200, height: 40}} outline>Sonntag</Button>
                        </Col>
                        <Col className='col-sm-3'>
                          <Input type='select' style={{height: 40}} name='sundayFrom' value={this.state.sundayFrom} onChange={this.handleSelectChange}>
                            <option value='0'>00:00</option>
                            <option value='1'>01:00</option>
                            <option value='2'>02:00</option>
                            <option value='3'>03:00</option>
                            <option value='4'>04:00</option>
                            <option value='5'>05:00</option>
                            <option value='6'>06:00</option>
                            <option value='7'>07:00</option>
                            <option value='8'>08:00</option>
                            <option value='9'>09:00</option>
                            <option value='10'>10:00</option>
                            <option value='11'>11:00</option>
                            <option value='12'>12:00</option>
                            <option value='13'>13:00</option>
                            <option value='14'>14:00</option>
                            <option value='15'>15:00</option>
                            <option value='16'>16:00</option>
                            <option value='17'>17:00</option>
                            <option value='18'>18:00</option>
                            <option value='19'>19:00</option>
                            <option value='20'>20:00</option>
                            <option value='21'>21:00</option>
                            <option value='22'>22:00</option>
                            <option value='23'>23:00</option>
                          </Input>
                        </Col>
                        <Col className='col-sm-3'>
                          <Input type='select' style={{height: 40}} name='sundayTo' value={this.state.sundayTo} onChange={this.handleSelectChange}>
                            <option value='0'>00:00</option>
                            <option value='1'>01:00</option>
                            <option value='2'>02:00</option>
                            <option value='3'>03:00</option>
                            <option value='4'>04:00</option>
                            <option value='5'>05:00</option>
                            <option value='6'>06:00</option>
                            <option value='7'>07:00</option>
                            <option value='8'>08:00</option>
                            <option value='9'>09:00</option>
                            <option value='10'>10:00</option>
                            <option value='11'>11:00</option>
                            <option value='12'>12:00</option>
                            <option value='13'>13:00</option>
                            <option value='14'>14:00</option>
                            <option value='15'>15:00</option>
                            <option value='16'>16:00</option>
                            <option value='17'>17:00</option>
                            <option value='18'>18:00</option>
                            <option value='19'>19:00</option>
                            <option value='20'>20:00</option>
                            <option value='21'>21:00</option>
                            <option value='22'>22:00</option>
                            <option value='23'>23:00</option>
                          </Input>
                        </Col>
                        <Col className='col-sm-3'>
                          <Label check>
                            <Input style={{width: 30, height: 30}} name='sundayClosed' checked={this.state.sundayClosed} onChange={this.handleCheckChange} type='checkbox' />{' '}
                          </Label>
                        </Col>
                      </Row>
                    </Container>
                  </FormGroup>
                </Form>
                <CardBody className='center'>
                  {!this.state.restaurantSaved
                    ? !this.state.progress ? (
                      <Button color='warning' onClick={() => this.saveToDatabase()} block outline>Restaurant anlegen</Button>
                    ) : (
                      <div>
                        <Progress color='warning' value={this.state.progress} />
                      </div>
                    ) : (
                      <NavLink color='warning' href='/index'><Button color='warning' block outline>Weiter zum Login</Button></NavLink>
                    )}
                </CardBody>
              </CardBody>
            </Card>
          </Card>
        )}
      </div>
    )
  }
}
