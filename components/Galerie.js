/* global FileReader FormData */
import React from 'react'
import { Form, FormGroup, Modal, ModalHeader, ModalBody, Input, Button, Alert, Col, Row, ModalFooter } from 'reactstrap'
import Img from 'react-image'
import API from '../config/easyorder-api'
import Upload from 'react-icons/lib/fa/upload'
import Delete from 'react-icons/lib/md/delete-forever'
import CardAdder from './CardAdder'
import { Buffer } from 'safe-buffer'

export default class Galerie extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedFile: null,
      imagePreviewUrl: '../static/default.jpg',
      uploaded: 0,
      modal: false,
      deleteModal: false,
      success: 0,
      chosenPicture: null
    }
    this.fileSelectedHandler = this.fileSelectedHandler.bind(this)
    this.fileUploadHandler = this.fileUploadHandler.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
    this.toggleDeleteModal = this.toggleDeleteModal.bind(this)
    this.deletePicture = this.deletePicture.bind(this)
    this.toggleAndDelete = this.toggleAndDelete.bind(this)
  }

  toggleAndDelete (fileName) {
    this.setState({
      chosenPicture: fileName
    })
    this.toggleDeleteModal()
  }

  deletePicture (fileName) {
    API.deleteGalleryPicture(this.props.restaurantId, fileName)
      .then(() => {
        window.location.href = this.props.path
      }).catch((error) => {
        console.log(error)
      })
  }

  toggleDeleteModal () {
    this.setState({
      deleteModal: !this.state.deleteModal
    })
  }

  fileSelectedHandler (event) {
    event.preventDefault()
    let reader = new FileReader()
    let file = event.target.files[0]
    this.setState({
      selectedFile: file
    })
    reader.onloadend = () => {
      this.setState({
        imagePreviewUrl: reader.result
      })
    }
    reader.readAsDataURL(file)
  }

  fileUploadHandler () {
    let fd = new FormData()
    fd.append('image', this.state.selectedFile, this.state.selectedFile.name)
    let onUploadProgress = progressEvent => {
      console.log('Upload Progress: ' + Math.round(progressEvent.loaded / progressEvent.total * 100) + '%')
    }
    API.uploadGalleryPicture(this.props.restaurantId, fd, onUploadProgress)
      .then(() => {
        this.setState({
          uploaded: 1,
          success: 1
        })
        window.location.href = this.props.path
      })
  }
  toggleModal () {
    this.setState({
      modal: !this.state.modal
    })
  }

  render () {
    const titlePic = this.state.imagePreviewUrl ? this.state.imagePreviewUrl : '../static/default.jpg'
    if (this.state.success) {
      setTimeout(() => {
        this.setState({
          success: 0
        })
      }, 1300)
    }
    return (
      <div>
        <Row className='login'>
          {this.props.pictures.map((picture) => (
            <Col className='col-sm-4'>
              <div className='text-center'>
                <img top width='100%' src={'data:image/jpeg;base64,' + Buffer.from(picture.file.data, 'binary').toString('base64')} alt='Card image cap' style={{
                  borderWidth: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 250,
                  height: 250,
                  borderRadius: 250
                }} />
                <Button size='sm' outline color='danger' onClick={() => this.toggleAndDelete(picture.name)} style={{width: '20px', height: '20px'}}> <Delete style={{marginTop: -12, marginLeft: -5}} /></Button>
              </div>
            </Col>
          ))}
          <Col className='col-sm-4'>
            <div style={{borderColor: '#f7f7f7'}} className='text-center'>
              <CardAdder onClick={this.toggleModal} />
            </div>
          </Col>
        </Row>
        <Modal isOpen={this.state.deleteModal} toggle={this.toggleDeleteModal} className={this.props.className}>
          <ModalHeader className='center'>Bild löschen</ModalHeader>
          <ModalBody>
            Wollen Sie das Bild wirklich löschen?
          </ModalBody>
          <ModalFooter>
            <Button color='danger' onClick={() => this.deletePicture(this.state.chosenPicture)}>Löschen</Button>{' '}
            <Button color='dark' onClick={this.toggleDeleteModal}>Abbrechen</Button>
          </ModalFooter>
        </Modal>
        <Modal size='lg' isOpen={this.state.modal} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal} style={{backgroundColor: '#f7f7f7'}}>Bild hochladen</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Img src={titlePic} style={{
                  marginLeft: 250,
                  borderWidth: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 250,
                  height: 250,
                  borderRadius: 250
                }} />
                {this.state.uploaded ? (
                  <div>
                    {this.state.success ? (
                      <Alert size='sm' color='success'>Bild wurde erfolgreich hochgeladen</Alert>
                    ) : ''}
                  </div>
                ) : (
                  <div>
                    <Input style={{marginLeft: 200, marginTop: 10}} type='file' name='file' id='exampleFile' onChange={this.fileSelectedHandler} />
                    <Button onClick={this.fileUploadHandler} color='warning' className='float-right' style={{marginTop: -32, marginRight: 220, width: '20px', height: '20px'}} size='sm' outline><Upload style={{marginTop: -12, marginLeft: -5}} /></Button>
                  </div>
                )}
              </FormGroup>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    )
  }
}
