import React, { useState } from "react";
import { Button, FormGroup, FormControl, FormLabel, Toast } from "react-bootstrap";
import "../css/Login.css";
import { useHistory } from "react-router-dom";
import GoogleLogin from "react-google-login";
import {UserLogin, googleLogin} from "../Api";
// @ts-ignore
import cookie from 'react-cookies';

const Login = ({callback}: {callback: any}) => {
    const [apireturn, setApiReturn] = useState("");
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const history = useHistory();

    function validateForm() {
        return email.length > 0 && password.length > 0;
    }

    const responseFailedGoogle = (response : any) => {
        setApiReturn("User has close Oauth page !");
        setShow(true);
    };

    const responseGoogle = (response : any) => {
		googleLogin({
			name: response.profileObj.givenName,
			last_name: response.profileObj.familyName,
			email: response.profileObj.email,
			token: response.tokenObj.access_token,
			username: response.profileObj.name
		}).then((response) => {
            cookie.save('id', response.data.id, { path: '/' });
            cookie.save('token', response.data.token, { path: '/' });
            callback(true);
            history.push("/home");
        }).catch(error =>{
            setApiReturn("User as close Oauth page !");
            setShow(true);
        });
    };

    function handleSubmit(event: any) {
        event.preventDefault();
        UserLogin(email, password).then((response) => {
            cookie.save('id', response.data.id, { path: '/' });
            cookie.save('token', response.data.token, { path: '/' });
            callback(true);
            history.push("/home");
        }).catch(error => {
            setApiReturn(error.response.data);
            setShow(true);
        });
    }

    return (
        <div className="Login">
            <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide>
                <Toast.Body>{apireturn}</Toast.Body>
            </Toast>
            <form onSubmit={handleSubmit}>
                <FormGroup controlId="email" >
                    <FormLabel>Email</FormLabel>
                    <FormControl
                        autoFocus
                        type="email"
                        value={email}
                        onChange={(event: any) => setEmail(event.target.value)}
                    />
                </FormGroup>
                <FormGroup controlId="password">
                    <FormLabel>Password</FormLabel>
                    <FormControl
                        value={password}
                        onChange={(event: any) => setPassword(event.target.value)}
                        type="password"
                    />
                </FormGroup>
                <Button block disabled={!validateForm()} type="submit">
                    Login
                </Button>
                <GoogleLogin
                    className="Googlebtn"
                    clientId="642054744690-jmre5c8u9nksrrk3mbkbqdh7dshdjol2.apps.googleusercontent.com"
                    buttonText="Login"
                    onSuccess={responseGoogle}
                    onFailure={responseFailedGoogle}
                    cookiePolicy={'single_host_origin'}
                />
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <p className="Register_text"><a href="/register">Click Here</a> to create your account</p>
            </form>
        </div>
    );
};

export default Login;
