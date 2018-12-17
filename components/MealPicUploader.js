/* global FileReader FormData */
import React from 'react'
import { Form, FormGroup, Input, Button, Alert } from 'reactstrap'
import Img from 'react-image'
import API from '../config/easyorder-api'
import Upload from 'react-icons/lib/fa/upload'

/* TODO: use this class for uploading the rest of the pictures */
export default class MealPicUploader extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedFile: null,
      uploaded: 0
    }
    this.fileSelectedHandler = this.fileSelectedHandler.bind(this)
    this.fileUploadHandler = this.fileUploadHandler.bind(this)
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
    API.uploadPicture(this.props.mealId, fd, onUploadProgress)
      .then((response) => {
        console.log(response)
        this.setState({
          uploaded: 1,
          success: 1
        })
      })
  }

  render () {
    const mealPic = this.state.imagePreviewUrl ? this.state.imagePreviewUrl : this.props.image ? this.props.image : '../static/default.jpg'
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
          <FormGroup>
            <Img src={mealPic} style={{height: this.props.height, width: this.props.width, opacity: (this.state.success ? 0.4 : 1)}} />
            {this.state.uploaded ? (
              <div>
                {this.state.success ? (
                  <Alert size='sm' color='success'>Bild wurde erfolgreich hochgeladen</Alert>
                ) : ''}
              </div>
            ) : (
              <div>
                <Input style={{marginLeft: -2, marginTop: 10}} type='file' name='file' id='exampleFile' onChange={this.fileSelectedHandler} />
                <br />
                <Button onClick={this.fileUploadHandler} outline color='warning' className='float-right' size='sm' block><Upload /> Hochladen</Button>
              </div>
            )}
          </FormGroup>
        </Form>
      </div>
    )
  }
}
