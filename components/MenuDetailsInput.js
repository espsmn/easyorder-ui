import React from 'react'
import { Form, FormGroup, Label, Input, Card, CardBody, CardTitle, CardText } from 'reactstrap'
import store from '../store/store'

export default class MenuDetailsInput extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      mealType: ''
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (e) {
    this.setState({ [e.target.name]: e.target.value })
    store.speisekartenInformationen.speisekartenTyp = e.target.value
    store.speisekartenLock = true
  }

  render () {
    return (
      <Card>
        <CardBody>
          <CardTitle className='text-center'>Neue Speisekarte anlegen</CardTitle>
          <CardText>
            <Form>
              <Label>Art der Speisekarte</Label>
              <FormGroup>
                <Input type='select' name='mealType' value={this.state.mealType} onChange={this.handleChange}>
                  <option value='1'>Hauptkarte</option>
                  <option value='2'>Mittagskarte</option>
                  <option value='3'>Tageskarte</option>
                  <option value='4'>Getränkekarte</option>
                  <option value='5'>Dessertkarte</option>
                </Input>
              </FormGroup>
            </Form>
          </CardText>
        </CardBody>
      </Card>
    )
  }
}
