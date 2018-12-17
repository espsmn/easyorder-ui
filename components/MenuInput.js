import React from 'react'
import CardInput from './CardInput'
import MenuDetailsInput from './MenuDetailsInput'

export default class MenuInput extends React.Component {
  render () {
    return (
      <div>
        <MenuDetailsInput />
        <br />
        <CardInput />
      </div>
    )
  }
}
