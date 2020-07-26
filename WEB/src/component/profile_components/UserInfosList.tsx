import React from 'react'
import Container from 'react-bootstrap/Container'
import ListGroup from 'react-bootstrap/ListGroup'
import Image from 'react-bootstrap/Image'
import Button from 'react-bootstrap/Button'
import { profilInfos } from './Profil'
import ChangerUserInfosModals from './ChangeUserInfosModals'
import { updateProfileinfos } from '../../Api'
import { deleteAccount } from '../../Api'
import cookie from 'react-cookies'
import { Route } from 'react-router-dom'

type ProfilState = {
	showModal: Boolean,
	showModalLastName: Boolean,
	showModalEmail: Boolean,
	showModalNumber: Boolean,
	name: string,
	last_name: string,
	email: string,
	phone_number: string
}

class UserInfosList extends React.Component<any, ProfilState> {
	constructor(props: profilInfos) {
		super(props);
		this.state = {
			showModal: false,
			showModalLastName: false,
			showModalEmail: false,
			showModalNumber: false,
			name: props.name,
			last_name: props.last_name,
			email: props.email,
			phone_number: props.phone_number
		}
	}

	componentDidMount = () => {
		this.setState({
			name: this.props.name,
			last_name: this.props.last_name,
			email: this.props.email,
			phone_number: this.props.phone_number
		})
	};

	handleUserSaveChange = (setId: number, newValue: string) => {
		var data = {
			"email": this.props.email,
			"last_name": this.props.last_name,
			"name": this.props.name,
			"phone_number": this.props.phone_number,
			"username": this.props.username
		};
		switch (setId) {
			case 0: {
				data.username = newValue;
				break
			}
			case 1: {
				data.name = newValue;
				break
			}
			case 2: {
				data.last_name = newValue;
				break
			}
			case 3: {
				data.email = newValue;
				break
			}
			case 4: {
				data.phone_number = newValue;
				break
			}
		}
		updateProfileinfos(data).then((response) => {
			this.props.updateData()
		}).catch((error) => {
			alert(error.response.data);
		})
	};

	handleModalClick = (setId: number) => {
		switch (setId) {
			case 1: {
				this.setState({
					showModal: !this.state.showModal
				});
				break
			}
			case 2: {
				this.setState({
					showModalLastName: !this.state.showModalLastName
				});
				break
			}
			case 3: {
				this.setState({
					showModalEmail: !this.state.showModalEmail
				});
				break
			}
			case 4: {
				this.setState({
					showModalNumber: !this.state.showModalNumber
				});
				break
			}
		}

	};

	render() {
		return (
			<Container style={{ padding: "0rem", paddingBottom: "1rem" }}>
				<ListGroup variant="flush">
					<ListGroup.Item style={{ marginRight: "10px" }}>
						<span>{this.props.name}</span>
						{
							this.props.id === cookie.load("id") ?
								<Image src={require('../../assets/edit_icon.png')} style={{ float: "right", width: '20px', height: '20px' }} fluid onClick={() => this.handleModalClick(1)} /> :
								<div></div>
						}
					</ListGroup.Item>
					<ListGroup.Item style={{ marginRight: "10px" }}>
						<span>{this.props.last_name}</span>
						{
							this.props.id === cookie.load("id") ?
								<Image src={require('../../assets/edit_icon.png')} style={{ float: "right", width: '20px', height: '20px' }} fluid onClick={() => this.handleModalClick(2)} /> :
								<div></div>
						}
					</ListGroup.Item>
					<ListGroup.Item style={{ marginRight: "10px" }}>
						<span>{this.props.email}</span>
						{
							this.props.id === cookie.load("id") ?
								<Image src={require('../../assets/edit_icon.png')} style={{ float: "right", width: '20px', height: '20px' }} fluid onClick={() => this.handleModalClick(3)} /> :
								<div></div>
						}
					</ListGroup.Item>
					<ListGroup.Item style={{ marginRight: "10px" }}>
						<span>{this.props.phone_number}</span>
						{
							this.props.id === cookie.load("id") ?
								<Image src={require('../../assets/edit_icon.png')} style={{ float: "right", width: '20px', height: '20px' }} fluid onClick={() => this.handleModalClick(4)} /> :
								<div></div>
						}
					</ListGroup.Item>
					{
						this.props.id === cookie.load("id") ?
							<Route render={({ history }) => (
								<Button
									type='button'
									variant="danger"
									onClick={() => {
										deleteAccount().then((response) => {
											cookie.remove("id");
											cookie.remove("token");
											history.push('/login')
										}).catch((error) => {
											alert(error.response.data);
										})
									}}>
									Delete account
								</Button>
							)} />
							:
							<div></div>
					}
				</ListGroup>
				<ChangerUserInfosModals handleModalClick={this.handleModalClick}
					handleUserSaveChange={this.handleUserSaveChange}
					showModal={this.state.showModal}
					showModalEmail={this.state.showModalEmail}
					showModalLastName={this.state.showModalLastName}
					showModalNumber={this.state.showModalNumber}
				/>
			</Container>
		)
	}
}

export default UserInfosList