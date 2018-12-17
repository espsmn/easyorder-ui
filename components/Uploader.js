/* global FileReader FormData */
import React from 'react'
import { Form, FormGroup, Input, Button, Alert, Modal, ModalFooter, ModalHeader, ModalBody } from 'reactstrap'
import Img from 'react-image'
import API from '../config/easyorder-api'
import Upload from 'react-icons/lib/fa/upload'
import Delete from 'react-icons/lib/md/delete-forever'
import Loader from './Loader'

/* TODO: use this class for uploading the rest of the pictures */
export default class Uploader extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedFile: null,
      imagePreviewUrl: '../static/default.jpg',
      uploaded: 0,
      loading: 1,
      success: 0,
      modal: 0
    }
    this.fileSelectedHandler = this.fileSelectedHandler.bind(this)
    this.fileUploadHandler = this.fileUploadHandler.bind(this)
    this.deleteTitlePicture = this.deleteTitlePicture.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
  }

  toggleModal () {
    this.setState({
      modal: !this.state.modal
    })
  }

  deleteTitlePicture () {
    API.deleteTitlePicture(this.props.restaurantId)
      .then(() => {
        this.setState({
          selectedFile: null,
          imagePreviewUrl: '../static/default.jpg',
          uploaded: 0,
          loading: 1,
          modal: 0
        })
      }).then(() => {
        setTimeout(() => {
          this.setState({
            loading: 0
          })
        }, 500)
      }).catch((error) => {
        console.log(error)
      })
  }

  componentWillMount () {
    setTimeout(() => {
      this.setState({
        loading: 0
      })
    }, 2500)
    API.getTitlePicture(this.props.restaurantId)
      .then((data) => {
        this.setState({
          imagePreviewUrl: 'data:image/jpeg;base64,' + data,
          uploaded: 1,
          loading: 0
        })
      }).catch(() => {
        this.setState({
          loading: 0
        })
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
    API.uploadTitlePicture(this.props.restaurantId, fd, onUploadProgress)
      .then((response) => {
        console.log(response)
        this.setState({
          uploaded: 1,
          success: 1
        })
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
        <Form>
          {this.state.loading ? (
            <div className='loader'>
              <Loader color={'#FF8000'} loading={this.state.loading} size={200} />
            </div>
          ) : (
            <FormGroup>
              <Img src={titlePic} style={{height: this.props.height, width: this.props.width, opacity: (this.state.success ? 0.4 : 1)}} />
              {this.state.uploaded ? (
                <div>
                  {this.state.success ? (
                    <Alert size='sm' color='success'>Bild wurde erfolgreich hochgeladen</Alert>
                  ) : (
                    <Button onClick={this.toggleModal} color='danger' className='float-right' style={{width: '20px', height: '20px'}} size='sm' outline><Delete style={{marginTop: -12, marginLeft: -5}} /></Button>
                  )}
                </div>
              ) : (
                <div className={this.props.className} style={{height: this.props.height, width: this.props.width}}>
                  <Input type='file' name='file' id='exampleFile' onChange={this.fileSelectedHandler} />
                  <Button onClick={this.fileUploadHandler} color='warning' className='float-right' style={{marginTop: -25, marginRight: 20, width: '20px', height: '20px'}} size='sm' outline><Upload style={{marginTop: -12, marginLeft: -5}} /></Button>
                </div>
              )}
            </FormGroup>
          )}
        </Form>
        <Modal isOpen={this.state.modal} toggleDelete={this.toggleModal}>
          <ModalHeader toggleDelete={this.toggleModal} className='center'>Titelbild löschen</ModalHeader>
          <ModalBody>Sind Sie sich sicher, dass Sie das Titelbild löschen möchten?</ModalBody>
          <ModalFooter>
            <Button outline color='danger' onClick={this.deleteTitlePicture}>Löschen <Delete /></Button>{' '}
            <Button outline color='dark' onClick={this.toggleModal}>Abbrechen</Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}
