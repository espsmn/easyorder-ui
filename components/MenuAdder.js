import React from 'react'
import { Button, Card, Row, Col } from 'reactstrap'
import MenuInput from '../components/MenuInput'
import store from '../store/store'
import API from '../config/easyorder-api'

export default class MenuAdder extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: 0
    }
    this.saveToDatabase = this.saveToDatabase.bind(this)
  }

  saveToDatabase () {
    let mealArray = []
    let self = this
    API.addMenu(this.props.restaurantId, store.speisekartenInformationen.speisekartenTyp)
      .then((response) => {
        if (!store.speisekartenInformationen.speisen.length) {
          this.setState({
            done: true,
            modal: false
          })
          window.location.href = this.props.path
        } else {
          store.speisekartenInformationen.speisen.map((item) => {
            mealArray.push({
              name: item.meal,
              beschreibung: item.description,
              preis: item.price,
              bild: item.picture,
              skid: response.data.sk_id,
              stypid: item.mealType
            })
          })
          API.addMealsToMenu(mealArray)
            .then(() => {
              self.setState({
                done: true,
                modal: false
              })
              window.location.href = this.props.path
            })
        }
      })
  }

  render () {
    return (
      <Card style={{backgroundColor: '#f7f7f7'}}>
        <div className='login'>
          <br />
          <MenuInput />
          <br />
          <Row>
            <Col className='text-right'>
              <Button outline color='warning' onClick={() => this.saveToDatabase()}>Speichern</Button>{' '}
            </Col>
            <Col className='col-sm-2'>
              <Button outline color='dark' href={this.props.path}>Abbrechen</Button>
            </Col>
          </Row>
          <div>
            <br />
          </div>
        </div>
      </Card>
    )
  }
}
