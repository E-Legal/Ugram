import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import UserProfileCard from './UserProfileCard'
import ImageComponent from '../Image'
import { ImageInfos } from '../Image'
import cookie from 'react-cookies'
import { getProfileInfos } from '../../Api'

export type profilInfos = {
  name: string,
  username: string,
  last_name: string,
  phone_number: string,
  email: string,
  images: ImageInfos[],
  id: string
}

type ProfilProps = {
  userId: string
}

type ProfilState = {
  profil: {
    id: string,
    name: string,
    username: string,
    last_name: string,
    phone_number: string,
    email: string,
    images: ImageInfos[],
  },
  userId: string
  showImg: boolean,
  images: ImageInfos[]
}

class Profil extends React.Component<any, ProfilState> {
  state: ProfilState;
  constructor(props: profilInfos) {
    super(props);
    this.state = {
      profil: require('../../json/singleUser.json'),
      userId: this.props.userId,
      images: require('../../json/images.json'),
      showImg: false
    }
  }

  componentDidMount = async () => {
    const userId = (this.props.location.state.userId === null) ? cookie.load('id') : this.props.location.state.userId;
    await getProfileInfos(userId).then((response) => {
      this.setState({
        profil: response.data,
        showImg: true
      });
    })
      .catch((error) => {
        alert(error.response.data);
      })
  };

  updateData = async () => {
    const userId = (this.props.location.state.userId === null) ? cookie.load('id') : this.props.location.state.userId
    await getProfileInfos(userId).then((response) => {
      this.setState({
        profil: response.data,
        showImg: true
      })
    })
      .catch((error) => {
        alert(error.response.data);
      })
  };

  render() {
    return (
      <Container>
        <Row>
          <Col lg={4}>
            <Container fluid>
              <Row>
                <UserProfileCard {...this.state.profil} updateData={this.updateData} />
              </Row>
            </Container>
          </Col>
          {
            this.state.showImg ?
              <Col lg={8}>
                <Container fluid style={{ padding: '1rem' }}>
                  <ul >
                    {this.state.profil.images.map((img: ImageInfos, index) => {
                      img.test = img.key;
                      img.currentUserId = this.state.profil.id;
                      return <ImageComponent key={index} {...img} />
                    })}
                  </ul>
                </Container>
              </Col>
              :
              <div></div>
          }

        </Row>
      </Container>
    )
  }
}

export default Profil
