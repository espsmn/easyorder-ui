/* global */
import React from 'react'
import { Card, CardBody, Button, Modal, Tooltip, ModalHeader, ModalBody, ModalFooter, Table, Form, FormGroup, Label, Input, Alert } from 'reactstrap'
import Edit from 'react-icons/lib/md/edit'
import Ready from 'react-icons/lib/md/check'
import Picture from 'react-icons/lib/md/camera-alt'
import Delete from 'react-icons/lib/md/delete-forever'
import API from '../config/easyorder-api'
import Loader from '../components/Loader'
import Uploader from '../components/MealPicUploader'
import mockSpeisekarte from '../mock/dashboard/speisekarte'
import Plus from 'react-icons/lib/md/add'

export default class MenuEdit extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      editModal: false,
      meals: [],
      editItem: {},
      editMeal: '',
      editDescription: '',
      editPrice: '',
      editMealPicture: '',
      editMealType: '1',
      loading: 1,
      editMealEmpty: 0,
      editDescriptionEmpty: 0,
      editPriceEmpty: 0,
      modal: 0,
      addModal: 0,
      pictureModal: 0,
      deleteModal: 0,
      pictureModalLoading: 1,
      currentMealId: null,
      image: null,
      newDescription: '',
      newMealType: '1',
      newMeal: '',
      newPrice: '',
      showPriceAlert: 0,
      showMealAlert: 0,
      addTooltipOpen: 0
    }
    this.handleChange = this.handleChange.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
    this.editMeal = this.editMeal.bind(this)
    this.toggleDelete = this.toggleDelete.bind(this)
    this.deleteMenu = this.deleteMenu.bind(this)
    this.togglePictureModal = this.togglePictureModal.bind(this)
    this.toggleDeleteModal = this.toggleDeleteModal.bind(this)
    this.onPictureClick = this.onPictureClick.bind(this)
    this.onDeleteClick = this.onDeleteClick.bind(this)
    this.toggleAddModal = this.toggleAddModal.bind(this)
    this.addMeal = this.addMeal.bind(this)
    this.addToggle = this.addToggle.bind(this)
  }

  addToggle () {
    this.setState({
      addTooltipOpen: !this.state.addTooltipOpen
    })
  }

  addMeal () {
    if (this.state.newMeal && this.state.newPrice) {
      let mealArray = []
      mealArray.push({
        name: this.state.newMeal,
        beschreibung: this.state.newDescription,
        preis: this.state.newPrice,
        skid: this.props.menuId,
        stypid: this.state.newMealType
      })
      API.addMealsToMenu(mealArray).then(() => {
        this.setState({
          newMeal: '',
          newDescription: '',
          newMealType: '1',
          newPrice: '',
          loading: 1
        })
        API.getMeals(this.props.menuId)
          .then((fetchedMeals) => {
            this.setState({
              meals: fetchedMeals,
              loading: 0,
              addModal: 0
            })
          }).catch(() => {
            this.setState({
              loading: 0
            })
          })
      })
    } else if (!this.state.newPrice && !this.state.newMeal) {
      this.setState({
        showMealAlert: 1,
        showPriceAlert: 1
      })
    } else if (!this.state.newMeal) {
      this.setState({
        showMealAlert: 1
      })
    } else if (!this.state.newPrice) {
      this.setState({
        showPriceAlert: 1
      })
    }
  }

  toggleDelete () {
    this.setState({
      modal: !this.state.modal
    })
  }

  toggleAddModal () {
    this.setState({
      addModal: !this.state.addModal
    })
  }

  onDeleteClick (speisenId) {
    if (!this.state.deleteModal) {
      this.setState({
        currentMealId: speisenId
      })
      this.toggleDeleteModal()
    } else {
      this.toggleDeleteModal()
    }
  }

  onPictureClick (speisenId) {
    if (!this.state.pictureModal) {
      API.getMealPicture(speisenId)
        .then((response) => {
          this.togglePictureModal()
          this.setState({
            pictureModalLoading: 0,
            currentMealId: speisenId,
            image: response ? ('data:image/jpeg;base64,' + response) : null
          })
        }).catch((error) => {
          console.log(error)
        })
    } else {
      this.togglePictureModal()
    }
  }

  toggleDeleteModal () {
    this.setState({
      deleteModal: !this.state.deleteModal
    })
  }

  togglePictureModal () {
    this.setState({
      pictureModal: !this.state.pictureModal
    })
  }

  deleteMenu () {
    API.deleteMenu(this.props.menuId)
      .then(() => {
        window.location.href = this.props.path
      }).catch((error) => {
        console.log(error)
      })
  }

  deleteMeal () {
    API.deleteMeal(this.state.currentMealId)
      .then(() => {
        window.location.href = this.props.path
      }).catch((error) => {
        console.log(error)
      })
  }

  toggleModal (meal = null) {
    this.setState({
      editItem: meal,
      editModal: !this.state.editModal
    })
  }

  editMeal (speisenId) {
    if (!this.state.editMeal) {
      this.setState({
        editMealEmpty: 1
      })
    } else if (!this.state.editDescription) {
      this.setState({
        editDescriptionEmpty: 1
      })
    } else if (!this.state.editPrice) {
      this.setState({
        editPriceEmpty: 1
      })
    } else {
      API.editMeal(this.state.editMeal, this.state.editDescription, this.state.editPrice, speisenId, this.state.editMealType, this.state.editMealPicture)
        .then(() => {
          this.setState({
            modal: false,
            editModal: false
          })
          window.location.href = this.props.path
        })
    }
  }

  componentDidMount () {
    API.getMeals(this.props.menuId)
      .then((fetchedMeals) => {
        this.setState({
          meals: fetchedMeals,
          loading: 0
        })
      }).catch((e) => {
        console.log(e, '--> benutze Mockdaten')
        this.setState({
          meals: mockSpeisekarte,
          loading: 0
        })
      })
  }

  handleChange (e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  render () {
    const currentMealId = this.state.currentMealId ? this.state.currentMealId : null
    const image = this.state.image ? this.state.image : null
    return (
      <div>
        {this.state.loading ? (
          <Loader color={'#FF8000'} loading={this.state.loading} size={200} />
        ) : (
          <Card style={{backgroundColor: '#f7f7f7'}}>
            <CardBody className='text-center login' style={{height: '92%'}} onClick={this.props.onClick}>
              <h2>Karte <Button style={{borderWidth: 1, alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 40}} onClick={this.toggleDelete} outline color='dark' size='sm'><Delete style={{width: 20, height: 20}} /></Button></h2>
              <Modal isOpen={this.state.modal} toggleDelete={this.toggleDelete} className={this.props.className}>
                <ModalHeader toggleDelete={this.toggleDelete} className='center'>Karte löschen</ModalHeader>
                <ModalBody>
                  Sind Sie sich sicher, dass Sie die Karte löschen möchten?
                </ModalBody>
                <ModalFooter>
                  <Button outline color='danger' onClick={this.deleteMenu}>Löschen <Delete /></Button>{' '}
                  <Button outline color='dark' onClick={this.toggleDelete}>Abbrechen</Button>
                </ModalFooter>
              </Modal>
              <br />
              <Card>
                <Table>
                  {this.state.meals[0] ? this.state.meals.map((meal) => (
                    <tbody>
                      <tr >
                        <td className='text-left'>{meal.name}</td>
                        <td className='text-left'>{meal.beschreibung}</td>
                        <td>{meal.preis + ' €'}</td>
                        <div className='text-right'>
                          <Button style={{borderWidth: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff'}} outline color='link' onClick={() => this.onPictureClick(meal.s_id)}><Picture /></Button>
                          <Button style={{borderWidth: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff'}} outline color='link' onClick={() => this.toggleModal(meal)}><Edit /></Button>
                          <Button style={{borderWidth: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff'}} outline color='link' onClick={() => this.onDeleteClick(meal.s_id)}><Delete /></Button>
                        </div>
                        <Modal isOpen={this.state.deleteModal} toggleDelete={this.toggleDeleteModal} className={this.props.className}>
                          <ModalHeader toggleDelete={this.toggleDeleteModal} className='center'>Speise löschen</ModalHeader>
                          <ModalBody>Sind Sie sich sicher, dass Sie die Speise löschen möchten?</ModalBody>
                          <ModalFooter>
                            <Button outline color='danger' onClick={() => this.deleteMeal()}>Löschen <Delete /></Button>{' '}
                            <Button outline color='dark' onClick={this.toggleDeleteModal}>Abbrechen</Button>
                          </ModalFooter>
                        </Modal>
                        <Modal size='lg' isOpen={this.state.pictureModal} toggle={this.togglePictureModal}>
                          <ModalHeader style={{backgroundColor: '#f7f7f7', alignItems: 'center', justifyContent: 'center'}}>Bild zur Speise hinzufügen</ModalHeader>
                          <ModalBody>
                            {this.state.pictureModalLoading ? (<Loader />) : (
                              <Uploader width='400px' height='200px' image={image} mealId={currentMealId} />
                            )}
                          </ModalBody>
                          <ModalFooter style={{backgroundColor: '#f7f7f7'}}>
                            <Button outline color='warning' onClick={() => this.setState({ pictureModal: 0 })}>Fertig</Button>{' '}
                            <Button outline color='dark' onClick={this.togglePictureModal}>Abbrechen</Button>
                          </ModalFooter>
                        </Modal>
                        <Modal size='lg' isOpen={this.state.editModal} toggle={this.toggleModal}>
                          <ModalHeader style={{backgroundColor: '#f7f7f7', alignItems: 'center', justifyContent: 'center'}}>Eintrag bearbeiten</ModalHeader>
                          <ModalBody style={{backgroundColor: '#f7f7f7'}}>
                            <Form>
                              <div>
                                <FormGroup>
                                  <Label>Speise</Label>
                                  <Input type='text' name='editMeal' value={this.state.editMeal} onChange={this.handleChange} placeholder={this.state.editItem.name} />
                                  {this.state.editMealEmpty ? (
                                    <Alert color='warning' >Bitte einen Speisennamen eingeben!</Alert>
                                  ) : ''}
                                </FormGroup>
                                <FormGroup>
                                  <Label>Beschreibung</Label>
                                  <Input type='textarea' name='editDescription' value={this.state.editDescription} onChange={this.handleChange} placeholder={this.state.editItem.beschreibung} />
                                  {this.state.editDescriptionEmpty ? (
                                    <Alert color='warning' >Bitte eine Beschreibung eingeben!</Alert>
                                  ) : ''}
                                </FormGroup>
                                <FormGroup>
                                  <Label>Typ</Label>
                                  <Input type='select' name='editMealType' value={this.state.editMealType} onChange={this.handleChange} placeholder={this.state.editItem.styp_id} >
                                    <option value='1'>Speise</option>
                                    <option value='2'>Getränk</option>
                                    <option value='3'>Dessert</option>
                                  </Input>
                                </FormGroup>
                                <FormGroup>
                                  <Label>Preis</Label>
                                  <Input type='number' name='editPrice' value={this.state.editPrice} onChange={this.handleChange} placeholder={this.state.editItem.preis} />
                                  {this.state.editPriceEmpty ? (
                                    <Alert color='warning' >Bitte einen Preis eingeben!</Alert>
                                  ) : ''}
                                </FormGroup>
                              </div>
                            </Form>
                          </ModalBody>
                          <ModalFooter style={{backgroundColor: '#f7f7f7'}}>
                            <Button outline color='warning' onClick={() => this.editMeal(this.state.editItem.s_id)}>Ändern</Button>{' '}
                            <Button outline color='dark' onClick={() => this.setState({ editModal: false })}>Abbrechen</Button>
                          </ModalFooter>
                        </Modal>
                      </tr>
                    </tbody>
                  )) : <p>Diese Speisekarte ist leer!</p>}
                </Table>
              </Card>
              <div className='text-center'>
                <Button size='lg' outline color='#f7f7f7' id='TooltipExample' className='float-right' onClick={this.toggleAddModal} style={{borderWidth: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f7f7f7'}}><Plus /></Button>
                <Tooltip placement='left' isOpen={this.state.addTooltipOpen} target='TooltipExample' toggle={this.addToggle}>
                  Hier können Sie Speisen hinzufügen!
                </Tooltip>
                <br />
              </div>
              <Modal size='lg' isOpen={this.state.addModal} toggle={this.toggleAddModal}>
                <ModalHeader style={{backgroundColor: '#f7f7f7', alignItems: 'center', justifyContent: 'center'}}>Speise hinzufügen</ModalHeader>
                <ModalBody style={{backgroundColor: '#f7f7f7'}}>
                  <Form>
                    <FormGroup>
                      <Label>Speise</Label>
                      <Input type='text' name='newMeal' value={this.state.newMeal} onChange={this.handleChange} placeholder='Name der Speise' />
                      {this.state.showMealAlert ? <Alert size='sm' color='warning'>Bitte geben Sie den Namen der Speise ein</Alert> : ''}
                    </FormGroup>
                    <FormGroup>
                      <Label>Beschreibung</Label>
                      <Input type='textarea' name='newDescription' value={this.state.newDescription} onChange={this.handleChange} placeholder='optional' />
                    </FormGroup>
                    <FormGroup>
                      <Label>Typ</Label>
                      <Input type='select' name='newMealType' value={this.state.newMealType} onChange={this.handleChange}>
                        <option value='1'>Speise</option>
                        <option value='2'>Getränk</option>
                        <option value='3'>Dessert</option>
                      </Input>
                    </FormGroup>
                    <FormGroup>
                      <Label>Preis</Label>
                      <Input type='number' name='newPrice' value={this.state.newPrice} onChange={this.handleChange} placeholder='7.50' />
                      {this.state.showPriceAlert ? <Alert size='sm' color='warning'>Bitte geben Sie den Preis ein</Alert> : ''}
                    </FormGroup>
                  </Form>
                </ModalBody>
                <ModalFooter style={{backgroundColor: '#f7f7f7'}}>
                  <Button outline color='warning' onClick={this.addMeal}>Hinzufügen</Button>{' '}
                  <Button outline color='dark' onClick={this.toggleAddModal}>Abbrechen</Button>
                </ModalFooter>
              </Modal>
              <br />
              <div className='text-right'>
                <Button outline color='dark' href={this.props.path}>Fertig <Ready /></Button>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    )
  }
}
