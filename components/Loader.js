import React from 'react'
import { RingLoader } from 'react-spinners'
import Center from 'react-center'

const Loader = props => (
  <Center>
    <RingLoader
      color={props.color}
      loading={props.loading}
      size={props.size}
    />
  </Center>
)

export default Loader
