import React from 'react'
import { Alert, Card, Collapse, CardText, CardBody, Form, FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter, Input, Button, Col, Row, Table } from 'reactstrap'
import store from '../store/store'
import Edit from 'react-icons/lib/md/edit'

export default class CardInput extends React.Component {
  constructor () {
    super()
    this.state = {
      meal: '',
      description: '',
      mealType: '1',
      price: '',
      editMeal: '',
      editDescription: '',
      editPrice: '',
      editMealType: '',
      input: [],
      collapse: false,
      showMealAlert: 0,
      showPriceAlert: 0,
      modal: false,
      editIndex: 0
    }
    this.addMeal = this.addMeal.bind(this)
    this.toggle = this.toggle.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.editMeal = this.editMeal.bind(this)
  }

  addMeal () {
    const meal = this.state.meal
    const description = this.state.description
    const mealType = this.state.mealType
    const price = this.state.price
    const item = {
      meal, description, mealType, price
    }
    if (meal && price && mealType) {
      this.state.input.push(item)
      store.speisekartenInformationen.speisen = this.state.input
      store.speisenLock = true
      this.setState({
        meal: '',
        description: '',
        mealType: '1',
        price: '',
        picture: ''
      })
    } else if (!price && !meal) {
      this.setState({
        showMealAlert: 1,
        showPriceAlert: 1
      })
    } else if (!meal) {
      this.setState({
        showMealAlert: 1
      })
    } else if (!price) {
      this.setState({
        showPriceAlert: 1
      })
    }
  }

  toggle () {
    this.setState({ collapse: !this.state.collapse })
  }

  toggleModal (item = null) {
    this.setState({
      modal: !this.state.modal,
      editIndex: this.state.input.indexOf(item),
      editMeal: item.meal,
      editDescription: item.description,
      editPrice: item.price,
      editMealType: item.mealType
    })
  }

  editMeal () {
    const mealType = this.state.editMealType
    const meal = this.state.editMeal
    const price = this.state.editPrice
    const description = this.state.editDescription
    const editItem = {
      meal, description, mealType, price
    }
    const index = this.state.editIndex
    this.state.input[index] = editItem
    store.speisekartenInformationen.speisen = this.state.input
    this.setState({
      modal: !this.state.modal,
      editMeal: '',
      editDescription: '',
      editPrice: '',
      editMealType: ''
    })
  }

  handleChange (e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  render () {
    return (
      <Card>
        <CardBody>
          <Button outline color='dark' onClick={this.toggle} style={{ marginBottom: '1rem' }} block>Speisen hinzufügen</Button>
          <Collapse isOpen={this.state.collapse}>
            <CardText>
              <Col>
                <Row>
                  <Col className={this.state.input[0] ? 'col-sm-6' : 'col-sm-12'}>
                    <Form>
                      <div>
                        <FormGroup>
                          <Label>Speise</Label>
                          <Input type='text' name='meal' value={this.state.meal} onChange={this.handleChange} placeholder='Name der Speise' />
                          {this.state.showMealAlert ? <Alert size='sm' color='warning'>Bitte geben Sie den Namen der Speise ein</Alert> : ''}
                        </FormGroup>
                        <FormGroup>
                          <Label>Beschreibung</Label>
                          <Input type='textarea' name='description' value={this.state.description} onChange={this.handleChange} placeholder='optional' />
                        </FormGroup>
                        <FormGroup>
                          <Label>Typ</Label>
                          <Input type='select' name='mealType' value={this.state.mealType} onChange={this.handleChange}>
                            <option value='1'>Speise</option>
                            <option value='2'>Getränk</option>
                            <option value='3'>Dessert</option>
                          </Input>
                        </FormGroup>
                        <FormGroup>
                          <Label>Preis</Label>
                          <Input type='number' name='price' value={this.state.price} onChange={this.handleChange} placeholder='7.50' />
                          {this.state.showPriceAlert ? <Alert size='sm' color='warning'>Bitte geben Sie den Preis ein</Alert> : ''}
                        </FormGroup>
                        <Button outline color='warning' onClick={this.addMeal} block>Hinzufügen</Button>
                        <br />
                      </div>
                    </Form>
                  </Col>
                  <Col className='col-sm-6'>
                    <Table>
                      {this.state.input[0] ? (<thead>Speisen</thead>) : ''}
                      {this.state.input.map((item) => (
                        <tbody>
                          <tr>
                            <td> {item.meal}</td>
                            <td> {item.price + ' €'}</td>
                            <div>
                              <Edit onClick={() => this.toggleModal(item)} />
                              <Modal size='lg' isOpen={this.state.modal} toggle={() => this.toggleModal()}>
                                <ModalHeader style={{backgroundColor: '#f7f7f7', alignItems: 'center', justifyContent: 'center'}}>Eintrag bearbeiten</ModalHeader>
                                <ModalBody style={{backgroundColor: '#f7f7f7'}}>
                                  <Form>
                                    <div>
                                      <FormGroup>
                                        <Label>Speise</Label>
                                        <Input type='text' name='editMeal' value={this.state.editMeal} onChange={this.handleChange} placeholder={item.meal} />
                                      </FormGroup>
                                      <FormGroup>
                                        <Label>Beschreibung</Label>
                                        <Input type='textarea' name='editDescription' value={this.state.editDescription} onChange={this.handleChange} placeholder={item.description} />
                                      </FormGroup>
                                      <FormGroup>
                                        <Label>Typ</Label>
                                        <Input type='select' name='editMealType' value={this.state.editMealType} onChange={this.handleChange} placeholder={item.mealType} >
                                          <option value='1'>Speise</option>
                                          <option value='2'>Getränk</option>
                                          <option value='3'>Dessert</option>
                                        </Input>
                                      </FormGroup>
                                      <FormGroup>
                                        <Label>Preis</Label>
                                        <Input type='number' name='editPrice' value={this.state.editPrice} onChange={this.handleChange} placeholder={item.price} />
                                      </FormGroup>
                                    </div>
                                  </Form>
                                </ModalBody>
                                <ModalFooter style={{backgroundColor: '#f7f7f7'}}>
                                  <Button outline color='warning' onClick={() => this.editMeal()}>Ändern</Button>{' '}
                                  <Button outline color='dark' onClick={() => this.setState({ modal: false })}>Abbrechen</Button>
                                </ModalFooter>
                              </Modal>
                            </div>
                          </tr>
                        </tbody>
                      ))}
                    </Table>
                  </Col>
                </Row>
              </Col>
            </CardText>
          </Collapse>
        </CardBody>
      </Card>
    )
  }
}
