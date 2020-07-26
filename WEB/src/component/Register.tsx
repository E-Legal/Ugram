import React, { useState } from "react";
import { Button, FormGroup, FormControl, FormLabel, Toast } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import "../css/Login.css";
import {UserRegister} from "../Api";

export default function Register(props: any) {
    const [apireturn, setApiReturn] = useState("");
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [last_name, setLastName] = useState("");
    const [phone_number, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");

    const history = useHistory();

    function validateForm() {
        return email.length > 0 && password.length > 0 && username.length > 0 && name.length > 0 && last_name.length > 0 && phone_number.length > 0;
    }

    function handleSubmit(event: any) {
        event.preventDefault();
        UserRegister(username, name, last_name, email, phone_number, password).then((response) => {
            history.push("/login");
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
                <FormGroup controlId="username" >
                    <FormLabel>Username</FormLabel>
                    <FormControl
                        autoFocus
                        type="text"
                        value={username}
                        onChange={(event: any) => setUsername(event.target.value)}
                    />
                </FormGroup>
                <FormGroup controlId="name" >
                    <FormLabel>Name</FormLabel>
                    <FormControl
                        autoFocus
                        type="text"
                        value={name}
                        onChange={(event: any) => setName(event.target.value)}
                    />
                </FormGroup>
                <FormGroup controlId="last_name" >
                    <FormLabel>Last Name</FormLabel>
                    <FormControl
                        autoFocus
                        type="text"
                        value={last_name}
                        onChange={(event: any) => setLastName(event.target.value)}
                    />
                </FormGroup>
                <FormGroup controlId="phone_number" >
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl
                        autoFocus
                        type="text"
                        value={phone_number}
                        onChange={(event: any) => setPhoneNumber(event.target.value)}
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
            </form>
        </div>
    );
}