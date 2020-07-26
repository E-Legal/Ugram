import React from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Accordion from 'react-bootstrap/Accordion'
import UserInfosList from './UserInfosList'

class UserProfileCard extends React.Component<any, {}> {
	render() {
		return (
			<Accordion defaultActiveKey='1' style={{ paddingTop: "16px" }}>
				<Card style={{ width: '21rem', margin: '0 auto', float: "none" }}>
					<Card.Img variant="top" src={require('../../assets/profile_pic.png')} style={{ paddingLeft: '10px', paddingRight: '10px', paddingTop: '10px' }} />
					<Card.Body>
						<Card.Title>
							{this.props.username}
						</Card.Title>
						<Accordion.Toggle as={Button} variant="outline-primary" eventKey="0" style={{ marginTop: '1rem', marginBottom: '1rem' }} size="sm">
							About ...
						</Accordion.Toggle>
						<Accordion.Collapse eventKey="0">
							<UserInfosList {...this.props} updateData={this.props.updateData} />
						</Accordion.Collapse>
					</Card.Body>
				</Card>
			</Accordion>
		)
	}
}

export default UserProfileCard

