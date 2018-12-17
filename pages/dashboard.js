import React from 'react'
import {Card, CardBody, CardFooter, Col, Row, Tooltip} from 'reactstrap'
import Navigation from '../components/Navigation'
import CardAdder from '../components/CardAdder'
import API from '../config/easyorder-api'
import Uploader from '../components/Uploader'
import MenuEdit from '../components/MenuEdit'
import MenuAdder from '../components/MenuAdder'
import Loader from '../components/Loader'
import Info from 'react-icons/lib/fa/info-circle'
import Galerie from '../components/Galerie'

export default class Dashboard extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedFile: 1,
      restaurantId: 0,
      restaurantData: {},
      menuData: [],
      frontPage: 1,
      editMenu: 0,
      addMenu: 0,
      loading: 1,
      selectedMenu: 0,
      galleryPictures: [],
      error: 0,
      logoTooltipOpen: 0,
      menuTooltipOpen: 0,
      galleryTooltipOpen: 0
    }
    this.logoToggle = this.logoToggle.bind(this)
    this.menuToggle = this.menuToggle.bind(this)
    this.galleryToggle = this.galleryToggle.bind(this)
  }

  logoToggle () {
    this.setState({
      logoTooltipOpen: !this.state.logoTooltipOpen
    })
  }

  menuToggle () {
    this.setState({
      menuTooltipOpen: !this.state.menuTooltipOpen
    })
  }

  galleryToggle () {
    this.setState({
      galleryTooltipOpen: !this.state.galleryTooltipOpen
    })
  }

  componentDidMount () {
    API.getRestaurantId(this.props.url.query.login)
      .then((result) => {
        this.setState({
          restaurantId: result.data.restaurantId
        })
      }).then(() => {
        API.getRestaurantOverview(this.state.restaurantId)
          .then((overview) => {
            this.setState({
              restaurantData: overview.restaurant[0],
              menuData: overview.menu
            })
          }).then(() => {
            API.getGalleryPictures(this.state.restaurantId)
              .then((pictures) => {
                this.setState({
                  galleryPictures: pictures,
                  loading: 0
                })
              })
          })
      }).catch((e) => {
        console.log(e)
        this.setState({
          error: 1
        })
      })
  }

  render () {
    const restaurantInformation = this.state.restaurantData ? this.state.restaurantData : ''
    const menuInformation = !this.state.loading ? this.state.menuData : []
    return (

      <div className='font'>
        <Navigation login newHref={this.props.url.asPath} />
        {this.state.error ? (
          <div>
            <Card>
              <CardBody>
                <h4>Uuuups, hier ist ein Fehler aufgegtreten!</h4>
                <p>Klicken Sie <a href={this.props.url.asPath}>hier</a> um die Seite neu zu laden.</p>
              </CardBody>
            </Card>
          </div>
        ) : (
          <div>
            {this.state.loading ? (
              <div className='loader'>
                <Loader color={'#FF8000'} loading={this.state.loading} size={200} />
              </div>
            ) : this.state.frontPage ? (
              <div>
                <Card style={{ backgroundColor: '#f7f7f7', height: '370px' }}>
                  <CardBody className='login'>
                    <Row>
                      <Col>
                        <div>
                          <Uploader width='500px' height='300px' restaurantId={this.state.restaurantId} />
                          <br />
                        </div>
                      </Col>
                      <Col>
                        <Card style={{height: '300px', width: '350px', borderColor: '#f7f7f7', marginLeft: 80, backgroundColor: '#f7f7f7'}}>
                          <div>
                            <br /><br />
                            <h1>{restaurantInformation.restaurant_name}</h1>
                            <br />
                            <h2>{restaurantInformation.plz} {restaurantInformation.ort_name}</h2>
                            <br />
                            <h3>{restaurantInformation.geschlossen ? 'Geschlossen' : 'Geöffnet'}</h3>
                            <br />
                            <Info className='info' id='TooltipExample' style={{height: '30px', width: '30px'}} />
                            <Tooltip placement='left' isOpen={this.state.logoTooltipOpen} target='TooltipExample' toggle={this.logoToggle}>
                              Hier können Sie ihr Logo hochladen!
                            </Tooltip>
                          </div>
                        </Card>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
                <br />
                <Row className='login'>
                  <Col>
                    <h1 className='text-center' style={{marginBottom: 30}}>Speisekarten <Info className='info' id='MenuTooltipExample' style={{height: '30px', width: '30px'}} /></h1>
                    <Tooltip placement='bottom' isOpen={this.state.menuTooltipOpen} target='MenuTooltipExample' toggle={this.menuToggle}>
                      Hier können Sie Speisekarten erstellen!
                    </Tooltip>
                  </Col>
                </Row>
                <Row className='login'>
                  {menuInformation.map((menu) => (
                    <Col className='col-sm-4'>
                      <div class='container' className='text-center'>
                        <Card onClick={() => this.setState({ editMenu: 1, selectedMenu: menu.sk_id, frontPage: 0 })} style={{borderColor: '#545454', alignItems: 'center', justifyContent: 'center', width: 250, height: 250, borderRadius: 250}}>
                          <img top width='100%' src={`../static/${menu.typ}.png`} alt='Card image cap' onClick={() => this.setState({ editMenu: 1, selectedMenu: menu.sk_id, frontPage: 0 })} style={{width: 150, heigt: 150}} />
                          <CardFooter style={{backgroundColor: '#ffffff'}}>{menu.typ}</CardFooter>
                        </Card>
                      </div>
                      <br />
                    </Col>
                  ))}
                  <Col className='col-sm-4'>
                    <div style={{borderColor: '#f7f7f7'}} className='text-center' class='container'>
                      <CardAdder onClick={() => this.setState({ addMenu: 1, frontPage: 0 })} restaurantId={this.state.restaurantId} />
                    </div>
                  </Col>
                </Row>
                <br />
                <hr className='my-4' />
                <Row className='login'>
                  <Col>
                    <h1 className='text-center' style={{marginBottom: 30}}>Galerie <Info className='info' id='GalleryTooltipExample' style={{height: '30px', width: '30px'}} /></h1>
                    <Tooltip placement='bottom' isOpen={this.state.galleryTooltipOpen} target='GalleryTooltipExample' toggle={this.galleryToggle}>
                      Hier können Sie Bilder des Restaurants hochladen!
                    </Tooltip>
                  </Col>
                </Row>
                <Galerie path={this.props.url.asPath} restaurantId={this.state.restaurantId} pictures={this.state.galleryPictures[0] ? this.state.galleryPictures : []} />
                <br />
              </div>
            ) : this.state.editMenu ? (
              <div>
                <MenuEdit path={this.props.url.asPath} title='Edit' menuId={this.state.selectedMenu} restaurantId={this.state.restaurantId} />
              </div>
            ) : this.state.addMenu ? (
              <div>
                <MenuAdder path={this.props.url.asPath} restaurantId={this.state.restaurantId} />
              </div>
            ) : ''}
          </div>
        )}

      </div>
    )
  }
}
