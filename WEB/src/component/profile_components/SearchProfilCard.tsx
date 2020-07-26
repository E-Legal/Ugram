import React from 'react'
import Card from 'react-bootstrap/Card'
import { Route, Link } from 'react-router-dom'
import Profil from './Profil'

class UserProfileCard extends React.Component<any> {

	render() {
		return (
			<Link to={{
				pathname: '/profil',
				state: { userId: this.props.id },
			}}>
				<Card style={{ width: '21rem', margin: '0 auto', float: "none" }}>
					<Card.Img variant="top" src={require('../../assets/profile_pic.png')} style={{ paddingLeft: '10px', paddingRight: '10px', paddingTop: '10px' }} />
					<Card.Body>
						<Card.Title>
							{this.props.username}
						</Card.Title>
						<Card.Footer style={{ background: 'white', paddingRight: '4px' }}>
							<small className="text-muted" style={{ float: 'left' }}>Name : {this.props.name}</small>
							<br />
							<small className="text-muted" style={{ float: 'left' }}>Last Name : {this.props.last_name}</small>
							<br />
							<small className="text-muted" style={{ float: 'left' }}>Email : {this.props.email}</small>
						</Card.Footer>
					</Card.Body>
				</Card>
				<Route path="/profil" component={Profil} />
			</Link>
		)
	}
}

export default UserProfileCard