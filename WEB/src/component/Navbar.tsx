import React from 'react'
import { Route, Link } from 'react-router-dom'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import Image from 'react-bootstrap/Image'
import App from './App'
import Login from './Login'
import Profil from './profile_components/Profil'
import Register from './Register'
import Notification from "./Notification";
import SingleImage from './SingleImage'
import UploadPage from './upload_images_components/UploadPage'
import SearchBar from "./Search/SearchBar";
import SearchResults from "../views/SearchResults";
import SearchAllUsers from "../views/SearchAllUsers";
import EditImage from "./EditImage";
import CommentImage from "./CommentImage";
import ReactGA from "react-ga";
// @ts-ignore
import cookie from 'react-cookies';
import { getPopularTags } from '../Api'
import * as Sentry from '@sentry/browser';

Sentry.init({dsn: "https://cdbd6a885536421f8b25d7304a864296@o379793.ingest.sentry.io/5205045"});

type Myprops = {

};

type Mystate = {
	isLoggedIn: boolean,
	popularTags: string[]
};

ReactGA.initialize('UA-163360846-1');
ReactGA.pageview(window.location.pathname + window.location.search);

class NavBar extends React.Component<Myprops, Mystate> {
	 constructor(props: any) {
		super(props);
		const isLoggedIn = (cookie.load("id") === undefined ? true : false);
		this.state = {
			isLoggedIn,
			popularTags: []
		};
		this.renderLogin = this.renderLogin.bind(this);
		this.callback = this.callback.bind(this);
	}

	componentDidMount(): void {
		const isLoggedIn = (cookie.load("id") === undefined ? false : true);
		const tags: string[] = [];
		if (isLoggedIn) {
			getPopularTags().then((response) => {
				response.data.forEach((element: any) => {
					tags.push(element.name)
				});
				this.setState({
					popularTags: tags
				})
			});
		}
		this.setState({
			isLoggedIn: isLoggedIn,
		});
	}

	renderPopularTags() {
		return (
			this.state.popularTags.map((value, index) => {
				const ref = "/search/Hashtag/" + value;
				return (
					<a href={ref} style={{ color: 'white', marginLeft: '10px'}}  key={index}>{value}</a>
				)
			})
		)
	}

	renderNavLink() {
		if (this.state.isLoggedIn) {
			return (
				<div>
					<Navbar expand="lg" bg="dark" variant="dark">
						<Navbar.Brand href="">UGRAM</Navbar.Brand>
						<Navbar.Toggle aria-controls="basic-navbar-nav" />
						<Navbar.Collapse id="basic-navbar-nav">
							<Nav className="mr-auto">
								<Nav.Link href="/home">
									Home
								</Nav.Link>
								<Nav.Link href="/notification">
									Notification
								</Nav.Link>
								<Button onClick={() => this.callback(false)} variant="primary">
									Logout
								</Button>
								<SearchBar />
							</Nav>
							<Nav className="mr-auto">
								<div style={{ color: "white"}}>Tags Populaires : </div>
								{this.renderPopularTags()}
							</Nav>
							<Button href="./searchAllUsers" variant="outline-success" size="sm">Show All Users</Button>
							<Button href="./upload" variant="outline-success" size="sm">Upload</Button>
							<Link to={{
								pathname: '/profil',
								state: { userId: cookie.load("id") }
							}}>
								<Image src={require('../assets/user_profile_icon.png')} fluid style={{ width: '45px', height: '45px', marginLeft: '12px' }} />
							</Link>
						</Navbar.Collapse>
					</Navbar>
				</div>
			)
		} else {
			return (
				<div>
					<Navbar expand="lg" bg="dark" variant="dark">
						<Navbar.Brand href="#home">UGRAM</Navbar.Brand>
						<Navbar.Toggle aria-controls="basic-navbar-nav" />
						<Navbar.Collapse id="basic-navbar-nav">
							<Nav className="mr-auto">
								<Nav.Link href="/home" >
									Home
								</Nav.Link>
								<Nav.Link href="/login" >
									Login
								</Nav.Link>
							</Nav>
						</Navbar.Collapse>
					</Navbar>
				</div>
			)
		}
	}

	renderLogin() {
		return (
			<Login callback={this.callback} />
		)
	}

	callback(logstatus: boolean) {
		this.setState({
			isLoggedIn: logstatus,
		});
		if (!logstatus) {
			cookie.remove("id");
			cookie.remove("token");
		}
	}


	render() {
		return (
			<div>
				{this.renderNavLink()}
				<Route path="/editImage" component={EditImage} />
				<Route exact path="/home" component={App} />
				<Route path="/login" render={this.renderLogin} />
				<Route path="/commentImage" component={CommentImage} />
				<Route path="/profil" component={Profil} />
				<Route path="/upload" component={UploadPage} />
				<Route path="/register" component={Register} />
				<Route path="/search/:tag/:input" component={SearchResults} />
				<Route path="/notification" component={Notification} />
				<Route path="/searchAllUsers" component={SearchAllUsers} />
				<Route path="/singleImage" component={SingleImage} />
			</div>
		)
	}
}

export default NavBar;