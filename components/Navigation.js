import React from 'react'
import Head from 'next/head'
import { Navbar, NavbarBrand, Nav, NavItem, Modal, ModalHeader, ModalFooter, Button, Container } from 'reactstrap'

export default class Navigation extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      logoutModal: 0
    }
    this.toggleModal = this.toggleModal.bind(this)
    this.logout = this.logout.bind(this)
  }

  toggleModal () {
    this.setState({
      logoutModal: !this.state.logoutModal
    })
  }

  logout () {
    window.location.href = '/'
  }

  render () {
    return (
      <div style={{backgroundColor: '#424242'}}>
        <Head>
          <title>EasyOrder</title>
          <meta charSet='utf-8' />
          <meta name='viewport' content='initial-scale=1.0, width=device-width' />
          <link href='/static/bootstrap.min.css' rel='stylesheet' />
          <link href='/static/style.css' rel='stylesheet' />
        </Head>
        <Navbar color='#545454' light expand='md'>
          <Container>
            <NavbarBrand href={this.props.newHref || '/'}>
              <img src='../static/LogoEasyOrder.png' style={{width: 250, height: 50}} />
            </NavbarBrand>
            {this.props.login ? (
              <Nav className='ml-auto' navbar>
                <NavItem>
                  <Button outline color='warning' onClick={this.toggleModal}>LogOut</Button>
                </NavItem>
              </Nav>
            ) : ''}
          </Container>
          <Modal isOpen={this.state.logoutModal} toggle={this.toggleModal}>
            <ModalHeader>Wollen Sie sich wirklich ausloggen?</ModalHeader>
            <ModalFooter>
              <Button color='dark' onClick={this.logout}>Ausloggen</Button>{' '}
              <Button color='secondary' onClick={this.toggleModal}>Abbrechen</Button>
            </ModalFooter>
          </Modal>
        </Navbar>
      </div>
    )
  }
}
