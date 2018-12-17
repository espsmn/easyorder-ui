/* global */
import React from 'react'
import {Button} from 'reactstrap'
import Plus from 'react-icons/lib/md/add'

export default class CardAdder extends React.Component {
  render () {
    return (
      <Button onClick={this.props.onClick} outline color='secondary' style={{
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: 250,
        height: 250,
        borderRadius: 250
      }} ><Plus style={{width: 40, height: 40}} /></Button>
    )
  }
}
